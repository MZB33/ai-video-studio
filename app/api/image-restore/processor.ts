async function dataUrlToBuffer(dataUrl: string) {

  const matches = dataUrl.match(/^data:(.+);base64,(.*)$/);
  if (!matches) return null;
  const b64 = matches[2];
  return Buffer.from(b64, "base64");
}

async function urlToBuffer(url: string) {
  const resp = await fetch(url);
  if (!resp.ok) return null;
  const arrayBuffer = await resp.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function bufferToDataUrl(buf: Buffer, mime = "image/jpeg") {
  return `data:${mime};base64,${buf.toString("base64")}`;
}

export async function processImage(image: string, mode: string) {
  // Try generic external model first
  const modelUrl = process.env.MODEL_API_URL;
  if (modelUrl) {
    try {
      const resp = await fetch(modelUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(process.env.MODEL_API_KEY ? { Authorization: `Bearer ${process.env.MODEL_API_KEY}` } : {}) },
        body: JSON.stringify({ image, mode }),
      });
      const data = await resp.json();
      if (resp.ok && data?.image) return { image: data.image, source: "external" };
    } catch (e) {
      // continue
    }
  }

  // Replicate
  const replicateToken = process.env.REPLICATE_API_TOKEN;
  const replicateModelVersion = process.env.REPLICATE_MODEL_VERSION;
  if (replicateToken && replicateModelVersion) {
    try {
      const createResp = await fetch("https://api.replicate.com/v1/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Token ${replicateToken}` },
        body: JSON.stringify({ version: replicateModelVersion, input: { image, mode } }),
      });
      const createData = await createResp.json();
      if (createResp.ok) {
        const statusUrl = `https://api.replicate.com/v1/predictions/${createData.id}`;
        for (let i = 0; i < 20; i++) {
          const poll = await fetch(statusUrl, { headers: { Authorization: `Token ${replicateToken}` } });
          const pollData = await poll.json();
          if (pollData.status === "succeeded") {
            const output = pollData.output;
            const first = Array.isArray(output) ? output[0] : output;
            if (typeof first === "string" && first.startsWith("http")) {
              const buf = await urlToBuffer(first);
              if (buf) {
                const dataUrl = await bufferToDataUrl(buf, "image/jpeg");
                return { image: dataUrl, source: "replicate" };
              }
            }
            return { image: first, source: "replicate" };
          }
          if (pollData.status === "failed") break;
          await new Promise((r) => setTimeout(r, 1500));
        }
      }
    } catch (e) {
      // continue
    }
  }

  // sharp fallback
  try {
    let sharpImport;
    try {
      sharpImport = await import("sharp");
    } catch (e) {
      throw new Error("No processing backend available (no MODEL_API_URL, no Replicate, and sharp not installed)");
    }
    const sharp = sharpImport.default || sharpImport;
    let buf = await dataUrlToBuffer(image);
    if (!buf) buf = await urlToBuffer(image);
    if (!buf) throw new Error("Failed to read image data");

    let outBuf: Buffer;
    const img = sharp(buf);
    if (mode === "enhance") {
      outBuf = await img.resize({ width: 2048, withoutEnlargement: true }).sharpen().modulate({ brightness: 1.03, saturation: 1.05 }).jpeg({ quality: 92 }).toBuffer();
    } else if (mode === "denoise") {
      outBuf = await img.resize({ width: 2048, withoutEnlargement: true }).median(1).blur(0.5).jpeg({ quality: 90 }).toBuffer();
    } else if (mode === "colorize") {
      outBuf = await img.resize({ width: 2048, withoutEnlargement: true }).modulate({ saturation: 1.1 }).tint({ r: 230, g: 200, b: 170 }).jpeg({ quality: 90 }).toBuffer();
    } else {
      outBuf = await img.resize({ width: 2048, withoutEnlargement: true }).sharpen().jpeg({ quality: 90 }).toBuffer();
    }

    const outDataUrl = await bufferToDataUrl(outBuf, "image/jpeg");
    return { image: outDataUrl, source: "sharp" };
  } catch (err) {
    throw err;
  }
}
