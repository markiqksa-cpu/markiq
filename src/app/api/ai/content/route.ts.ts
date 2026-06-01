// app/api/ai/content/route.ts
// POST /api/ai/content — توليد المحتوى بـ Claude

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clientName, platform, contentType, goal, language, notes, occasion } = body;

    const systemPrompt = `أنت كاتب محتوى تسويقي سعودي محترف.
تكتب محتوى جذاب ومقنع باللهجة السعودية البيضاء.
ردودك دائماً بـ JSON صالح فقط بدون markdown.`;

    const userPrompt = `اكتب محتوى تسويقياً احترافياً:

النشاط: ${clientName}
المنصة: ${platform}
نوع المحتوى: ${contentType}
الهدف: ${goal}
اللغة: ${language || "عربي — لهجة سعودية"}
${notes ? `ملاحظات: ${notes}` : ""}
${occasion ? `المناسبة: ${occasion}` : ""}

أرجع JSON بهذا الشكل:
{
  "caption": "الكابشن الكامل باللهجة السعودية مع emojis مناسبة",
  "hashtags": ["#هاشتاق1", "#هاشتاق2", "#هاشتاق3", "#هاشتاق4", "#هاشتاق5"],
  "imagePrompt": "وصف الصورة بالإنجليزية لـ DALL-E (لا تتجاوز 200 كلمة)",
  "bestTime": "أفضل وقت للنشر",
  "score": 90,
  "feedback": {
    "caption": 95,
    "hashtags": 90,
    "timing": 88
  }
}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2048,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!response.ok) throw new Error(`Claude API: ${response.status}`);

    const data = await response.json();
    const text = data.content[0]?.text || "";
    const content = JSON.parse(text.replace(/```json|```/g, "").trim());

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Content generation error:", error);
    return NextResponse.json({ error: "فشل في توليد المحتوى" }, { status: 500 });
  }
}

// ============================================
// app/api/ai/chat/route.ts
// POST /api/ai/chat — AI Assistant Chat
// ============================================

