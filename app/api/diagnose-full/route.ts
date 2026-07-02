import { NextResponse } from "next/server";

// Test each provider with an actual API call
async function testProvider(
  name: string,
  key: string | null
): Promise<{ success: boolean; message: string; status: number }> {
  if (!key)
    return { success: false, message: "❌ No API key provided", status: 0 };

  const testText = "Hello world";

  if (name === "huggingface") {
    try {
      const res = await fetch(
        "https://api-inference.huggingface.co/models/facebook/mms-tts-eng",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputs: testText }),
        }
      );
      if (res.ok) return { success: true, message: "✅ API call successful", status: res.status };
      const text = await res.text();
      return {
        success: false,
        message: `❌ HuggingFace ${res.status}: ${text.slice(0, 150)}`,
        status: res.status,
      };
    } catch (e) {
      return {
        success: false,
        message: `❌ HuggingFace Network error: ${e instanceof Error ? e.message : String(e)}`,
        status: 0,
      };
    }
  }

  if (name === "elevenlabs") {
    try {
      const res = await fetch(
        "https://api.elevenlabs.io/v1/text-to-speech/ErXwobaYiN019PkySvjV",
        {
          method: "POST",
          headers: { "xi-api-key": key, "Content-Type": "application/json" },
          body: JSON.stringify({
            text: testText,
            model_id: "eleven_multilingual_v2",
            voice_settings: { stability: 0.5, similarity_boost: 0.8 },
          }),
        }
      );
      if (res.ok) return { success: true, message: "✅ API call successful", status: res.status };
      const text = await res.text();
      return {
        success: false,
        message: `❌ ElevenLabs ${res.status}: ${text.slice(0, 150)}`,
        status: res.status,
      };
    } catch (e) {
      return {
        success: false,
        message: `❌ ElevenLabs Network error: ${e instanceof Error ? e.message : String(e)}`,
        status: 0,
      };
    }
  }

  if (name === "voicerss") {
    try {
      const params = new URLSearchParams({
        key,
        src: testText,
        hl: "en-us",
        c: "MP3",
        f: "44khz_16bit_stereo",
        b64: "true",
      });
      const res = await fetch("https://api.voicerss.org/", {
        method: "POST",
        body: params.toString(),
      });
      const txt = await res.text();
      if (txt.startsWith("ERROR"))
        return {
          success: false,
          message: `❌ VoiceRSS: ${txt}`,
          status: res.status,
        };
      if (txt.length > 0)
        return { success: true, message: "✅ API call successful", status: res.status };
      return { success: false, message: "❌ VoiceRSS: Empty response", status: res.status };
    } catch (e) {
      return {
        success: false,
        message: `❌ VoiceRSS Network error: ${e instanceof Error ? e.message : String(e)}`,
        status: 0,
      };
    }
  }

  if (name === "openai") {
    try {
      const res = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ model: "tts-1", input: testText, voice: "alloy" }),
      });
      if (res.ok) return { success: true, message: "✅ API call successful", status: res.status };
      const text = await res.text();
      return {
        success: false,
        message: `❌ OpenAI ${res.status}: ${text.slice(0, 150)}`,
        status: res.status,
      };
    } catch (e) {
      return {
        success: false,
        message: `❌ OpenAI Network error: ${e instanceof Error ? e.message : String(e)}`,
        status: 0,
      };
    }
  }

  return {
    success: false,
    message: "⚠️ Provider not tested",
    status: 0,
  };
}

export async function GET() {
  // Get all API keys
  const keys = {
    voicerss: (process.env.VOICERSS_API_KEY ?? "").trim(),
    huggingface: (process.env.HUGGINGFACE_API_KEY ?? "").trim(),
    elevenlabs: (process.env.ELEVENLABS_API_KEY ?? "").trim(),
    openai: (process.env.OPENAI_API_KEY ?? "").trim(),
    google: (process.env.GOOGLE_TTS_KEY ?? "").trim(),
  };

  // Validate keys
  const isInvalid = (s: string) => !s || s.includes("your_") || s.includes("placeholder");

  const status = {
    voicerss: {
      raw: keys.voicerss,
      status: isInvalid(keys.voicerss)
        ? "❌ missing/invalid"
        : "✅ configured",
    },
    huggingface: {
      raw: keys.huggingface,
      status: isInvalid(keys.huggingface)
        ? "❌ missing/invalid"
        : keys.huggingface.startsWith("hf_")
        ? "✅ valid format"
        : "⚠️ invalid format (must start with hf_)",
    },
    elevenlabs: {
      raw: keys.elevenlabs,
      status: isInvalid(keys.elevenlabs)
        ? "❌ missing/invalid"
        : "✅ configured",
    },
    openai: {
      raw: keys.openai,
      status: isInvalid(keys.openai)
        ? "❌ missing/invalid"
        : keys.openai.startsWith("sk-")
        ? "✅ valid format"
        : "⚠️ invalid format (must start with sk-)",
    },
    google: {
      raw: keys.google,
      status: isInvalid(keys.google) ? "❌ missing/invalid" : "✅ configured",
    },
  };

  // Test providers in parallel
  const tests = await Promise.all([
    testProvider(
      "voicerss",
      isInvalid(keys.voicerss) ? null : keys.voicerss
    ),
    testProvider(
      "huggingface",
      isInvalid(keys.huggingface) || !keys.huggingface.startsWith("hf_")
        ? null
        : keys.huggingface
    ),
    testProvider(
      "elevenlabs",
      isInvalid(keys.elevenlabs) ? null : keys.elevenlabs
    ),
    testProvider(
      "openai",
      isInvalid(keys.openai) || !keys.openai.startsWith("sk-")
        ? null
        : keys.openai
    ),
  ]);

  const testResults = {
    voicerss: tests[0],
    huggingface: tests[1],
    elevenlabs: tests[2],
    openai: tests[3],
  };

  return NextResponse.json({
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: !!process.env.VERCEL,
      timestamp: new Date().toISOString(),
    },
    configuration: status,
    tests: testResults,
    recommendations: {
      working_providers: Object.entries(testResults)
        .filter(([_, test]) => test.success)
        .map(([name]) => name),
      issues: Object.entries(testResults)
        .filter(([_, test]) => !test.success && test.message.includes("❌"))
        .map(([name, test]) => ({
          provider: name,
          error: test.message,
          status_code: test.status,
        })),
      next_steps: [
        "1. Check if any providers show '✅' in the tests above",
        "2. If all tests fail, verify your API keys are correct",
        "3. Common issues:",
        "   - HuggingFace 401: Token invalid or expired",
        "   - HuggingFace 503: Model loading, wait and retry",
        "   - ElevenLabs 401: API key invalid",
        "   - OpenAI 401: API key invalid or missing credit",
        "   - VoiceRSS: Check if daily limit reached (350/day)",
        "4. Try a different TTS provider if one fails",
        "5. Visit https://vercel.com/dashboard to update keys",
      ],
    },
  });
}
