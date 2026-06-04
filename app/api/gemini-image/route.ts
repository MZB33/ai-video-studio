// app/api/gemini-image/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { prompt } = await req.json();
  
  // Gemini API endpoint (Nano Banana 2)
  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image:generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GOOGLE_API_KEY,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 1.0,
          candidateCount: 1,
        }
      })
    }
  );
  
  const data = await response.json();
  return NextResponse.json({ image: data.candidates[0].content.parts[0].inlineData.data });
}