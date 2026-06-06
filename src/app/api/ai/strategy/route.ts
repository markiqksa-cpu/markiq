// app/api/ai/strategy/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clientData } = body;

    if (!clientData) {
      return NextResponse.json({ error: "بيانات العميل مطلوبة" }, { status: 400 });
    }

    const systemPrompt = `أنت كبير مستشاري التسويق الرقمي في السوق السعودي، خبرتك تتجاوز 15 سنة.
تخصصك: بناء استراتيجيات تسويقية مبنية على البيانات تحقق نتائج قابلة للقياس.

مبادئك الأساسية:
- الأرقام والأهداف يجب أن تكون واقعية ومبنية على الميزانية الفعلية
- كل توصية يجب أن تكون محددة وقابلة للتنفيذ فوراً
- السياق السعودي أولاً: اللهجة، المناسبات، أوقات الذروة، وسلوك المستهلك السعودي
- لا توصيات عامة — كل شيء مخصص لهذا العميل بالذات
- ردودك دائماً بـ JSON صالح فقط، بدون أي نص إضافي أو markdown أو backticks`;

    const budgetMonthly = clientData.budgetMonthly || 5000;
    const platforms = (clientData.platforms || []).join("، ");
    const goals = (clientData.goals || []).join("، ");
    const targetAreas = (clientData.targetAreas || []).join("، ");
    const interests = (clientData.interests || []).join("، ");
    const competitors = (clientData.competitors || []).join("، ");
    const seoKeywords = (clientData.seoKeywords || []).join("، ");
    const seoLevel = clientData.seoLevel || "none";
    const contentLanguage = clientData.contentLanguage || "arabic_saudi";

    // حساب توزيع الميزانية المقترح
    const platformList = clientData.platforms || [];
    const budgetSuggestions = platformList.map((p: string) => {
      const weights: Record<string, number> = {
        google: 35, instagram: 30, snapchat: 20, tiktok: 15,
        twitter: 10, facebook: 15, youtube: 10, maps: 5,
      };
      const weight = weights[p] || 15;
      const totalWeight = platformList.reduce((s: number, pl: string) => s + (weights[pl] || 15), 0);
      const amount = Math.round((weight / totalWeight) * budgetMonthly);
      return `${p}: ${amount} ريال`;
    }).join("، ");

    const userPrompt = `بيانات العميل الكاملة:

═══════════════════════════════
معلومات النشاط التجاري:
═══════════════════════════════
الاسم: ${clientData.name}
القطاع: ${clientData.sector}
الوصف: ${clientData.description || "لم يُذكر"}
الموقع: ${clientData.city}، حي ${clientData.neighborhood}
الأحياء المستهدفة: ${targetAreas || "غير محدد"}
الموقع الإلكتروني: ${clientData.websiteUrl || "لا يوجد"}
انستقرام: ${clientData.instagramUrl || "لا يوجد"}
مستوى SEO الحالي: ${seoLevel}
كلمات SEO المستهدفة: ${seoKeywords || "لم تُحدد"}

═══════════════════════════════
الجمهور المستهدف:
═══════════════════════════════
الفئة العمرية: ${clientData.targetAge || "25-34"}
الجنس: ${clientData.targetGender === "male" ? "رجال" : clientData.targetGender === "female" ? "نساء" : "الجميع"}
الاهتمامات: ${interests || "لم تُحدد"}
لغة المحتوى: ${contentLanguage}

═══════════════════════════════
التسويق والميزانية:
═══════════════════════════════
الميزانية الشهرية: ${budgetMonthly} ريال
المنصات المختارة: ${platforms}
التوزيع المقترح للميزانية: ${budgetSuggestions}
الأهداف التسويقية: ${goals}
المنافسون: ${competitors || "لم يُذكروا"}
ملاحظات إضافية: ${clientData.aiNotes || clientData.description || "لا توجد"}

═══════════════════════════════
المطلوب:
═══════════════════════════════
بناء استراتيجية تسويقية متكاملة تأخذ بعين الاعتبار:
1. الميزانية المحدودة (${budgetMonthly} ريال) — الأولوية للمنصات الأعلى عائداً
2. السياق السعودي المحلي والمناسبات الموسمية
3. المنافسة في السوق وطرق التميز
4. مؤشرات KPI واقعية تتناسب مع الميزانية والقطاع
5. خطة تنفيذ واضحة خطوة بخطوة

أرجع JSON بهذا الشكل بالضبط (أرقام KPIs يجب أن تكون واقعية للميزانية):
{
  "summary": "ملخص تنفيذي للاستراتيجية (4-5 جمل تغطي: الهدف، الجمهور، الأسلوب، التوقع)",
  "kpis": {
    "orders": 25,
    "roi": 2.8,
    "cpo": 15,
    "impressions": 180000
  },
  "budgetDistribution": {
    "instagram": 1500,
    "google": 2000,
    "snapchat": 1000,
    "tiktok": 500
  },
  "peakTimes": {
    "الجمعة": ["11:00 ص", "2:00 م", "9:00 م"],
    "السبت": ["12:00 م", "7:00 م"],
    "الأحد - الخميس": ["12:30 م", "8:00 م"]
  },
  "avoidTimes": ["الفجر", "الظهر", "العصر", "المغرب", "العشاء"],
  "contentStrategy": {
    "tone": "وصف الأسلوب المناسب للجمهور",
    "themes": ["موضوع 1", "موضوع 2", "موضوع 3"],
    "frequency": "معدل النشر الموصى به",
    "formats": ["نوع محتوى 1", "نوع محتوى 2"]
  },
  "phases": [
    { "title": "إعداد الأساس", "description": "تفاصيل محددة للتنفيذ", "duration": "الأسبوع 1-2", "actions": ["إجراء 1", "إجراء 2"] },
    { "title": "الإطلاق التجريبي", "description": "تفاصيل محددة", "duration": "الأسبوع 3-6", "actions": ["إجراء 1", "إجراء 2"] },
    { "title": "التحسين والتوسع", "description": "تفاصيل محددة", "duration": "الشهر الثاني", "actions": ["إجراء 1", "إجراء 2"] },
    { "title": "قياس النتائج", "description": "تفاصيل محددة", "duration": "الشهر الثالث", "actions": ["إجراء 1", "إجراء 2"] }
  ],
  "recommendations": [
    { "text": "توصية عاجلة ومحددة جداً مع رقم أو نسبة", "priority": "urgent", "platform": "google", "expectedImpact": "وصف الأثر المتوقع" },
    { "text": "توصية متوسطة الأولوية محددة", "priority": "medium", "platform": "instagram", "expectedImpact": "وصف الأثر" },
    { "text": "توصية متوسطة", "priority": "medium", "platform": "snapchat", "expectedImpact": "وصف الأثر" },
    { "text": "توصية تخطيطية", "priority": "planning", "platform": "general", "expectedImpact": "وصف الأثر" },
    { "text": "توصية تخطيطية أخرى", "priority": "planning", "platform": "general", "expectedImpact": "وصف الأثر" }
  ],
  "audienceAnalysis": {
    "segments": ["شريحة مفصلة 1", "شريحة مفصلة 2", "شريحة 3"],
    "areas": ["${clientData.neighborhood || 'الحي الرئيسي'}", "حي مستهدف 2", "حي مستهدف 3"],
    "interests": ["اهتمام محدد 1", "اهتمام محدد 2", "اهتمام محدد 3"],
    "behaviors": ["سلوك شرائي 1", "سلوك شرائي 2"]
  },
  "seoStrategy": {
    "priority": "high/medium/low حسب المستوى الحالي",
    "quickWins": ["إجراء SEO سريع 1", "إجراء SEO سريع 2"],
    "targetKeywords": ["كلمة مفتاحية 1", "كلمة مفتاحية 2"]
  },
  "seasonalOpportunities": [
    { "occasion": "مناسبة موسمية قريبة", "action": "إجراء مقترح", "timing": "التوقيت" }
  ],
  "successMetrics": {
    "week1": "هدف الأسبوع الأول",
    "month1": "هدف الشهر الأول",
    "month3": "هدف الشهر الثالث"
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
        model: "claude-opus-4-5",
        max_tokens: 8000,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.content[0]?.text || "";
    
    let strategy;
    try {
      strategy = JSON.parse(text.replace(/```json|```/g, "").trim());
    } catch {
      // محاولة ثانية — البحث عن JSON في النص
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        strategy = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("فشل تحليل استجابة الذكاء الاصطناعي");
      }
    }

    return NextResponse.json({ strategy });

  } catch (error) {
    console.error("Strategy generation error:", error);
    return NextResponse.json({ error: "فشل في توليد الاستراتيجية" }, { status: 500 });
  }
}
