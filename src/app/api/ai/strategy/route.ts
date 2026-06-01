// app/api/ai/strategy/route.ts
// POST /api/ai/strategy — توليد الاستراتيجية بـ Claude

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clientData } = body;

    if (!clientData) {
      return NextResponse.json({ error: "بيانات العميل مطلوبة" }, { status: 400 });
    }

    const systemPrompt = `أنت خبير تسويق رقمي متخصص في السوق السعودي.
تُنتج استراتيجيات تسويقية دقيقة ومبنية على البيانات.
ردودك دائماً بـ JSON صالح فقط، بدون أي نص إضافي أو markdown.`;

    const userPrompt = `أنشئ استراتيجية تسويقية شاملة لهذا العميل:

النشاط: ${clientData.name}
القطاع: ${clientData.sector}
الموقع: ${clientData.city}، ${clientData.neighborhood}
الأحياء المستهدفة: ${(clientData.targetAreas || []).join("، ")}
الفئة العمرية: ${clientData.targetAge || "25-34"}
الجنس المستهدف: ${clientData.targetGender || "الجميع"}
الاهتمامات: ${(clientData.interests || []).join("، ")}
المنصات: ${(clientData.platforms || []).join("، ")}
الأهداف: ${(clientData.goals || []).join("، ")}
الميزانية الشهرية: ${clientData.budgetMonthly || 5000} ريال
وصف النشاط: ${clientData.description || ""}
كلمات SEO: ${(clientData.seoKeywords || []).join("، ")}

أرجع JSON بهذا الشكل بالضبط:
{
  "summary": "ملخص الاستراتيجية باللغة العربية (3-4 جمل)",
  "kpis": {
    "orders": 40,
    "roi": 3.5,
    "cpo": 12,
    "impressions": 500000
  },
  "peakTimes": {
    "الجمعة": ["11:00 ص", "2:00 م", "9:00 م"],
    "السبت": ["12:00 م", "7:00 م"],
    "الأحد - الخميس": ["12:30 م", "8:00 م"]
  },
  "phases": [
    { "title": "إعداد الحسابات والهوية", "description": "ربط المنصات + إعداد البروفايلات", "duration": "الأسبوع 1-2" },
    { "title": "إطلاق الحملات الأساسية", "description": "اختبار المحتوى والاستهداف", "duration": "الشهر الأول" },
    { "title": "التحسين والتوسع", "description": "مضاعفة ما ينجح وتحسين الاستهداف", "duration": "الشهر الثاني" },
    { "title": "قياس النتائج والتقرير", "description": "مراجعة KPIs وخطة الربع القادم", "duration": "الشهر الثالث" }
  ],
  "recommendations": [
    { "text": "توصية تسويقية محددة", "priority": "urgent" },
    { "text": "توصية أخرى", "priority": "medium" },
    { "text": "توصية تخطيطية", "priority": "planning" }
  ],
  "audienceAnalysis": {
    "segments": ["شريحة 1", "شريحة 2"],
    "areas": ["حي 1", "حي 2"],
    "interests": ["اهتمام 1", "اهتمام 2"]
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
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.content[0]?.text || "";

    const strategy = JSON.parse(text.replace(/```json|```/g, "").trim());
    return NextResponse.json({ strategy });

  } catch (error) {
    console.error("Strategy generation error:", error);
    return NextResponse.json({ error: "فشل في توليد الاستراتيجية" }, { status: 500 });
  }
}
