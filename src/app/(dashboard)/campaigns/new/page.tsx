"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Megaphone, DollarSign, FileText, Sparkles, Calendar,
  CheckCircle, ChevronLeft, ChevronRight, Loader2, Brain, Plus, X
} from "lucide-react";
import TopNav from "@/components/layout/TopNav";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { Button, Card, ProgressBar } from "@/components/ui";

// ===== CONSTANTS =====
const PLATFORMS = [
  { id: "instagram", label: "انستقرام", color: "#8B2FC9", short: "IG" },
  { id: "snapchat", label: "سناب شات", color: "#B8860B", short: "SN" },
  { id: "google", label: "قوقل", color: "#FF6B35", short: "GG" },
  { id: "tiktok", label: "تيك توك", color: "#006E9E", short: "TK" },
  { id: "twitter", label: "تويتر X", color: "#1DA1F2", short: "TW" },
  { id: "youtube", label: "يوتيوب", color: "#FF0000", short: "YT" },
  { id: "facebook", label: "فيسبوك", color: "#1877F2", short: "FB" },
  { id: "maps", label: "Google Maps", color: "#34A853", short: "MP" },
];

const GOALS = [
  "زيادة الطلبات عبر التوصيل",
  "بناء الوعي بالبراند",
  "استقطاب عملاء جدد",
  "تحسين التقييمات",
  "ترويج منتج جديد",
  "زيادة المتابعين",
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

interface FormData {
  name: string;
  goal: string;
  aiNotes: string;
  platforms: string[];
  budgetTotal: number;
  budgetMode: "ai" | "manual" | "equal";
  budgetDistribution: Record<string, number>;
  contentTypes: string[];
  startDate: string;
  endDate: string;
}

const AI_DISTRIBUTION: Record<string, number> = {
  google: 40, instagram: 35, snapchat: 25,
  tiktok: 20, twitter: 15, youtube: 25, facebook: 20, maps: 5,
};

// ===== MOCK GENERATED CONTENT =====
const MOCK_CONTENT = [
  {
    platform: "instagram", type: "story",
    caption: "🍝 جديد في معك رونة — الباستا الكريمية وصلت!\n\nطبق غني وكريمي يتوصّل لك طازج وساخن 🔥\nهالأسبوع التوصيل مجاني على أول طلب!\n\nاطلب الحين من هنقرستيشن 🛵",
    hashtags: ["#معك_رونة", "#باستا_كريمية", "#توصيل_مجاني", "#باستا_الرياض"],
    time: "12:00 م الجمعة", score: 94,
  },
  {
    platform: "google", type: "text",
    caption: "أطيب باستا في الرياض — توصيل سريع لحيك | معك رونة | هنقرستيشن وجاهز",
    hashtags: [],
    time: "دائم", score: 88,
  },
  {
    platform: "snapchat", type: "story",
    caption: "⚡ عرض محدود — باستا معك رونة بتوصيل مجاني!\nاطلب قبل منتصف الليل 🌙",
    hashtags: ["#معك_رونة", "#عرض_اليوم"],
    time: "9:00 م الجمعة", score: 85,
  },
];

// ===== COMPONENT =====
export default function CampaignBuilderPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>({
    name: "", goal: "", aiNotes: "",
    platforms: [], budgetTotal: 3000, budgetMode: "ai",
    budgetDistribution: {}, contentTypes: [],
    startDate: "", endDate: "",
  });
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [launching, setLaunching] = useState(false);

  function update(field: keyof FormData, value: unknown) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  function toggleArray(field: "platforms" | "contentTypes", val: string) {
    const arr = form[field];
    update(field, arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  }

  function getBudget(platformId: string): number {
    if (form.budgetMode === "ai") {
      const pct = AI_DISTRIBUTION[platformId] || 20;
      const totalPct = form.platforms.reduce((s, p) => s + (AI_DISTRIBUTION[p] || 20), 0);
      return Math.round((pct / totalPct) * form.budgetTotal);
    }
    if (form.budgetMode === "equal") {
      return Math.round(form.budgetTotal / form.platforms.length);
    }
    return form.budgetDistribution[platformId] || 0;
  }

  async function handleGenerate() {
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 3000));
    setGenerating(false);
    setGenerated(true);
  }

  async function handleLaunch() {
    setLaunching(true);
    await new Promise((r) => setTimeout(r, 2000));
    setLaunching(false);
    router.push("/campaigns");
  }

  const canNext = () => {
    if (step === 1) return form.name && form.goal;
    if (step === 2) return form.platforms.length > 0 && form.budgetTotal > 0;
    if (step === 3) return form.contentTypes.length > 0;
    if (step === 4) return generated;
    if (step === 5) return form.startDate && form.endDate;
    return true;
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <TopNav
        currentClient={{ id: "1", name: "معك رونة" }}
        alertCount={3}
        user={{ name: "عمر", email: "omar@markiq.sa", role: "admin" }}
      />
      <Breadcrumb items={[
        { label: "لوحة التحكم", href: "/dashboard" },
        { label: "الحملات", href: "/campaigns" },
        { label: "حملة جديدة" },
      ]} />

      {/* Wizard Bar */}
      <div className="bg-white border-b border-gray-200 px-5 py-3">
        <div className="flex items-center gap-1.5 max-w-4xl mx-auto overflow-x-auto">
          {STEPS.map((s, i) => (
            <div key={s.num} className="flex items-center gap-1.5 flex-shrink-0">
              <div className={`flex items-center gap-1.5 ${
                i < step - 1 ? "text-green-600" :
                i === step - 1 ? "text-primary-500" : "text-gray-400"
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  i < step - 1 ? "bg-green-500 text-white" :
                  i === step - 1 ? "bg-primary-500 text-white" :
                  "bg-gray-100 text-gray-400 border border-gray-200"
                }`}>
                  {i < step - 1 ? "✓" : s.num}
                </div>
                <span className={`text-[10.5px] whitespace-nowrap ${i === step - 1 ? "font-medium" : ""}`}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && <div className="w-4 h-px bg-gray-200" />}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">

        {/* ===== STEP 1: تفاصيل الحملة ===== */}
        {step === 1 && (
          <Card>
            <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Megaphone size={15} className="text-primary-500" /> تفاصيل الحملة
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] text-gray-500 mb-1">اسم الحملة <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="مثال: حملة رمضان — باستا معك رونة"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-[11px] text-gray-500 mb-2">هدف الحملة <span className="text-red-500">*</span></label>
                <div className="space-y-2">
                  {GOALS.map((g) => (
                    <button
                      key={g}
                      onClick={() => update("goal", g)}
                      className={`w-full text-right px-3 py-2 rounded-lg text-xs border flex items-center gap-2 transition-colors ${
                        form.goal === g
                          ? "bg-primary-light border-blue-300 text-primary-500"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                        form.goal === g ? "border-primary-500 bg-primary-500" : "border-gray-300"
                      }`}>
                        {form.goal === g && <div className="w-full h-full rounded-full bg-white scale-50" />}
                      </div>
                      {g}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-gray-500 mb-1">ملاحظات للذكاء الاصطناعي</label>
                <textarea
                  value={form.aiNotes}
                  onChange={(e) => update("aiNotes", e.target.value)}
                  placeholder="أي تعليمات خاصة للـ AI عند توليد المحتوى..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-gray-50 resize-none"
                />
              </div>
            </div>
          </Card>
        )}

        {/* ===== STEP 2: المنصات والميزانية ===== */}
        {step === 2 && (
          <Card>
            <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <DollarSign size={15} className="text-primary-500" /> المنصات والميزانية
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] text-gray-500 mb-2">المنصات <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-4 gap-2">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => toggleArray("platforms", p.id)}
                      className={`py-3 rounded-xl border text-center transition-all ${
                        form.platforms.includes(p.id)
                          ? "border-blue-300 bg-primary-light shadow-sm"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-lg font-bold mb-0.5" style={{ color: form.platforms.includes(p.id) ? p.color : "#9CA3AF" }}>
                        {p.short}
                      </div>
                      <div className={`text-[10px] ${form.platforms.includes(p.id) ? "text-primary-500 font-medium" : "text-gray-500"}`}>
                        {p.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">إجمالي الميزانية (ر.س) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    value={form.budgetTotal}
                    onChange={(e) => update("budgetTotal", Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">طريقة التوزيع</label>
                  <select
                    value={form.budgetMode}
                    onChange={(e) => update("budgetMode", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-gray-50"
                  >
                    <option value="ai">توزيع ذكي — AI</option>
                    <option value="equal">توزيع متساوي</option>
                    <option value="manual">يدوي</option>
                  </select>
                </div>
              </div>

              {form.platforms.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-2">
                    <Brain size={12} className="text-primary-500" />
                    التوزيع المقترح
                  </div>
                  <div className="space-y-2">
                    {form.platforms.map((pid) => {
                      const p = PLATFORMS.find((x) => x.id === pid)!;
                      const budget = getBudget(pid);
                      const pct = Math.round((budget / form.budgetTotal) * 100);
                      return (
                        <div key={pid} className="flex items-center gap-3">
                          <div className="text-[11px] font-medium text-gray-700 w-20 flex-shrink-0">{p.label}</div>
                          <div className="flex-1">
                            <ProgressBar value={pct} color={p.color} height="h-[5px]" />
                          </div>
                          <div className="text-[10px] text-gray-500 w-6 text-center">{pct}%</div>
                          <div className="text-[11px] font-medium text-gray-800 w-20 text-left flex-shrink-0">
                            {budget.toLocaleString()} ر.س
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* AI Suggestions */}
              <div className="bg-primary-light border border-blue-200 rounded-xl p-3">
                <div className="text-[11px] font-medium text-primary-500 mb-2 flex items-center gap-1.5">
                  <Brain size={12} /> اقتراحات الذكاء الاصطناعي
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "توصية الميزانية", text: "قوقل يحقق أفضل عائد — خصص له 40%" },
                    { label: "وقت الإطلاق", text: "الخميس مساءً أو الجمعة صباحاً" },
                    { label: "توقع الطلبات", text: "180-240 طلب خلال مدة الحملة" },
                    { label: "العائد المتوقع", text: "3.2-4.1x عائد على الاستثمار" },
                  ].map((s, i) => (
                    <div key={i} className="bg-white rounded-lg p-2 border border-blue-100">
                      <div className="text-[9px] text-blue-500 font-medium mb-0.5">{s.label}</div>
                      <div className="text-[10.5px] text-gray-700">{s.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* ===== STEP 3: نوع المحتوى ===== */}
        {step === 3 && (
          <Card>
            <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FileText size={15} className="text-primary-500" /> نوع المحتوى المطلوب
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {CONTENT_TYPES.map((ct) => (
                <button
                  key={ct.id}
                  onClick={() => toggleArray("contentTypes", ct.id)}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    form.contentTypes.includes(ct.id)
                      ? "bg-primary-light border-blue-300 shadow-sm"
                      : "border-gray-200 hover:border-gray-300 bg-gray-50"
                  }`}
                >
                  <div className="text-2xl mb-2">{ct.icon}</div>
                  <div className={`text-[11px] font-medium ${form.contentTypes.includes(ct.id) ? "text-primary-500" : "text-gray-600"}`}>
                    {ct.label}
                  </div>
                </button>
              ))}
            </div>

            {form.contentTypes.length > 0 && (
              <div className="mt-4 bg-gray-50 rounded-xl p-3 text-xs text-gray-600">
                <div className="font-medium text-gray-700 mb-1">ما سيتم توليده:</div>
                <div className="space-y-1">
                  {form.platforms.slice(0, 3).map((pid) => {
                    const p = PLATFORMS.find((x) => x.id === pid)!;
                    return (
                      <div key={pid} className="flex items-center gap-2">
                        <span className="font-medium" style={{ color: p.color }}>{p.label}</span>
                        <span className="text-gray-400">—</span>
                        <span>{form.contentTypes.map((ct) => CONTENT_TYPES.find((x) => x.id === ct)?.label).filter(Boolean).join("، ")}</span>
                      </div>
                    );
                  })}
                  {form.platforms.length > 3 && (
                    <div className="text-gray-400">+ {form.platforms.length - 3} منصات أخرى</div>
                  )}
                </div>
              </div>
            )}
          </Card>
        )}

        {/* ===== STEP 4: توليد المحتوى ===== */}
        {step === 4 && (
          <Card>
            <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Sparkles size={15} className="text-primary-500" /> توليد المحتوى بـ AI
            </h2>

            {!generated && !generating && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Brain size={28} className="text-primary-500" />
                </div>
                <div className="text-sm font-medium text-gray-800 mb-2">جاهز لتوليد المحتوى</div>
                <div className="text-xs text-gray-500 mb-5 max-w-xs mx-auto">
                  Claude AI سيكتب الكابشن بلهجة سعودية، وDALL-E سيوّلد الصور لكل منصة
                </div>
                <Button icon={<Sparkles size={12} />} onClick={handleGenerate}>
                  ابدأ توليد المحتوى
                </Button>
              </div>
            )}

            {generating && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-primary-light rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Brain size={28} className="text-primary-500" />
                </div>
                <div className="text-sm font-medium text-gray-800 mb-2">Claude AI يكتب المحتوى...</div>
                <div className="text-xs text-gray-500 mb-4">يتم توليد كابشن ذكي بلهجة سعودية + هاشتاقات + وقت النشر</div>
                <div className="flex justify-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}

            {generated && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                  <CheckCircle size={13} /> تم توليد {MOCK_CONTENT.length} منشورات بنجاح
                </div>
                {MOCK_CONTENT.map((c, i) => {
                  const p = PLATFORMS.find((x) => x.id === c.platform)!;
                  return (
                    <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-b border-gray-100">
                        <span className="text-xs font-bold" style={{ color: p.color }}>{p.short}</span>
                        <span className="text-xs text-gray-600">{p.label}</span>
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full mr-auto">
                          {CONTENT_TYPES.find((x) => x.id === c.type)?.label}
                        </span>
                        <span className="text-[10px] text-green-600 font-medium">نقاط: {c.score}</span>
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line mb-2">{c.caption}</p>
                        {c.hashtags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {c.hashtags.map((h, hi) => (
                              <span key={hi} className="text-[10px] text-primary-500">{h}</span>
                            ))}
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
                  إعادة التوليد
                </Button>
              </div>
            )}
          </Card>
        )}

        {/* ===== STEP 5: الجدولة ===== */}
        {step === 5 && (
          <Card>
            <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Calendar size={15} className="text-primary-500" /> جدولة الحملة
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">تاريخ البداية <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => update("startDate", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">تاريخ الانتهاء <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => update("endDate", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-gray-50"
                  />
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                <div className="text-[11px] font-medium text-green-700 mb-2">🕐 أوقات النشر الموصى بها</div>
                <div className="space-y-1.5 text-[10.5px] text-green-700">
                  <div>الجمعة: 11:00 ص، 2:00 م، 9:00 م</div>
                  <div>السبت: 12:00 م، 7:00 م</div>
                  <div>يومياً: 12:30 م، 8:00 م</div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                <div className="text-[11px] font-medium text-yellow-700 mb-1">🕌 أوقات يُتجنب النشر فيها</div>
                <div className="text-[10.5px] text-yellow-600">أوقات الصلاة: الفجر، الظهر، العصر، المغرب، العشاء</div>
              </div>
            </div>
          </Card>
        )}

        {/* ===== STEP 6: المراجعة والإطلاق ===== */}
        {step === 6 && (
          <div className="space-y-4">
            <Card>
              <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <CheckCircle size={15} className="text-primary-500" /> مراجعة الحملة قبل الإطلاق
              </h2>
              <div className="space-y-3">
                {[
                  { title: "تفاصيل الحملة", rows: [["الاسم", form.name || "—"], ["الهدف", form.goal || "—"]] },
                  {
                    title: "المنصات والميزانية",
                    rows: [
                      ["المنصات", form.platforms.map((p) => PLATFORMS.find((x) => x.id === p)?.label).join("، ") || "—"],
                      ["إجمالي الميزانية", `${form.budgetTotal.toLocaleString()} ر.س`],
                    ]
                  },
                  {
                    title: "الجدولة",
                    rows: [
                      ["تاريخ البداية", form.startDate || "—"],
                      ["تاريخ الانتهاء", form.endDate || "—"],
                    ]
                  },
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
              سيتم نشر المحتوى تلقائياً في الأوقات المجدولة. يمكنك مراجعة وإيقاف أي منشور من شاشة مراجعة المحتوى.
            </div>

            <Button
              className="w-full justify-center py-3"
              icon={launching ? <Loader2 size={13} className="animate-spin" /> : <Megaphone size={13} />}
              onClick={handleLaunch}
              loading={launching}
            >
              {launching ? "جارٍ الإطلاق..." : "🚀 إطلاق الحملة الآن"}
            </Button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            icon={<ChevronRight size={12} />}
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
          >
            السابق
          </Button>
          <span className="text-xs text-gray-400">
            الخطوة <span className="text-primary-500 font-medium">{step}</span> من {STEPS.length}
          </span>
          {step < STEPS.length && (
            <Button
              icon={<ChevronLeft size={12} />}
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext()}
            >
              التالي
            </Button>
          )}
          {step === STEPS.length && <div />}
        </div>
      </div>
    </div>
  );
}
