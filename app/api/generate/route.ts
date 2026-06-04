import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { text } = await req.json();

  // 🟢 MOCK MODE
  if (process.env.MODE === "mock") {
    return NextResponse.json({
      result: `
Scene 1: ایک لکڑ ہارا جنگل جاتا ہے  
Scene 2: کلہاڑی دریا میں گر جاتی ہے  
Scene 3: ایک جادوئی مخلوق آتی ہے  
Scene 4: انعام ملتا ہے
      `,
    });
  }

  // 🔵 REAL AI MODE
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `اس کہانی کو ویڈیو سینز میں تبدیل کریں:
${text}`,
        },
      ],
    }),
  });

  const data = await response.json();

  return NextResponse.json({
    result: data.choices?.[0]?.message?.content || "No response",
  });
}