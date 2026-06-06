// app/api/ai/strategy/route.ts
import { NextRequest, NextResponse } from "next/server";

// ===== بحث حقيقي عن المنافسين =====
async function searchCompetitor(name: string, city: string, sector: string): Promise<string> {
  try {
    const query = `${name} ${city} ${sector} تقييمات خدمات`;
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-4-5",
        max_tokens: 1000,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [{
          role: "user",
          content: `ابحث عن "${query}" وأعطني معلومات مختصرة عن:
1. نوع الخدمات التي يقدمها
2. مستوى التقييمات (إن وجدت)
3. نقاط القوة والضعف الظاهرة
4. تواجده على وسائل التواصل الاجتماعي

أجب باختصار شديد في 3-4 جمل فقط بالعربية.`
        }],
      }),
    });

    if (!response.ok) return `${name}: معلومات غير متاحة`;

    const data = await response.json();
    const text = data.content
      ?.filter((c: { type: string }) => c.type === "text")
      ?.map((c: { text: string }) => c.text)
      ?.join(" ") || "";

    return `${name}: ${text.slice(0, 300)}`;
  } catch {
    return `${name}: تعذّر جلب المعلومات`;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clientData } = body;

    if (!clientData) {
      return NextResponse.json({ error: "بيانات العميل مطلوبة" }, { status: 400 });
    }

    const budgetMonthly = clientData.budgetMonthly || 5000;
    const platforms = (clientData.platforms || []).join("، ");
    const goals = (clientData.goals || []).join("، ");
    const targetAreas = (clientData.targetAreas || []).join("، ");
    const interests = (clientData.interests || []).join("، ");
    const competitors = (clientData.competitors || []) as string[];
    const seoKeywords = (clientData.seoKeywords || []).join("، ");
    const seoLevel = clientData.seoLevel || "none";
    const contentLanguage = clientData.contentLanguage || "arabic_saudi";

    // ===== بحث حقيقي عن المنافسين =====
    let competitorAnalysis = "لم يُذكر منافسون";
    if (competitors.length > 0) {
      const searchPromises = competitors.slice(0, 3).map(c =>
        searchCompetitor(c, clientData.city || "", clientData.sector || "")
      );
      const results = await Promise.all(searchPromises);
      competitorAnalysis = results.join("\n");
    }

    // حساب توزيع الميزانية
    const platformList = clientData.platforms || [];
    const weights: Record<string, number> = {
      google: 35, instagram: 30, snapchat: 20, tiktok: 15,
      twitter: 10, facebook: 15, youtube: 10, maps: 5,
    };
    const totalWeight = platformList.reduce((s: number, p: string) => s + (weights[p] || 15), 0);
    const budgetSuggestions = platformList.map((p: string) => {
      const amount = Math.round(((weights[p] || 15) / totalWeight) * budgetMonthly);
      return `${p}: ${amount} ريال`;
    }).join("، ");

    const systemPrompt = `أنت كبير مستشاري التسويق الرقمي في السوق السعودي، خبرتك تتجاوز 15 سنة.
تخصصك: بناء استراتيجيات تسويقية مبنية على البيانات والتحليل الحقيقي للسوق.

مبادئك:
- الأرقام واقعية ومبنية على الميزانية الفعلية
- التحليل مبني على معلومات المنافسين الحقيقية المُقدَّمة
- السياق السعودي أولاً
- لا توصيات عامة — كل شيء مخصص لهذا العميل
- ردودك JSON فقط بدون أي نص إضافي`;

    const userPrompt = `بيانات العميل الكاملة:

═══════════════════════════════
معلومات النشاط:
═══════════════════════════════
الاسم: ${clientData.name}
القطاع: ${clientData.sector}
الوصف التفصيلي: ${clientData.description || "لم يُذكر"}
الموقع: ${clientData.city}، ${clientData.neighborhood || ""}
الأحياء المستهدفة: ${targetAreas || "غير محدد"}
الموقع الإلكتروني: ${clientData.websiteUrl || "لا يوجد"}
انستقرام: ${clientData.instagramUrl || "لا يوجد"}
مستوى SEO: ${seoLevel}
كلمات SEO: ${seoKeywords || "لم تُحدد"}

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
المنصات: ${platforms}
التوزيع المقترح: ${budgetSuggestions}
الأهداف: ${goals}

═══════════════════════════════
تحليل المنافسين (بحث حقيقي):
═══════════════════════════════
${competitorAnalysis}

═══════════════════════════════
المطلوب:
═══════════════════════════════
بناء استراتيجية تسويقية متكاملة تأخذ بعين الاعتبار:
1. الميزانية الفعلية (${budgetMonthly} ريال)
2. تحليل المنافسين الحقيقي أعلاه — استخدمه لتحديد نقاط التميز
3. السياق السعودي والمناسبات الموسمية
4. KPIs واقعية للميزانية والقطاع

أرجع JSON بهذا الشكل بالضبط:
{
  "summary": "ملخص تنفيذي (4-5 جمل: الهدف، الجمهور، التميز عن المنافسين، التوقع)",
  "competitorInsights": {
    "mainWeaknesses": ["نقطة ضعف منافس 1", "نقطة ضعف منافس 2"],
    "ourAdvantage": "كيف يتميز عميلنا عن المنافسين بناءً على التحليل",
    "marketGap": "الفجوة في السوق التي يمكن استغلالها"
  },
  "kpis": {
    "orders": 25,
    "roi": 2.8,
    "cpo": 15,
    "impressions": 180000
  },
  "budgetDistribution": {},
  "peakTimes": {
    "الجمعة": ["11:00 ص", "2:00 م", "9:00 م"],
    "السبت": ["12:00 م", "7:00 م"],
    "الأحد - الخميس": ["12:30 م", "8:00 م"]
  },
  "avoidTimes": ["الفجر", "الظهر", "العصر", "المغرب", "العشاء"],
  "contentStrategy": {
    "tone": "وصف الأسلوب",
    "themes": ["موضوع 1", "موضوع 2", "موضوع 3"],
    "frequency": "معدل النشر",
    "formats": ["نوع 1", "نوع 2"]
  },
  "phases": [
    { "title": "إعداد الأساس", "description": "تفاصيل", "duration": "الأسبوع 1-2", "actions": ["إجراء 1", "إجراء 2"] },
    { "title": "الإطلاق التجريبي", "description": "تفاصيل", "duration": "الأسبوع 3-6", "actions": ["إجراء 1", "إجراء 2"] },
    { "title": "التحسين والتوسع", "description": "تفاصيل", "duration": "الشهر الثاني", "actions": ["إجراء 1", "إجراء 2"] },
    { "title": "قياس النتائج", "description": "تفاصيل", "duration": "الشهر الثالث", "actions": ["إجراء 1", "إجراء 2"] }
  ],
  "recommendations": [
    { "text": "توصية عاجلة محددة مبنية على تحليل المنافسين", "priority": "urgent", "platform": "google", "expectedImpact": "الأثر المتوقع" },
    { "text": "توصية متوسطة", "priority": "medium", "platform": "instagram", "expectedImpact": "الأثر" },
    { "text": "توصية متوسطة", "priority": "medium", "platform": "snapchat", "expectedImpact": "الأثر" },
    { "text": "توصية تخطيطية", "priority": "planning", "platform": "general", "expectedImpact": "الأثر" },
    { "text": "توصية تخطيطية", "priority": "planning", "platform": "general", "expectedImpact": "الأثر" }
  ],
  "audienceAnalysis": {
    "segments": ["شريحة 1", "شريحة 2", "شريحة 3"],
    "areas": ["حي 1", "حي 2"],
    "interests": ["اهتمام 1", "اهتمام 2"],
    "behaviors": ["سلوك 1", "سلوك 2"]
  },
  "seoStrategy": {
    "priority": "high/medium/low",
    "quickWins": ["إجراء 1", "إجراء 2"],
    "targetKeywords": ["كلمة 1", "كلمة 2"]
  },
  "seasonalOpportunities": [
    { "occasion": "مناسبة", "action": "إجراء", "timing": "التوقيت" }
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

    if (!response.ok) throw new Error(`Claude API error: ${response.status}`);

    const data = await response.json();
    const text = data.content[0]?.text || "";

    let strategy;
    try {
      strategy = JSON.parse(text.replace(/```json|```/g, "").trim());
    } catch {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) strategy = JSON.parse(jsonMatch[0]);
      else throw new Error("فشل تحليل استجابة الذكاء الاصطناعي");
    }

    return NextResponse.json({ strategy, competitorAnalysis });

  } catch (error) {
    console.error("Strategy generation error:", error);
    return NextResponse.json({ error: "فشل في توليد الاستراتيجية" }, { status: 500 });
  }
}
