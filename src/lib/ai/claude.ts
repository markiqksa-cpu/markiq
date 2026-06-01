// lib/ai/claude.ts
// ============================================
// Claude API Wrapper — Markiq
// ============================================

const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-20250514";

interface ClaudeMessage {
  role: "user" | "assistant";
  content: string;
}

interface ClaudeResponse {
  content: Array<{ type: string; text: string }>;
  usage: { input_tokens: number; output_tokens: number };
}

// ===== BASE REQUEST =====
async function claudeRequest(
  systemPrompt: string,
  messages: ClaudeMessage[],
  maxTokens: number = 4096
): Promise<string> {
  const response = await fetch(CLAUDE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages,
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status}`);
  }

  const data: ClaudeResponse = await response.json();
  return data.content[0]?.text || "";
}

// ===== 1. GENERATE MARKETING STRATEGY =====
export async function generateStrategy(clientData: {
  name: string;
  sector: string;
  city: string;
  neighborhood: string;
  targetAreas: string[];
  targetAge: string;
  targetGender: string;
  interests: string[];
  platforms: string[];
  goals: string[];
  budget: number;
  description: string;
  seoKeywords: string[];
}): Promise<{
  summary: string;
  kpis: { orders: number; roi: number; cpo: number; impressions: number };
  peakTimes: Record<string, string[]>;
  phases: Array<{ title: string; description: string; duration: string }>;
  recommendations: Array<{ text: string; priority: string }>;
  audienceAnalysis: { segments: string[]; areas: string[]; interests: string[] };
}> {
  const systemPrompt = `أنت خبير تسويق رقمي متخصص في السوق السعودي.
تُنتج استراتيجيات تسويقية دقيقة ومبنية على البيانات.
ردودك دائماً بـ JSON صالح فقط، بدون أي نص إضافي.`;

  const userPrompt = `أنشئ استراتيجية تسويقية شاملة لهذا العميل:

النشاط: ${clientData.name}
القطاع: ${clientData.sector}
الموقع: ${clientData.city}، ${clientData.neighborhood}
الأحياء المستهدفة: ${clientData.targetAreas.join("، ")}
الفئة العمرية: ${clientData.targetAge}
الجنس المستهدف: ${clientData.targetGender}
الاهتمامات: ${clientData.interests.join("، ")}
المنصات: ${clientData.platforms.join("، ")}
الأهداف: ${clientData.goals.join("، ")}
الميزانية الشهرية: ${clientData.budget} ريال
وصف النشاط: ${clientData.description}
كلمات SEO: ${clientData.seoKeywords.join("، ")}

أرجع JSON بهذا الشكل:
{
  "summary": "ملخص الاستراتيجية باللغة العربية",
  "kpis": {
    "orders": 40,
    "roi": 3.5,
    "cpo": 12,
    "impressions": 500000
  },
  "peakTimes": {
    "الجمعة": ["11:00 ص", "2:00 م", "9:00 م"],
    "السبت": ["12:00 م", "7:00 م"],
    "يومياً": ["12:30 م", "8:00 م"]
  },
  "phases": [
    { "title": "إعداد الحسابات", "description": "...", "duration": "الأسبوع الأول" }
  ],
  "recommendations": [
    { "text": "توصية تسويقية", "priority": "urgent" }
  ],
  "audienceAnalysis": {
    "segments": ["موظفون 25-34", "عائلات"],
    "areas": ["النزهة", "العليا"],
    "interests": ["الطعام", "التوصيل"]
  }
}`;

  const result = await claudeRequest(systemPrompt, [{ role: "user", content: userPrompt }]);

  try {
    return JSON.parse(result.replace(/```json|```/g, "").trim());
  } catch {
    throw new Error("فشل في تحليل رد الاستراتيجية");
  }
}

// ===== 2. GENERATE MARKETING CONTENT =====
export async function generateContent(params: {
  clientName: string;
  platform: string;
  contentType: string;
  goal: string;
  language: string;
  notes?: string;
  occasion?: string;
}): Promise<{
  caption: string;
  hashtags: string[];
  imagePrompt: string;
  bestTime: string;
  score: number;
  feedback: Record<string, number>;
}> {
  const systemPrompt = `أنت كاتب محتوى تسويقي سعودي محترف.
تكتب محتوى جذاب باللهجة السعودية البيضاء.
ردودك دائماً بـ JSON صالح فقط.`;

  const userPrompt = `اكتب محتوى تسويقي لـ:
النشاط: ${params.clientName}
المنصة: ${params.platform}
نوع المحتوى: ${params.contentType}
الهدف: ${params.goal}
اللغة: ${params.language}
${params.notes ? `ملاحظات: ${params.notes}` : ""}
${params.occasion ? `المناسبة: ${params.occasion}` : ""}

أرجع JSON:
{
  "caption": "الكابشن باللهجة السعودية مع emojis مناسبة",
  "hashtags": ["#هاشتاق1", "#هاشتاق2"],
  "imagePrompt": "وصف الصورة بالإنجليزية لـ DALL-E",
  "bestTime": "أفضل وقت للنشر",
  "score": 92,
  "feedback": { "caption": 95, "hashtags": 90, "timing": 88 }
}`;

  const result = await claudeRequest(systemPrompt, [{ role: "user", content: userPrompt }]);

  try {
    return JSON.parse(result.replace(/```json|```/g, "").trim());
  } catch {
    throw new Error("فشل في تحليل رد المحتوى");
  }
}

// ===== 3. ANALYZE PERFORMANCE =====
export async function analyzePerformance(data: {
  clientName: string;
  platforms: Array<{
    name: string;
    impressions: number;
    clicks: number;
    orders: number;
    spend: number;
    roi: number;
    ctr: number;
  }>;
  period: string;
  budget: number;
}): Promise<{
  summary: string;
  insights: Array<{ type: string; text: string; priority: string }>;
  recommendations: Array<{ text: string; priority: string; action: string }>;
}> {
  const systemPrompt = `أنت محلل بيانات تسويقية خبير.
تحلل الأداء وتقدم توصيات قابلة للتنفيذ.
ردودك دائماً بـ JSON صالح.`;

  const userPrompt = `حلل أداء حملات ${data.clientName} خلال ${data.period}:
${JSON.stringify(data.platforms, null, 2)}
الميزانية الشهرية: ${data.budget} ريال

أرجع JSON:
{
  "summary": "ملخص الأداء",
  "insights": [{ "type": "positive/negative", "text": "...", "priority": "urgent/warning/info" }],
  "recommendations": [{ "text": "توصية", "priority": "urgent/medium/low", "action": "الإجراء المقترح" }]
}`;

  const result = await claudeRequest(systemPrompt, [{ role: "user", content: userPrompt }]);

  try {
    return JSON.parse(result.replace(/```json|```/g, "").trim());
  } catch {
    throw new Error("فشل في تحليل الأداء");
  }
}

// ===== 4. AI CHAT =====
export async function chat(
  message: string,
  history: ClaudeMessage[],
  clientContext?: {
    name: string;
    sector: string;
    strategy?: string;
    performance?: string;
  }
): Promise<string> {
  const systemPrompt = `أنت مساعد تسويقي ذكي لمنصة Markiq.
${clientContext ? `السياق الحالي: العميل ${clientContext.name} — ${clientContext.sector}` : ""}
${clientContext?.strategy ? `الاستراتيجية: ${clientContext.strategy}` : ""}
تجيب باللغة العربية بلهجة سعودية مهنية.
تقدم إجابات عملية ومباشرة مبنية على بيانات العميل.`;

  const messages: ClaudeMessage[] = [
    ...history,
    { role: "user", content: message },
  ];

  return await claudeRequest(systemPrompt, messages, 2048);
}

// ===== 5. BUDGET OPTIMIZER =====
export async function optimizeBudget(params: {
  totalBudget: number;
  platforms: string[];
  currentPerformance: Record<string, { roi: number; spend: number }>;
  goal: string;
}): Promise<{
  distribution: Record<string, number>;
  reasoning: string;
  expectedROI: number;
}> {
  const systemPrompt = `أنت خبير في تحسين ميزانيات الإعلانات الرقمية.
ردودك دائماً بـ JSON صالح.`;

  const userPrompt = `وزّع ميزانية ${params.totalBudget} ريال على المنصات التالية:
المنصات: ${params.platforms.join("، ")}
الأداء الحالي: ${JSON.stringify(params.currentPerformance)}
الهدف: ${params.goal}

أرجع JSON:
{
  "distribution": { "instagram": 1200, "google": 2000, "snapchat": 800 },
  "reasoning": "سبب التوزيع",
  "expectedROI": 3.5
}`;

  const result = await claudeRequest(systemPrompt, [{ role: "user", content: userPrompt }]);

  try {
    return JSON.parse(result.replace(/```json|```/g, "").trim());
  } catch {
    throw new Error("فشل في تحليل الميزانية");
  }
}
