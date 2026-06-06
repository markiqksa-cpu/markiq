"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Brain, Target, Clock, Map, Users, TrendingUp,
  CheckCircle, Loader2, RefreshCw, ChevronRight, Sparkles
} from "lucide-react";
import TopNav from "@/components/layout/TopNav";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { Button, Card, CardHeader } from "@/components/ui";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";

interface Strategy {
  summary: string;
  kpis: { orders: number; roi: number; cpo: number; impressions: number };
  peakTimes: Record<string, string[]>;
  phases: Array<{ title: string; description: string; duration: string }>;
  recommendations: Array<{ text: string; priority: string }>;
  audienceAnalysis: { segments: string[]; areas: string[]; interests: string[] };
  competitorInsights?: {
    mainWeaknesses: string[];
    ourAdvantage: string;
    marketGap: string;
  };
}

interface StrategyPageProps { params: { id: string }; }

const GEN_STEPS = [
  { id: 1, label: "تحليل بيانات العميل", icon: <Users size={14} />, duration: 600 },
  { id: 2, label: "دراسة السوق السعودي", icon: <Map size={14} />, duration: 600 },
  { id: 3, label: "بحث وتحليل المنافسين على الإنترنت", icon: <Target size={14} />, duration: 8000 },
  { id: 4, label: "توليد الاستراتيجية بـ Claude AI", icon: <Brain size={14} />, duration: 8000 },
  { id: 5, label: "حساب مؤشرات الأداء (KPIs)", icon: <TrendingUp size={14} />, duration: 600 },
  { id: 6, label: "إعداد خطة التنفيذ", icon: <CheckCircle size={14} />, duration: 600 },
];

const PRIORITY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  urgent: { label: "عاجل", color: "text-red-500", bg: "bg-red-50" },
  medium: { label: "متوسط", color: "text-yellow-700", bg: "bg-yellow-50" },
  planning: { label: "تخطيط", color: "text-green-600", bg: "bg-green-50" },
};

export default function StrategyGenerationPage({ params }: StrategyPageProps) {
  const router = useRouter();
  const supabase = createSupabaseClient();

  const [clientName, setClientName] = useState("العميل");
  const [clientData, setClientData] = useState<Record<string, unknown> | null>(null);
  const [generating, setGenerating] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [approved, setApproved] = useState(false);
  const [approving, setApproving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchClientAndGenerate() {
      try {
        const { data, error: err } = await supabase.from("clients").select("*").eq("id", params.id).single();
        if (err || !data) throw new Error("لم يتم العثور على العميل");
        setClientData(data);
        setClientName(String(data.name || "العميل"));
        await generateStrategy(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "حدث خطأ");
        setGenerating(false);
      }
    }
    fetchClientAndGenerate();
  }, [params.id]);

  async function generateStrategy(data: Record<string, unknown>) {
    setGenerating(true);
    setCurrentStep(0);
    setCompletedSteps([]);
    setStrategy(null);
    setApproved(false);
    setError(null);

    // خطوات 1-2 تمهيدية
    for (let i = 0; i < 2; i++) {
      setCurrentStep(i);
      await new Promise(r => setTimeout(r, GEN_STEPS[i].duration));
      setCompletedSteps(prev => [...prev, i]);
    }

    // خطوة 3 — بحث المنافسين (يتم مع الـ API)
    setCurrentStep(2);

    try {
      const response = await fetch("/api/ai/strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientData: {
            name: data.name, sector: data.sector, city: data.city,
            neighborhood: data.neighborhood, targetAreas: data.target_areas,
            targetAge: data.target_age, targetGender: data.target_gender,
            interests: data.interests, platforms: data.platforms, goals: data.goals,
            budgetMonthly: data.budget_monthly, description: data.description,
            seoKeywords: data.seo_keywords, competitors: data.competitors,
            websiteUrl: data.website_url, instagramUrl: data.instagram_url,
            contentLanguage: data.content_language, seoLevel: data.seo_level,
          }
        }),
      });

      if (!response.ok) throw new Error("فشل استدعاء Claude API");
      const result = await response.json();

      setCompletedSteps(prev => [...prev, 2]);

      // خطوة 4
      setCurrentStep(3);
      await new Promise(r => setTimeout(r, 800));

      let parsedStrategy: Strategy;
      if (result.strategy) {
        parsedStrategy = result.strategy;
      } else {
        throw new Error("فشل تحليل استجابة الذكاء الاصطناعي");
      }

      setCompletedSteps(prev => [...prev, 3]);

      // خطوات 5-6
      for (let i = 4; i < GEN_STEPS.length; i++) {
        setCurrentStep(i);
        await new Promise(r => setTimeout(r, GEN_STEPS[i].duration));
        setCompletedSteps(prev => [...prev, i]);
      }

      await new Promise(r => setTimeout(r, 300));
      setStrategy(parsedStrategy);
      setGenerating(false);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "فشل توليد الاستراتيجية");
      setGenerating(false);
    }
  }

  async function handleApprove() {
    if (!strategy) return;
    setApproving(true);
    try {
      const { error: err } = await supabase.from("strategies").upsert({
        client_id: params.id,
        summary: strategy.summary,
        kpi_orders_target: strategy.kpis.orders,
        kpi_roi_target: strategy.kpis.roi,
        kpi_cpo_target: strategy.kpis.cpo,
        kpi_impressions_target: strategy.kpis.impressions,
        peak_times: strategy.peakTimes,
        phases: strategy.phases,
        ai_recommendations: strategy.recommendations,
        competitor_insights: strategy.competitorInsights || null,
        version: 1,
      }, { onConflict: "client_id" });
      if (err) throw err;
      setApproved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل حفظ الاستراتيجية");
    } finally {
      setApproving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <TopNav currentClient={{ id: params.id, name: clientName }} alertCount={0} user={{ name: "عمر", email: "omar@markiq.sa", role: "admin" }} />
      <Breadcrumb items={[
        { label: "لوحة التحكم", href: "/dashboard" },
        { label: "العملاء", href: "/clients" },
        { label: clientName, href: `/clients/${params.id}` },
        { label: "توليد الاستراتيجية" },
      ]} />

      <div className="max-w-[900px] mx-auto p-4 space-y-5">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <Brain size={18} className="text-primary-500" /> توليد الاستراتيجية التسويقية
            </h1>
            <p className="text-xs text-gray-500 mt-1">Claude AI يحلل بيانات {clientName} ويبحث عن المنافسين ويبني خطة تسويقية متكاملة</p>
          </div>
          {!generating && strategy && (
            <div className="flex gap-2">
              <Button variant="outline" icon={<RefreshCw size={11} />} onClick={() => clientData && generateStrategy(clientData)}>إعادة التوليد</Button>
              {!approved ? (
                <Button icon={approving ? <Loader2 size={11} className="animate-spin" /> : <CheckCircle size={11} />} onClick={handleApprove}>
                  {approving ? "جارٍ الاعتماد..." : "اعتماد الاستراتيجية"}
                </Button>
              ) : (
                <Button icon={<ChevronRight size={11} className="rotate-180" />} onClick={() => router.push(`/clients/${params.id}`)}>انتقل للملف</Button>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600">
            {error}
            <button onClick={() => clientData && generateStrategy(clientData)} className="mr-3 text-red-700 underline text-xs">إعادة المحاولة</button>
          </div>
        )}

        {generating && (
          <Card>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <Sparkles size={16} className="text-white animate-pulse" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-800">Claude AI يعمل...</div>
                <div className="text-[10px] text-gray-500">يتم البحث عن المنافسين وتوليد الاستراتيجية</div>
              </div>
            </div>
            <div className="space-y-3">
              {GEN_STEPS.map((step, i) => {
                const isDone = completedSteps.includes(i);
                const isActive = currentStep === i && !isDone;
                return (
                  <div key={step.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${isDone ? "bg-green-50 border-green-200" : isActive ? "bg-primary-light border-blue-200" : "bg-gray-50 border-gray-100"}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${isDone ? "bg-green-500" : isActive ? "bg-primary-500" : "bg-gray-200"}`}>
                      {isDone ? <CheckCircle size={14} className="text-white" /> : isActive ? <Loader2 size={14} className="text-white animate-spin" /> : <div className="text-[10px] text-gray-400 font-bold">{step.id}</div>}
                    </div>
                    <div className={`text-xs ${isDone ? "text-green-700" : isActive ? "text-primary-500 font-medium" : "text-gray-400"}`}>{step.label}</div>
                    {isDone && <div className="mr-auto text-[10px] text-green-500">✓ مكتمل</div>}
                    {isActive && <div className="mr-auto text-[10px] text-primary-400 animate-pulse">جارٍ التحليل...</div>}
                  </div>
                );
              })}
            </div>
            <div className="mt-4 bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div className="h-full bg-primary-500 rounded-full transition-all duration-500" style={{ width: `${(completedSteps.length / GEN_STEPS.length) * 100}%` }} />
            </div>
            <div className="text-center text-[10px] text-gray-400 mt-1.5">{completedSteps.length} / {GEN_STEPS.length} خطوات مكتملة</div>
          </Card>
        )}

        {!generating && strategy && (
          <>
            <div className={`flex items-center gap-3 p-3 rounded-xl border ${approved ? "bg-green-50 border-green-200" : "bg-primary-light border-blue-200"}`}>
              {approved ? <CheckCircle size={18} className="text-green-500 flex-shrink-0" /> : <Sparkles size={18} className="text-primary-500 flex-shrink-0" />}
              <div>
                <div className={`text-sm font-semibold ${approved ? "text-green-700" : "text-primary-500"}`}>
                  {approved ? "✓ الاستراتيجية معتمدة ومحفوظة" : "✓ تم توليد الاستراتيجية بنجاح"}
                </div>
                <div className="text-[10px] text-gray-500">
                  {approved ? "يمكنك الآن بناء الحملات بناءً على هذه الاستراتيجية" : "راجع الاستراتيجية وأعتمدها للبدء بالحملات"}
                </div>
              </div>
            </div>

            <div className="bg-primary-light border border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary-500 mb-2"><Brain size={15} /> ملخص الاستراتيجية</div>
              <p className="text-xs text-blue-700 leading-relaxed">{strategy.summary}</p>
            </div>

            <Card>
              <CardHeader title="مؤشرات الأداء المستهدفة (KPIs)" icon={<Target size={14} />} />
              <div className="grid grid-cols-4 gap-3">
                {[
                  { val: `${strategy.kpis.orders}%`, label: "زيادة الطلبات", icon: "📦" },
                  { val: `${strategy.kpis.roi}x`, label: "عائد الاستثمار", icon: "📈" },
                  { val: `${strategy.kpis.cpo} ر.س`, label: "تكلفة الطلب", icon: "💰" },
                  { val: `${(strategy.kpis.impressions / 1000).toFixed(0)}K`, label: "ظهور شهري", icon: "👁️" },
                ].map((kpi, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-3 text-center">
                    <div className="text-2xl mb-1">{kpi.icon}</div>
                    <div className="text-xl font-bold text-primary-500">{kpi.val}</div>
                    <div className="text-[10px] text-gray-500 mt-1">{kpi.label}</div>
                    <div className="text-[9px] text-gray-400 mt-1">الهدف خلال 3 أشهر</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* تحليل المنافسين الحقيقي */}
            {strategy.competitorInsights && (
              <Card>
                <CardHeader title="تحليل المنافسين — بحث حقيقي" icon={<Target size={14} />} />
                <div className="space-y-3">
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                    <div className="text-[11px] font-medium text-red-700 mb-2">⚠️ نقاط ضعف المنافسين:</div>
                    <div className="space-y-1">
                      {strategy.competitorInsights.mainWeaknesses.map((w, i) => (
                        <div key={i} className="text-[10.5px] text-red-600 flex gap-1.5"><span>•</span>{w}</div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                    <div className="text-[11px] font-medium text-green-700 mb-1">✅ ميزتنا التنافسية:</div>
                    <div className="text-[10.5px] text-green-600">{strategy.competitorInsights.ourAdvantage}</div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                    <div className="text-[11px] font-medium text-blue-700 mb-1">🎯 الفجوة في السوق:</div>
                    <div className="text-[10.5px] text-blue-600">{strategy.competitorInsights.marketGap}</div>
                  </div>
                </div>
              </Card>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader title="تحليل الجمهور" icon={<Users size={14} />} />
                {[
                  { label: "الشرائح المستهدفة", items: strategy.audienceAnalysis.segments, color: "bg-primary-light border-blue-200 text-primary-500" },
                  { label: "الأحياء", items: strategy.audienceAnalysis.areas, color: "bg-green-50 border-green-200 text-green-600" },
                  { label: "الاهتمامات", items: strategy.audienceAnalysis.interests, color: "bg-yellow-50 border-yellow-200 text-yellow-700" },
                ].map((group, gi) => (
                  <div key={gi} className="mb-3 last:mb-0">
                    <div className="text-[10px] text-gray-400 mb-1.5">{group.label}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {group.items.map((item, i) => (
                        <span key={i} className={`text-[10px] px-2 py-0.5 rounded-full border ${group.color}`}>{item}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </Card>
              <Card>
                <CardHeader title="أوقات الذروة للنشر" icon={<Clock size={14} />} />
                {Object.entries(strategy.peakTimes).map(([day, times], i) => (
                  <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0">
                    <span className="text-xs font-medium text-gray-700 w-20 flex-shrink-0 mt-0.5">{day}</span>
                    <div className="flex flex-wrap gap-1">
                      {times.map((t, ti) => (
                        <span key={ti} className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full">{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </Card>
            </div>

            <Card>
              <CardHeader title="مراحل تنفيذ الخطة" icon={<Map size={14} />} />
              <div className="grid grid-cols-4 gap-3">
                {strategy.phases.map((phase, i) => (
                  <div key={i} className="flex flex-col items-center text-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-2 ${i === 0 ? "bg-green-500 text-white" : i === 1 ? "bg-primary-500 text-white" : "bg-gray-100 text-gray-400 border border-gray-200"}`}>
                      {i === 0 ? "✓" : i + 1}
                    </div>
                    <div className="text-xs font-medium text-gray-800 mb-1">{phase.title}</div>
                    <div className="text-[10px] text-gray-500 mb-1.5">{phase.description}</div>
                    <span className="text-[9px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{phase.duration}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <CardHeader title="توصيات الذكاء الاصطناعي" icon={<Brain size={14} />} />
              <div className="space-y-2">
                {strategy.recommendations.map((rec, i) => {
                  const config = PRIORITY_CONFIG[rec.priority] || PRIORITY_CONFIG.planning;
                  return (
                    <div key={i} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-7 h-7 bg-primary-light rounded-lg flex items-center justify-center flex-shrink-0">
                        <Brain size={13} className="text-primary-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11.5px] text-gray-700 leading-relaxed">{rec.text}</div>
                      </div>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full h-fit flex-shrink-0 ${config.bg} ${config.color} font-medium`}>{config.label}</span>
                    </div>
                  );
                })}
              </div>
            </Card>

            <div className="flex items-center justify-between py-2">
              <Button variant="outline" onClick={() => router.back()}>العودة</Button>
              <div className="flex gap-2">
                <Button variant="outline" icon={<RefreshCw size={11} />} onClick={() => clientData && generateStrategy(clientData)}>إعادة التوليد</Button>
                {!approved ? (
                  <Button icon={approving ? <Loader2 size={11} className="animate-spin" /> : <CheckCircle size={11} />} onClick={handleApprove}>
                    {approving ? "جارٍ الاعتماد..." : "اعتماد الاستراتيجية"}
                  </Button>
                ) : (
                  <Button icon={<ChevronRight size={11} className="rotate-180" />} onClick={() => router.push(`/clients/${params.id}`)}>إنشاء أول حملة</Button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
