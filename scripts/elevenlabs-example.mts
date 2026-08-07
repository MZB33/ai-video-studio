import dotenv from "dotenv";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

dotenv.config({ path: ".env.local" });
dotenv.config();

const apiKey = process.env.ELEVENLABS_API_KEY;

if (!apiKey) {
  throw new Error("ELEVENLABS_API_KEY is missing. Add it to .env.local before running this script.");
}

const elevenlabs = new ElevenLabsClient({ apiKey });

const audio = await elevenlabs.textToSpeech.convert("JBFqnCBsd6RMkjVDRZzb", {
  text: "The first move is what sets everything in motion.",
  modelId: "eleven_v3",
  outputFormat: "mp3_44100_128",
});

const buffer = Buffer.from(await new Response(audio).arrayBuffer());

console.log(`Generated ${buffer.byteLength} bytes from ElevenLabs.`);