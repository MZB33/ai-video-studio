function hashText(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function writeWavHeader(view: DataView, sampleRate: number, sampleCount: number): void {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = sampleCount * blockAlign;

  const writeString = (offset: number, text: string) => {
    for (let i = 0; i < text.length; i += 1) {
      view.setUint8(offset + i, text.charCodeAt(i));
    }
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(36, "data");
  view.setUint32(40, dataSize, true);
}

function buildSyntheticWaveform(text: string, durationSeconds: number, speed: number, pitch: number, energy: number): Int16Array {
  const sampleRate = 22050;
  const sampleCount = Math.max(Math.floor(sampleRate * durationSeconds), sampleRate);
  const samples = new Int16Array(sampleCount);
  const seed = hashText(text);
  const baseFreq = 120 + (seed % 70);
  const harmonic = 1.8 + ((seed >> 3) % 7) / 10;
  const modulation = 2 + ((seed >> 5) % 6);

  for (let i = 0; i < sampleCount; i += 1) {
    const t = i / sampleRate;
    const dynamicFreq = baseFreq * pitch + Math.sin(t * modulation) * 6;
    const envelope = Math.min(1, t * 4) * Math.max(0.2, 1 - t / durationSeconds);
    const waveA = Math.sin(2 * Math.PI * dynamicFreq * t * speed);
    const waveB = 0.5 * Math.sin(2 * Math.PI * dynamicFreq * harmonic * t * speed);
    const waveC = 0.2 * Math.sin(2 * Math.PI * (dynamicFreq / 2) * t);
    const amplitude = Math.min(Math.max(energy, 0.5), 1.5) * 0.28;
    const sample = (waveA + waveB + waveC) * envelope * amplitude;
    samples[i] = Math.max(-32767, Math.min(32767, Math.floor(sample * 32767)));
  }

  return samples;
}

function toDb(value: number): number {
  if (value <= 0) {
    return -120;
  }
  return Number((20 * Math.log10(value)).toFixed(2));
}

function buildWaveformPoints(samples: Int16Array, segments = 96): number[] {
  const points: number[] = [];
  const segmentSize = Math.max(1, Math.floor(samples.length / segments));

  for (let i = 0; i < segments; i += 1) {
    const start = i * segmentSize;
    const end = Math.min(samples.length, start + segmentSize);
    let peak = 0;
    for (let j = start; j < end; j += 1) {
      const normalized = Math.abs(samples[j]) / 32767;
      if (normalized > peak) {
        peak = normalized;
      }
    }
    points.push(Number(peak.toFixed(3)));
  }

  return points;
}

function analyzeSamples(samples: Int16Array, sampleRate: number) {
  let sumSquares = 0;
  let peak = 0;

  for (let i = 0; i < samples.length; i += 1) {
    const normalized = samples[i] / 32767;
    sumSquares += normalized * normalized;
    peak = Math.max(peak, Math.abs(normalized));
  }

  const rms = Math.sqrt(sumSquares / samples.length);
  const peakDbfs = toDb(peak);
  const rmsDbfs = toDb(rms);
  const estimatedLufs = Number((rmsDbfs - 1.5).toFixed(2));
  const crestFactorDb = Number((peakDbfs - rmsDbfs).toFixed(2));
  const waveformPoints = buildWaveformPoints(samples);

  return {
    durationSeconds: Number((samples.length / sampleRate).toFixed(2)),
    sampleRate,
    peakDbfs,
    rmsDbfs,
    estimatedLufs,
    crestFactorDb,
    waveformPoints,
    recommendedRange: {
      peakDbfsMax: -1,
      rmsDbfsMin: -26,
      rmsDbfsMax: -14,
      estimatedLufsMin: -24,
      estimatedLufsMax: -16,
    },
  };
}

function toDataUrl(samples: Int16Array, sampleRate: number): string {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  writeWavHeader(view, sampleRate, samples.length);

  let offset = 44;
  for (let i = 0; i < samples.length; i += 1) {
    view.setInt16(offset, samples[i], true);
    offset += 2;
  }

  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }

  const base64 = Buffer.from(binary, "binary").toString("base64");
  return `data:audio/wav;base64,${base64}`;
}

export function buildAudioPackage(args: {
  text: string;
  speed: number;
  pitch: number;
  energy: number;
}) {
  const words = args.text.split(/\s+/).filter(Boolean).length;
  const durationSeconds = Math.min(Math.max(words / (2.3 * Math.max(args.speed, 0.6)), 2.5), 24);
  const sampleRate = 22050;
  const samples = buildSyntheticWaveform(args.text, durationSeconds, args.speed, args.pitch, args.energy);
  const audioDataUrl = toDataUrl(samples, sampleRate);
  const analytics = analyzeSamples(samples, sampleRate);

  return {
    audioDataUrl,
    analytics,
  };
}

export function buildAudioDataUrl(args: {
  text: string;
  speed: number;
  pitch: number;
  energy: number;
}): string {
  return buildAudioPackage(args).audioDataUrl;
}
