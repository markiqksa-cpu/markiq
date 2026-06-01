// app/api/ai/chat/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history = [], clientContext } = body;

    if (!message?.trim()) {
      return NextResponse.json({ error: "الرسالة مطلوبة" }, { status: 400 });
    }

    const systemPrompt = `أنت مساعد تسويقي ذكي لمنصة Markiq.
${clientContext ? `\nالسياق الحالي:\n- العميل: ${clientContext.name}\n- القطاع: ${clientContext.sector}\n- المنصات: ${(clientContext.platforms || []).join("، ")}\n- الميزانية: ${clientContext.budget} ريال/شهر\n` : ""}
تجيب باللغة العربية بلهجة سعودية مهنية.
تقدم إجابات عملية ومباشرة.
إجاباتك مختصرة ومفيدة (3-5 جمل أو قائمة نقطية).`;

    const messages = [
      ...history.slice(-10),
      { role: "user", content: message },
    ];

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: systemPrompt,
        messages,
      }),
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.content[0]?.text || "عذراً، لم أتمكن من الإجابة. حاول مرة أخرى.";

    return NextResponse.json({ reply, usage: data.usage });

  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "فشل في الاتصال بـ AI", reply: "عذراً، حدث خطأ. يرجى المحاولة مرة أخرى." },
      { status: 500 }
    );
  }
}
