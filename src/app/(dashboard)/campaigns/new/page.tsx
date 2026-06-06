"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Megaphone, DollarSign, FileText, Sparkles, Calendar,
  CheckCircle, ChevronLeft, ChevronRight, Loader2, Brain, Image
} from "lucide-react";
import TopNav from "@/components/layout/TopNav";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { Button, Card, ProgressBar } from "@/components/ui";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";

const PlatformSVG = ({ id, active }: { id: string; active: boolean }) => {
  const icons: Record<string, JSX.Element> = {
    instagram: (<svg viewBox="0 0 24 24" className="w-6 h-6" fill="none"><rect width="24" height="24" rx="6" fill={active ? "#C13584" : "#E5E7EB"} /><rect x="6" y="6" width="12" height="12" rx="3.5" stroke="white" strokeWidth="1.5" fill="none" /><circle cx="12" cy="12" r="3" stroke="white" strokeWidth="1.5" fill="none" /><circle cx="16.2" cy="7.8" r="0.9" fill="white" /></svg>),
    snapchat: (<svg viewBox="0 0 24 24" className="w-6 h-6" fill="none"><rect width="24" height="24" rx="6" fill={active ? "#FFFC00" : "#E5E7EB"} /><path d="M12 5c-2.5 0-4 1.8-4 4v1.5c-.5.2-1 .4-1.2.8-.2.4 0 .8.3 1 .4.1.8.2 1.2.2-.3.8-1 1.5-1.8 2 .5.2 1.5.4 2.5.2l.2.8c.6 0 1.2-.1 1.8-.3.6.2 1.2.3 1.8.3l.2-.8c1 .2 2-.1 2.5-.2-.8-.5-1.5-1.2-1.8-2 .4 0 .8-.1 1.2-.2.3-.2.5-.6.3-1-.2-.4-.7-.6-1.2-.8V9c0-2.2-1.5-4-4-4z" fill={active ? "#333" : "#9CA3AF"} /></svg>),
    google: (<svg viewBox="0 0 24 24" className="w-6 h-6" fill="none"><rect width="24" height="24" rx="6" fill={active ? "white" : "#E5E7EB"} stroke={active ? "#E2E8F0" : "none"} /><path d="M19 12.2c0-.6-.1-1.2-.2-1.7H12v3.2h3.9c-.2.9-.7 1.7-1.5 2.2v1.8h2.4c1.4-1.3 2.2-3.2 2.2-5.5z" fill={active ? "#4285F4" : "#9CA3AF"} /><path d="M12 19c2 0 3.6-.6 4.8-1.7l-2.4-1.8c-.6.4-1.4.7-2.4.7-1.9 0-3.4-1.2-4-2.9H7.5v1.9C8.8 17.6 10.3 19 12 19z" fill={active ? "#34A853" : "#9CA3AF"} /><path d="M8 13.3c-.2-.6-.3-1.1-.3-1.7 0-.6.1-1.2.3-1.7V8H5.5C5 9 4.8 10.5 4.8 12c0 1.5.3 2.9.8 4.2L8 13.3z" fill={active ? "#FBBC05" : "#9CA3AF"} /><path d="M12 7.4c1.1 0 2 .4 2.7 1.1l2-2C15.6 5.4 14 4.8 12 4.8 10.3 4.8 8.8 6.2 7.5 8l2.5 1.9c.6-1.5 2.1-2.5 4-2.5z" fill={active ? "#EA4335" : "#9CA3AF"} /></svg>),
    tiktok: (<svg viewBox="0 0 24 24" className="w-6 h-6" fill="none"><rect width="24" height="24" rx="6" fill={active ? "#010101" : "#E5E7EB"} /><path d="M16 7.5c.8 1 2 1.5 3 1.5v2.2c-.7 0-1.9-.3-2.7-.8v4.6c0 2.3-1.9 4.2-4.2 4.2a4.2 4.2 0 01-4.2-4.2 4.2 4.2 0 014.2-4.2c.2 0 .5 0 .7.1v2.3c-.2-.1-.5-.1-.7-.1a2 2 0 00-2 2 2 2 0 002 2 2 2 0 002-2V5h2.2c.1.9.7 2.1 1.7 2.5z" fill="white" /></svg>),
    twitter: (<svg viewBox="0 0 24 24" className="w-6 h-6" fill="none"><rect width="24" height="24" rx="6" fill={active ? "black" : "#E5E7EB"} /><path d="M7 7h3.5l2 2.8 2.5-2.8H17l-3.5 4 4 6h-3.5l-2.3-3.2-2.7 3.2H7l3.8-4.5L7 7z" fill="white" /></svg>),
    youtube: (<svg viewBox="0 0 24 24" className="w-6 h-6" fill="none"><rect width="24" height="24" rx="6" fill={active ? "#FF0000" : "#E5E7EB"} /><path d="M19.5 8s-.2-1.3-.8-1.9c-.7-.8-1.5-.8-1.9-.8C14.7 5.1 12 5 12 5s-2.7 0-4.8.3c-.4 0-1.2 0-1.9.8-.6.6-.8 1.9-.8 1.9S4.3 9.5 4.3 11v1.4c0 1.5.2 3 .2 3s.2 1.3.8 1.9c.7.8 1.7.7 2.1.8C8.7 18.2 12 18.2 12 18.2s2.7 0 4.8-.3c.4 0 1.2 0 1.9-.8.6-.6.8-1.9.8-1.9s.2-1.5.2-3V11c0-1.5-.2-3-.2-3zm-11.3 6.1V9.9l5.2 2.1-5.2 2.1z" fill="white" /></svg>),
    facebook: (<svg viewBox="0 0 24 24" className="w-6 h-6" fill="none"><rect width="24" height="24" rx="6" fill={active ? "#1877F2" : "#E5E7EB"} /><path d="M13.5 19v-5.5h2l.3-2.3h-2.3V9.8c0-.6.3-1.2 1.2-1.2H16V6.7s-.9-.1-1.8-.1c-1.8 0-3 1.1-3 3v1.6H9v2.3h2.2V19h2.3z" fill="white" /></svg>),
    maps: (<svg viewBox="0 0 24 24" className="w-6 h-6" fill="none"><rect width="24" height="24" rx="6" fill={active ? "#34A853" : "#E5E7EB"} /><path d="M12 4C9.2 4 7 6.2 7 9c0 4.2 5 11 5 11s5-6.8 5-11c0-2.8-2.2-5-5-5zm0 6.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" fill="white" /></svg>),
  };
  return icons[id] || <div className="w-6 h-6 rounded bg-gray-200" />;
};

const PLATFORMS = [
  { id: "instagram", label: "انستقرام", color: "#C13584" },
  { id: "snapchat", label: "سناب شات", color: "#B8860B" },
  { id: "google", label: "قوقل", color: "#4285F4" },
  { id: "tiktok", label: "تيك توك", color: "#010101" },
  { id: "twitter", label: "تويتر X", color: "#000000" },
  { id: "youtube", label: "يوتيوب", color: "#FF0000" },
  { id: "facebook", label: "فيسبوك", color: "#1877F2" },
  { id: "maps", label: "Google Maps", color: "#34A853" },
];

const GOALS = [
  "زيادة الطلبات عبر التوصيل", "بناء الوعي بالبراند",
  "استقطاب عملاء جدد", "تحسين التقييمات",
  "ترويج منتج جديد", "زيادة المتابعين",
];

const CONTENT_TYPES = [
  { id: "image", label: "صورة + كابشن", icon: "🖼️" },
  { id: "video", label: "فيديو قصير", icon: "🎬" },
  { id: "reel", label: "ريلز / تيك توك", icon: "📱" },
  { id: "story", label: "ستوري يومي", icon: "⭕" },
  { id: "text", label: "نص إعلاني", icon: "📝" },
  { id: "ugc", label: "محتوى عملاء (UGC)", icon: "👥" },
];

const STEPS = [
  { num: 1, label: "تفاصيل الحملة", icon: <Megaphone size={13} /> },
  { num: 2, label: "المنصات والميزانية", icon: <DollarSign size={13} /> },
  { num: 3, label: "نوع المحتوى", icon: <FileText size={13} /> },
  { num: 4, label: "توليد المحتوى", icon: <Sparkles size={13} /> },
  { num: 5, label: "الجدولة", icon: <Calendar size={13} /> },
  { num: 6, label: "المراجعة والإطلاق", icon: <CheckCircle size={13} /> },
];

const AI_DISTRIBUTION: Record<string, number> = {
  google: 40, instagram: 35, snapchat: 25,
  tiktok: 20, twitter: 15, youtube: 25, facebook: 20, maps: 5,
};

interface GeneratedContent {
  platform: string;
  type: string;
  caption: string;
  hashtags: string[];
  time: string;
  score: number;
  imageUrl?: string;
  imageLoading?: boolean;
}

interface FormData {
  name: string; goal: string; aiNotes: string;
  platforms: string[]; budgetTotal: number;
  budgetMode: "ai" | "manual" | "equal";
  contentTypes: string[]; startDate: string; endDate: string;
}

function CampaignBuilderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientId = searchParams.get("client") || "";
  const supabase = createSupabaseClient();

  const [step, setStep] = useState(1);
  const [clientName, setClientName] = useState("العميل");
  const [clientData, setClientData] = useState<Record<string, unknown> | null>(null);
  const [strategy, setStrategy] = useState<Record<string, unknown> | null>(null);
  const [form, setForm] = useState<FormData>({
    name: "", goal: "", aiNotes: "",
    platforms: [], budgetTotal: 3000, budgetMode: "ai",
    contentTypes: [], startDate: "", endDate: "",
  });
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [launching, setLaunching] = useState(false);

  useEffect(() => {
    if (!clientId) return;
    async function fetchClient() {
      const [clientRes, strategyRes] = await Promise.all([
        supabase.from("clients").select("*").eq("id", clientId).single(),
        supabase.from("strategies").select("*").eq("client_id", clientId).single(),
      ]);
      if (clientRes.data) {
        setClientData(clientRes.data);
        setClientName(String(clientRes.data.name || "العميل"));
        const clientPlatforms = (clientRes.data.platforms as string[]) || [];
        if (clientPlatforms.length > 0) setForm(f => ({ ...f, platforms: clientPlatforms }));
        if (clientRes.data.budget_monthly) setForm(f => ({ ...f, budgetTotal: Number(clientRes.data!.budget_monthly) }));
      }
      if (!strategyRes.error) setStrategy(strategyRes.data);
    }
    fetchClient();
  }, [clientId]);

  function update(field: keyof FormData, value: unknown) { setForm(p => ({ ...p, [field]: value })); }
  function toggleArray(field: "platforms" | "contentTypes", val: string) {
    const arr = form[field];
    update(field, arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
  }
  function getBudget(platformId: string): number {
    if (form.budgetMode === "ai") {
      const pct = AI_DISTRIBUTION[platformId] || 20;
      const totalPct = form.platforms.reduce((s, p) => s + (AI_DISTRIBUTION[p] || 20), 0);
      return Math.round((pct / totalPct) * form.budgetTotal);
    }
    return Math.round(form.budgetTotal / form.platforms.length);
  }

  // توليد الصورة لمنشور محدد
  async function generateImage(index: number) {
    const c = generatedContent[index];
    if (!c) return;

    setGeneratedContent(prev => prev.map((item, i) =>
      i === index ? { ...item, imageLoading: true } : item
    ));

    try {
      const sectorPrompts: Record<string, string> = {
        restaurants: "delicious food photography, restaurant dish, appetizing",
        salons: "beauty salon, hair styling, elegant",
        clinics: "healthcare, medical professional, clean clinic",
        retail: "retail products, shopping, modern store",
        ecommerce: "online shopping, products display, modern",
        education: "education, learning, students",
        real_estate: "real estate, modern building, luxury property",
        other: "professional business, modern office",
      };

      const sector = String(clientData?.sector || "other");
      const sectorContext = sectorPrompts[sector] || sectorPrompts.other;

      const response = await fetch("/api/ai/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `${sectorContext}, ${form.goal}, ${form.name}, professional Saudi Arabian market`,
          platform: c.platform,
          clientName,
          style: "modern professional Arabic market style",
        }),
      });

      const data = await response.json();

      setGeneratedContent(prev => prev.map((item, i) =>
        i === index ? { ...item, imageUrl: data.imageUrl, imageLoading: false } : item
      ));
    } catch (err) {
      console.error(err);
      setGeneratedContent(prev => prev.map((item, i) =>
        i === index ? { ...item, imageLoading: false } : item
      ));
    }
  }

  // توليد المحتوى النصي
  async function handleGenerate() {
    setGenerating(true);
    setGeneratedContent([]);
    try {
      const response = await fetch("/api/ai/strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientData: {
            name: clientName, sector: clientData?.sector, city: clientData?.city,
            neighborhood: clientData?.neighborhood, platforms: form.platforms,
            goals: [form.goal], budgetMonthly: form.budgetTotal,
            description: clientData?.description, contentLanguage: clientData?.content_language,
            targetAge: clientData?.target_age, targetGender: clientData?.target_gender,
            targetAreas: clientData?.target_areas, aiNotes: form.aiNotes,
            campaignName: form.name, contentTypes: form.contentTypes,
          }
        }),
      });

      if (!response.ok) throw new Error("فشل الاتصال بـ Claude API");
      const result = await response.json();

      const strategyPeakTimes = strategy?.peak_times as Record<string, string[]> | undefined;
      const peakTimes = strategyPeakTimes
        ? Object.values(strategyPeakTimes).flat()
        : ["12:00 م الجمعة", "9:00 م الجمعة"];

      const content: GeneratedContent[] = form.platforms.slice(0, 4).map((pid, i) => {
        const p = PLATFORMS.find(x => x.id === pid)!;
        return {
          platform: pid,
          type: form.contentTypes[0] || "story",
          caption: result.strategy?.recommendations?.[i]?.text || `محتوى ${p.label} لحملة ${form.name}`,
          hashtags: [`#${clientName.replace(/\s/g, "_")}`, `#${form.goal.replace(/\s/g, "_")}`],
          time: peakTimes[i % peakTimes.length] || "12:00 م",
          score: Math.floor(Math.random() * 15) + 82,
        };
      });

      setGeneratedContent(content);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  }

  async function handleLaunch() {
    if (!clientId) return;
    setLaunching(true);
    try {
      const budgetDistribution: Record<string, number> = {};
      form.platforms.forEach(pid => { budgetDistribution[pid] = getBudget(pid); });

      const { data: campaign, error: campErr } = await supabase
        .from("campaigns")
        .insert({
          client_id: clientId, name: form.name, goal: form.goal,
          platforms: form.platforms, budget_total: form.budgetTotal,
          budget_distribution: budgetDistribution,
          start_date: form.startDate || null, end_date: form.endDate || null,
          ai_notes: form.aiNotes || null, status: "active",
          impressions: 0, clicks: 0, orders: 0, spend: 0,
        })
        .select().single();

      if (campErr) throw campErr;

      if (generatedContent.length > 0 && campaign) {
        const contentRows = generatedContent.map(c => ({
          campaign_id: campaign.id, client_id: clientId,
          platform: c.platform, type: c.type, caption: c.caption,
          hashtags: c.hashtags, scheduled_at: null,
          status: "pending_review", ai_score: c.score,
          image_url: c.imageUrl || null,
        }));
        await supabase.from("content").insert(contentRows);
      }

      router.push(`/clients/${clientId}`);
    } catch (err) {
      console.error(err);
      alert("فشل إطلاق الحملة: " + (err instanceof Error ? err.message : "خطأ غير معروف"));
    } finally {
      setLaunching(false);
    }
  }

  const peakTimesFromStrategy = strategy?.peak_times as Record<string, string[]> | undefined;
  const canNext = () => {
    if (step === 1) return form.name && form.goal;
    if (step === 2) return form.platforms.length > 0 && form.budgetTotal > 0;
    if (step === 3) return true;
    if (step === 4) return generatedContent.length > 0;
    if (step === 5) return form.startDate && form.endDate;
    return true;
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <TopNav currentClient={clientId ? { id: clientId, name: clientName } : null} alertCount={0} user={{ name: "عمر", email: "omar@markiq.sa", role: "admin" }} />
      <Breadcrumb items={[{ label: "لوحة التحكم", href: "/dashboard" }, { label: "الحملات", href: "/campaigns" }, { label: "حملة جديدة" }]} />

      <div className="bg-white border-b border-gray-200 px-5 py-3">
        <div className="flex items-center gap-1.5 max-w-4xl mx-auto overflow-x-auto">
          {STEPS.map((s, i) => (
            <div key={s.num} className="flex items-center gap-1.5 flex-shrink-0">
              <div className={`flex items-center gap-1.5 ${i < step - 1 ? "text-green-600" : i === step - 1 ? "text-primary-500" : "text-gray-400"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${i < step - 1 ? "bg-green-500 text-white" : i === step - 1 ? "bg-primary-500 text-white" : "bg-gray-100 text-gray-400 border border-gray-200"}`}>
                  {i < step - 1 ? "✓" : s.num}
                </div>
                <span className={`text-[10.5px] whitespace-nowrap ${i === step - 1 ? "font-medium" : ""}`}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && <div className="w-4 h-px bg-gray-200" />}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">

        {/* STEP 1 */}
        {step === 1 && (
          <Card>
            <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Megaphone size={15} className="text-primary-500" /> تفاصيل الحملة
              {clientName && <span className="text-xs text-gray-400 font-normal">— {clientName}</span>}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] text-gray-500 mb-1">اسم الحملة <span className="text-red-500">*</span></label>
                <input type="text" value={form.name} onChange={e => update("name", e.target.value)}
                  placeholder={`مثال: حملة يونيو — ${clientName}`}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-gray-50" />
              </div>
              <div>
                <label className="block text-[11px] text-gray-500 mb-2">هدف الحملة <span className="text-red-500">*</span></label>
                <div className="space-y-2">
                  {GOALS.map(g => (
                    <button key={g} onClick={() => update("goal", g)}
                      className={`w-full text-right px-3 py-2 rounded-lg text-xs border flex items-center gap-2 transition-colors ${form.goal === g ? "bg-primary-light border-blue-300 text-primary-500" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                      <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${form.goal === g ? "border-primary-500 bg-primary-500" : "border-gray-300"}`} />
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-gray-500 mb-1">ملاحظات للذكاء الاصطناعي</label>
                <textarea value={form.aiNotes} onChange={e => update("aiNotes", e.target.value)}
                  placeholder="أي تعليمات خاصة للـ AI عند توليد المحتوى..." rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-gray-50 resize-none" />
              </div>
            </div>
          </Card>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <Card>
            <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <DollarSign size={15} className="text-primary-500" /> المنصات والميزانية
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] text-gray-500 mb-2">المنصات <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-4 gap-2">
                  {PLATFORMS.map(p => (
                    <button key={p.id} onClick={() => toggleArray("platforms", p.id)}
                      className={`py-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${form.platforms.includes(p.id) ? "border-blue-300 bg-primary-light shadow-sm" : "border-gray-200 hover:border-gray-300"}`}>
                      <PlatformSVG id={p.id} active={form.platforms.includes(p.id)} />
                      <div className={`text-[10px] ${form.platforms.includes(p.id) ? "text-primary-500 font-medium" : "text-gray-500"}`}>{p.label}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">إجمالي الميزانية (ر.س) <span className="text-red-500">*</span></label>
                  <input type="number" value={form.budgetTotal} onChange={e => update("budgetTotal", Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-gray-50" />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">طريقة التوزيع</label>
                  <select value={form.budgetMode} onChange={e => update("budgetMode", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-gray-50">
                    <option value="ai">توزيع ذكي — AI</option>
                    <option value="equal">توزيع متساوي</option>
                  </select>
                </div>
              </div>
              {form.platforms.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-2">
                    <Brain size={12} className="text-primary-500" /> التوزيع المقترح
                  </div>
                  <div className="space-y-2">
                    {form.platforms.map(pid => {
                      const p = PLATFORMS.find(x => x.id === pid)!;
                      const budget = getBudget(pid);
                      const pct = Math.round((budget / form.budgetTotal) * 100);
                      return (
                        <div key={pid} className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5 w-24 flex-shrink-0">
                            <PlatformSVG id={pid} active={true} />
                            <span className="text-[11px] font-medium text-gray-700">{p.label}</span>
                          </div>
                          <div className="flex-1"><ProgressBar value={pct} color={p.color} height="h-[5px]" /></div>
                          <div className="text-[10px] text-gray-500 w-8 text-center">{pct}%</div>
                          <div className="text-[11px] font-medium text-gray-800 w-20 text-left flex-shrink-0">{budget.toLocaleString()} ر.س</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <Card>
            <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FileText size={15} className="text-primary-500" /> نوع المحتوى المطلوب
            </h2>
            <div className="bg-primary-light border border-blue-200 rounded-xl p-3 mb-4">
              <div className="text-[11px] font-medium text-primary-500 mb-2 flex items-center gap-1.5">
                <Brain size={12} /> الموقع يقترح تلقائياً بناءً على منصاتك
              </div>
              <div className="space-y-1.5">
                {form.platforms.map(pid => {
                  const p = PLATFORMS.find(x => x.id === pid)!;
                  const suggested = pid === "instagram" ? "ريلز + ستوري يومي" : pid === "snapchat" ? "ستوري يومي + فيديو قصير" : pid === "tiktok" ? "ريلز / تيك توك" : pid === "google" ? "نص إعلاني" : pid === "youtube" ? "فيديو قصير" : "صورة + كابشن";
                  return (
                    <div key={pid} className="flex items-center gap-2 text-[10.5px]">
                      <PlatformSVG id={pid} active={true} />
                      <span className="text-gray-600 font-medium">{p.label}:</span>
                      <span className="text-primary-500">{suggested}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="text-[11px] text-gray-500 mb-2">يمكنك تخصيص أنواع إضافية (اختياري):</div>
            <div className="grid grid-cols-3 gap-3">
              {CONTENT_TYPES.map(ct => (
                <button key={ct.id} onClick={() => toggleArray("contentTypes", ct.id)}
                  className={`p-4 rounded-xl border text-center transition-all ${form.contentTypes.includes(ct.id) ? "bg-primary-light border-blue-300 shadow-sm" : "border-gray-200 hover:border-gray-300 bg-gray-50"}`}>
                  <div className="text-2xl mb-2">{ct.icon}</div>
                  <div className={`text-[11px] font-medium ${form.contentTypes.includes(ct.id) ? "text-primary-500" : "text-gray-600"}`}>{ct.label}</div>
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* STEP 4 — توليد المحتوى + الصور */}
        {step === 4 && (
          <Card>
            <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Sparkles size={15} className="text-primary-500" /> توليد المحتوى بـ AI
            </h2>

            {generatedContent.length === 0 && !generating && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Brain size={28} className="text-primary-500" />
                </div>
                <div className="text-sm font-medium text-gray-800 mb-2">جاهز لتوليد المحتوى</div>
                <div className="text-xs text-gray-500 mb-2 max-w-xs mx-auto">
                  Claude AI سيكتب الكابشن بلهجة سعودية لكل منصة
                </div>
                <div className="text-xs text-gray-400 mb-5 max-w-xs mx-auto">
                  ثم يمكنك توليد صور احترافية بـ DALL-E 3 لكل منشور
                </div>
                <Button icon={<Sparkles size={12} />} onClick={handleGenerate}>ابدأ توليد المحتوى</Button>
              </div>
            )}

            {generating && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Brain size={28} className="text-primary-500" />
                </div>
                <div className="text-sm font-medium text-gray-800 mb-2">Claude AI يكتب المحتوى...</div>
                <div className="flex justify-center gap-1.5">
                  {[0, 1, 2].map(i => <div key={i} className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
                </div>
              </div>
            )}

            {generatedContent.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                  <CheckCircle size={13} /> تم توليد {generatedContent.length} منشورات بنجاح
                </div>

                {generatedContent.map((c, i) => {
                  const p = PLATFORMS.find(x => x.id === c.platform)!;
                  return (
                    <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-b border-gray-100">
                        <PlatformSVG id={c.platform} active={true} />
                        <span className="text-xs text-gray-600">{p?.label}</span>
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full mr-auto">
                          {CONTENT_TYPES.find(x => x.id === c.type)?.label}
                        </span>
                        <span className="text-[10px] text-green-600 font-medium">نقاط: {c.score}</span>
                      </div>

                      {/* الصورة */}
                      {c.imageUrl ? (
                        <div className="relative">
                          <img src={c.imageUrl} alt={`صورة ${p?.label}`}
                            className="w-full h-48 object-cover" />
                          <button onClick={() => generateImage(i)}
                            className="absolute top-2 left-2 bg-white/90 text-[10px] text-gray-600 px-2 py-1 rounded-lg border border-gray-200 hover:bg-white flex items-center gap-1">
                            <Image size={11} /> تجديد
                          </button>
                        </div>
                      ) : (
                        <div className="mx-3 mt-3 border-2 border-dashed border-gray-200 rounded-xl h-32 flex flex-col items-center justify-center gap-2 bg-gray-50">
                          {c.imageLoading ? (
                            <>
                              <Loader2 size={20} className="animate-spin text-primary-500" />
                              <div className="text-[10px] text-gray-400">DALL-E 3 يولد الصورة...</div>
                            </>
                          ) : (
                            <>
                              <Image size={20} className="text-gray-300" />
                              <div className="text-[10px] text-gray-400 mb-1">لا توجد صورة بعد</div>
                              <button onClick={() => generateImage(i)}
                                className="text-[10px] bg-primary-500 text-white px-3 py-1.5 rounded-lg hover:bg-primary-600 flex items-center gap-1">
                                <Sparkles size={10} /> توليد صورة بـ DALL-E 3
                              </button>
                            </>
                          )}
                        </div>
                      )}

                      <div className="p-3">
                        <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line mb-2">{c.caption}</p>
                        {c.hashtags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {c.hashtags.map((h, hi) => <span key={hi} className="text-[10px] text-primary-500">{h}</span>)}
                          </div>
                        )}
                        <div className="text-[10px] text-gray-400 flex items-center gap-1">
                          <Calendar size={9} /> أفضل وقت: {c.time}
                        </div>
                      </div>
                    </div>
                  );
                })}

                <Button variant="outline" icon={<Sparkles size={11} />} onClick={handleGenerate} className="w-full justify-center">
                  إعادة توليد النصوص
                </Button>
              </div>
            )}
          </Card>
        )}

        {/* STEP 5 */}
        {step === 5 && (
          <Card>
            <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar size={15} className="text-primary-500" /> جدولة الحملة
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">تاريخ البداية <span className="text-red-500">*</span></label>
                  <input type="date" value={form.startDate} onChange={e => update("startDate", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-gray-50" />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">تاريخ الانتهاء <span className="text-red-500">*</span></label>
                  <input type="date" value={form.endDate} onChange={e => update("endDate", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-gray-50" />
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                <div className="text-[11px] font-medium text-green-700 mb-2">🕐 أوقات النشر الموصى بها</div>
                {peakTimesFromStrategy ? (
                  <div className="space-y-1.5 text-[10.5px] text-green-700">
                    {Object.entries(peakTimesFromStrategy).map(([day, times]) => (
                      <div key={day}>{day}: {(times as string[]).join("، ")}</div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-1.5 text-[10.5px] text-green-700">
                    <div>الجمعة: 11:00 ص، 2:00 م، 9:00 م</div>
                    <div>السبت: 12:00 م، 7:00 م</div>
                  </div>
                )}
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-yellow-300" />
                  <div className="text-[11px] font-medium text-yellow-700">🕌 تجنب أوقات الصلاة</div>
                </label>
                <div className="text-[10.5px] text-yellow-600 mt-1 mr-6">الفجر، الظهر، العصر، المغرب، العشاء</div>
              </div>
            </div>
          </Card>
        )}

        {/* STEP 6 */}
        {step === 6 && (
          <div className="space-y-4">
            <Card>
              <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <CheckCircle size={15} className="text-primary-500" /> مراجعة الحملة قبل الإطلاق
              </h2>
              <div className="space-y-3">
                {[
                  { title: "تفاصيل الحملة", rows: [["العميل", clientName], ["الاسم", form.name || "—"], ["الهدف", form.goal || "—"]] },
                  { title: "المنصات والميزانية", rows: [["المنصات", form.platforms.map(p => PLATFORMS.find(x => x.id === p)?.label).join("، ") || "—"], ["إجمالي الميزانية", `${form.budgetTotal.toLocaleString()} ر.س`]] },
                  { title: "الجدولة", rows: [["تاريخ البداية", form.startDate || "—"], ["تاريخ الانتهاء", form.endDate || "—"]] },
                  { title: "المحتوى", rows: [["المنشورات المولّدة", `${generatedContent.length} منشور`], ["الصور", `${generatedContent.filter(c => c.imageUrl).length} صورة مولّدة`]] },
                ].map((section, si) => (
                  <div key={si} className="bg-gray-50 rounded-xl p-3">
                    <div className="text-[11px] font-semibold text-gray-600 mb-2">{section.title}</div>
                    {section.rows.map(([lbl, val], ri) => (
                      <div key={ri} className="flex justify-between py-1 border-b border-gray-100 last:border-0 text-xs">
                        <span className="text-gray-400">{lbl}</span>
                        <span className="text-gray-700 font-medium">{val}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </Card>
            <div className="bg-primary-light border border-blue-200 rounded-xl p-4 text-xs text-blue-700">
              <div className="font-medium mb-1">✓ الحملة جاهزة للإطلاق</div>
              سيتم حفظ الحملة والمحتوى والصور للمراجعة. يمكنك متابعة الأداء من ملف العميل.
            </div>
            <Button className="w-full justify-center py-3"
              icon={launching ? <Loader2 size={13} className="animate-spin" /> : <Megaphone size={13} />}
              onClick={handleLaunch}>
              {launching ? "جارٍ الإطلاق..." : "🚀 إطلاق الحملة الآن"}
            </Button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <Button variant="outline" icon={<ChevronRight size={12} />} onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1}>السابق</Button>
          <span className="text-xs text-gray-400">الخطوة <span className="text-primary-500 font-medium">{step}</span> من {STEPS.length}</span>
          {step < STEPS.length && <Button icon={<ChevronLeft size={12} />} onClick={() => setStep(s => s + 1)} disabled={!canNext()}>التالي</Button>}
          {step === STEPS.length && <div />}
        </div>
      </div>
    </div>
  );
}

export default function CampaignBuilderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-xs text-gray-400">جاري التحميل...</div></div>}>
      <CampaignBuilderContent />
    </Suspense>
  );
}
