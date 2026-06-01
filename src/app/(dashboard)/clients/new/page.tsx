"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2, MapPin, Target, Search, CheckCircle,
  ChevronLeft, ChevronRight, Plus, X, Loader2
} from "lucide-react";
import TopNav from "@/components/layout/TopNav";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { Button, Card } from "@/components/ui";

// ===== CONSTANTS =====
const SECTORS = [
  "مطاعم وكافيهات", "صالونات ومراكز تجميل", "عيادات وصحة",
  "متاجر وبيع بالتجزئة", "تجارة إلكترونية", "تعليم وتدريب",
  "عقارات", "سيارات", "سياحة وسفر", "أخرى",
];

const CITIES: Record<string, string[]> = {
  "الرياض": ["النزهة", "العليا", "الياسمين", "الملقا", "التخصصي", "المربع", "الروضة", "السليمانية", "حطين", "الغدير"],
  "جدة": ["الحمراء", "الروضة", "الزهراء", "المحمدية", "الشاطئ", "السامر", "الصفا"],
  "مكة المكرمة": ["العزيزية", "أجياد", "الشوقية"],
  "المدينة المنورة": ["قباء", "العوالي", "الحرة الغربية"],
  "الدمام": ["الشاطئ", "العدامة", "الفيصلية"],
  "الخبر": ["الكورنيش", "العقربية", "الثقبة"],
  "أبها": ["المنهل", "الوسام", "الربوة"],
};

const PLATFORMS = [
  { id: "instagram", label: "انستقرام", color: "#8B2FC9" },
  { id: "snapchat", label: "سناب شات", color: "#B8860B" },
  { id: "google", label: "قوقل", color: "#FF6B35" },
  { id: "tiktok", label: "تيك توك", color: "#006E9E" },
  { id: "twitter", label: "تويتر X", color: "#1DA1F2" },
  { id: "youtube", label: "يوتيوب", color: "#FF0000" },
  { id: "facebook", label: "فيسبوك", color: "#1877F2" },
  { id: "maps", label: "Google Maps", color: "#34A853" },
];

const GOALS = [
  "زيادة الطلبات / المبيعات",
  "بناء الوعي بالبراند",
  "استقطاب عملاء جدد",
  "تحسين التقييمات",
  "زيادة المتابعين",
  "الترويج لمنتج / خدمة جديدة",
  "تحسين ظهور قوقل (SEO)",
];

const LANGUAGES = [
  { id: "arabic_saudi", label: "عربي — لهجة سعودية" },
  { id: "arabic_gulf", label: "عربي — لهجة خليجي" },
  { id: "arabic_formal", label: "عربي — فصيح" },
  { id: "bilingual", label: "ثنائي (عربي + إنجليزي)" },
];

const STEPS = [
  { num: 1, label: "بيانات النشاط", icon: <Building2 size={14} /> },
  { num: 2, label: "الموقع والاستهداف", icon: <MapPin size={14} /> },
  { num: 3, label: "المنصات والأهداف", icon: <Target size={14} /> },
  { num: 4, label: "SEO والمحتوى", icon: <Search size={14} /> },
  { num: 5, label: "المراجعة والحفظ", icon: <CheckCircle size={14} /> },
];

// ===== FORM DATA =====
interface FormData {
  // Step 1
  name: string;
  nameEn: string;
  sector: string;
  description: string;
  website: string;
  instagram: string;
  budgetMonthly: number;
  // Step 2
  city: string;
  neighborhood: string;
  targetAreas: string[];
  targetAge: string;
  targetGender: "all" | "male" | "female";
  interests: string[];
  // Step 3
  platforms: string[];
  goals: string[];
  competitors: string[];
  // Step 4
  seoKeywords: string[];
  seoLevel: string;
  contentLanguage: string;
  notes: string;
}

const INITIAL_DATA: FormData = {
  name: "", nameEn: "", sector: "", description: "",
  website: "", instagram: "", budgetMonthly: 5000,
  city: "الرياض", neighborhood: "", targetAreas: [],
  targetAge: "25-34", targetGender: "all", interests: [],
  platforms: [], goals: [], competitors: [],
  seoKeywords: [], seoLevel: "none",
  contentLanguage: "arabic_saudi", notes: "",
};

// ===== COMPONENT =====
export default function NewClientPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL_DATA);
  const [saving, setSaving] = useState(false);
  const [newInterest, setNewInterest] = useState("");
  const [newCompetitor, setNewCompetitor] = useState("");
  const [newKeyword, setNewKeyword] = useState("");

  function update(field: keyof FormData, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function toggleArray(field: keyof FormData, val: string) {
    const arr = form[field] as string[];
    update(field, arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  }

  function addToArray(field: keyof FormData, val: string, setter: (v: string) => void) {
    if (!val.trim()) return;
    const arr = form[field] as string[];
    if (!arr.includes(val.trim())) update(field, [...arr, val.trim()]);
    setter("");
  }

  function removeFromArray(field: keyof FormData, val: string) {
    update(field, (form[field] as string[]).filter((x) => x !== val));
  }

  async function handleSave() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 2000));
    setSaving(false);
    router.push("/clients/new-id/strategy");
  }

  const canNext = () => {
    if (step === 1) return form.name && form.sector;
    if (step === 2) return form.city && form.neighborhood;
    if (step === 3) return form.platforms.length > 0 && form.goals.length > 0;
    if (step === 4) return true;
    return true;
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <TopNav alertCount={3} user={{ name: "عمر", email: "omar@markiq.sa", role: "admin" }} />
      <Breadcrumb items={[
        { label: "لوحة التحكم", href: "/dashboard" },
        { label: "العملاء", href: "/clients" },
        { label: "إضافة عميل جديد" },
      ]} />

      {/* Wizard Steps */}
      <div className="bg-white border-b border-gray-200 px-5 py-3">
        <div className="flex items-center gap-2 max-w-3xl mx-auto">
          {STEPS.map((s, i) => (
            <div key={s.num} className="flex items-center gap-2 flex-shrink-0">
              <div className={`flex items-center gap-1.5 ${i < step - 1 ? "text-green-600" : i === step - 1 ? "text-primary-500" : "text-gray-400"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                  i < step - 1 ? "bg-green-500 text-white" :
                  i === step - 1 ? "bg-primary-500 text-white" :
                  "bg-gray-100 text-gray-400 border border-gray-200"
                }`}>
                  {i < step - 1 ? "✓" : s.num}
                </div>
                <span className={`text-[11px] whitespace-nowrap font-medium ${i === step - 1 ? "text-primary-500" : "text-gray-400"}`}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && <div className="w-6 h-px bg-gray-200 flex-shrink-0" />}
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 max-w-3xl mx-auto">

        {/* ===== STEP 1: بيانات النشاط ===== */}
        {step === 1 && (
          <Card>
            <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Building2 size={15} className="text-primary-500" /> بيانات النشاط التجاري
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">اسم النشاط بالعربي <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="مثال: معك رونة"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">اسم النشاط بالإنجليزي</label>
                  <input
                    type="text"
                    value={form.nameEn}
                    onChange={(e) => update("nameEn", e.target.value)}
                    placeholder="Ma3ak Rona"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-gray-50"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-gray-500 mb-2">القطاع <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-5 gap-2">
                  {SECTORS.map((s) => (
                    <button
                      key={s}
                      onClick={() => update("sector", s)}
                      className={`py-2 px-2 rounded-lg text-[10px] border text-center transition-colors ${
                        form.sector === s
                          ? "bg-primary-light border-blue-300 text-primary-500 font-medium"
                          : "border-gray-200 text-gray-600 hover:border-primary-300"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-gray-500 mb-1">وصف النشاط</label>
                <textarea
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="اكتب وصفاً مختصراً عن النشاط التجاري..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-gray-50 resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">الموقع الإلكتروني</label>
                  <input type="url" value={form.website} onChange={(e) => update("website", e.target.value)} placeholder="https://..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-gray-50" dir="ltr" />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">انستقرام</label>
                  <input type="text" value={form.instagram} onChange={(e) => update("instagram", e.target.value)} placeholder="@username" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-gray-50" dir="ltr" />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">الميزانية الشهرية (ر.س) <span className="text-red-500">*</span></label>
                  <input type="number" value={form.budgetMonthly} onChange={(e) => update("budgetMonthly", Number(e.target.value))} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-gray-50" />
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* ===== STEP 2: الموقع والاستهداف ===== */}
        {step === 2 && (
          <Card>
            <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin size={15} className="text-primary-500" /> الموقع والاستهداف الجغرافي
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">المدينة <span className="text-red-500">*</span></label>
                  <select
                    value={form.city}
                    onChange={(e) => { update("city", e.target.value); update("neighborhood", ""); update("targetAreas", []); }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-gray-50"
                  >
                    {Object.keys(CITIES).map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">حي النشاط <span className="text-red-500">*</span></label>
                  <select
                    value={form.neighborhood}
                    onChange={(e) => update("neighborhood", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-gray-50"
                  >
                    <option value="">اختر الحي</option>
                    {(CITIES[form.city] || []).map((n) => <option key={n}>{n}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-gray-500 mb-2">الأحياء المستهدفة (يمكن اختيار أكثر من حي)</label>
                <div className="flex flex-wrap gap-2">
                  {(CITIES[form.city] || []).map((area) => (
                    <button
                      key={area}
                      onClick={() => toggleArray("targetAreas", area)}
                      className={`px-3 py-1.5 rounded-full text-[11px] border transition-colors ${
                        form.targetAreas.includes(area)
                          ? "bg-green-50 border-green-300 text-green-600 font-medium"
                          : "border-gray-200 text-gray-600 hover:border-green-300"
                      }`}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">الفئة العمرية</label>
                  <select value={form.targetAge} onChange={(e) => update("targetAge", e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-gray-50">
                    {["18-24", "25-34", "35-44", "45-54", "55+", "الجميع"].map((a) => <option key={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">الجنس المستهدف</label>
                  <div className="flex gap-2">
                    {[{ val: "all", lbl: "الجميع" }, { val: "male", lbl: "رجال" }, { val: "female", lbl: "نساء" }].map((g) => (
                      <button
                        key={g.val}
                        onClick={() => update("targetGender", g.val)}
                        className={`flex-1 py-2 rounded-lg text-[11px] border transition-colors ${
                          form.targetGender === g.val
                            ? "bg-primary-light border-blue-300 text-primary-500 font-medium"
                            : "border-gray-200 text-gray-600"
                        }`}
                      >
                        {g.lbl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-gray-500 mb-1">الاهتمامات</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addToArray("interests", newInterest, setNewInterest)}
                    placeholder="اكتب اهتماماً واضغط Enter..."
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-gray-50"
                  />
                  <Button size="sm" onClick={() => addToArray("interests", newInterest, setNewInterest)} icon={<Plus size={11} />}>إضافة</Button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {form.interests.map((int) => (
                    <span key={int} className="flex items-center gap-1 px-2 py-1 bg-primary-light border border-blue-200 text-primary-500 rounded-full text-[10px]">
                      {int}
                      <button onClick={() => removeFromArray("interests", int)}><X size={9} /></button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* ===== STEP 3: المنصات والأهداف ===== */}
        {step === 3 && (
          <Card>
            <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Target size={15} className="text-primary-500" /> المنصات والأهداف التسويقية
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-[11px] text-gray-500 mb-2">المنصات الإعلانية <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-4 gap-2">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => toggleArray("platforms", p.id)}
                      className={`py-3 px-2 rounded-lg text-[11px] border text-center transition-all ${
                        form.platforms.includes(p.id)
                          ? "border-blue-300 bg-primary-light text-primary-500 font-medium shadow-sm"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <div className="font-bold mb-1" style={{ color: form.platforms.includes(p.id) ? p.color : "#999" }}>
                        {p.label.charAt(0).toUpperCase()}
                      </div>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-gray-500 mb-2">الأهداف التسويقية <span className="text-red-500">*</span></label>
                <div className="space-y-2">
                  {GOALS.map((g) => (
                    <button
                      key={g}
                      onClick={() => toggleArray("goals", g)}
                      className={`w-full text-right px-3 py-2 rounded-lg text-xs border transition-colors flex items-center gap-2 ${
                        form.goals.includes(g)
                          ? "bg-green-50 border-green-300 text-green-700"
                          : "border-gray-200 text-gray-600 hover:border-green-200"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
                        form.goals.includes(g) ? "bg-green-500 border-green-500" : "border-gray-300"
                      }`}>
                        {form.goals.includes(g) && <CheckCircle size={10} className="text-white" />}
                      </div>
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-gray-500 mb-1">المنافسون (اختياري)</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newCompetitor}
                    onChange={(e) => setNewCompetitor(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addToArray("competitors", newCompetitor, setNewCompetitor)}
                    placeholder="اسم منافس أو رابط انستقرامه..."
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-gray-50"
                  />
                  <Button size="sm" onClick={() => addToArray("competitors", newCompetitor, setNewCompetitor)} icon={<Plus size={11} />}>إضافة</Button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {form.competitors.map((c) => (
                    <span key={c} className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px]">
                      {c}
                      <button onClick={() => removeFromArray("competitors", c)}><X size={9} /></button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* ===== STEP 4: SEO والمحتوى ===== */}
        {step === 4 && (
          <Card>
            <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Search size={15} className="text-primary-500" /> SEO والمحتوى
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] text-gray-500 mb-1">مستوى SEO الحالي</label>
                <div className="flex gap-2">
                  {[
                    { val: "none", lbl: "لا يوجد" },
                    { val: "weak", lbl: "ضعيف" },
                    { val: "good", lbl: "جيد" },
                    { val: "excellent", lbl: "ممتاز" },
                  ].map((s) => (
                    <button
                      key={s.val}
                      onClick={() => update("seoLevel", s.val)}
                      className={`flex-1 py-2 rounded-lg text-[11px] border transition-colors ${
                        form.seoLevel === s.val
                          ? "bg-primary-light border-blue-300 text-primary-500 font-medium"
                          : "border-gray-200 text-gray-600"
                      }`}
                    >
                      {s.lbl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-gray-500 mb-1">الكلمات المفتاحية لـ SEO</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addToArray("seoKeywords", newKeyword, setNewKeyword)}
                    placeholder="مثال: مطعم باستا الرياض توصيل..."
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-gray-50"
                  />
                  <Button size="sm" onClick={() => addToArray("seoKeywords", newKeyword, setNewKeyword)} icon={<Plus size={11} />}>إضافة</Button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {form.seoKeywords.map((kw) => (
                    <span key={kw} className="flex items-center gap-1 px-2 py-1 bg-primary-light border border-blue-200 text-primary-500 rounded-full text-[10px]">
                      {kw}
                      <button onClick={() => removeFromArray("seoKeywords", kw)}><X size={9} /></button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-gray-500 mb-2">لغة المحتوى</label>
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => update("contentLanguage", l.id)}
                      className={`py-2 px-3 rounded-lg text-[11px] border text-right transition-colors ${
                        form.contentLanguage === l.id
                          ? "bg-primary-light border-blue-300 text-primary-500 font-medium"
                          : "border-gray-200 text-gray-600"
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-gray-500 mb-1">ملاحظات للذكاء الاصطناعي</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  placeholder="أي معلومات إضافية تساعد الذكاء الاصطناعي في بناء الاستراتيجية..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-gray-50 resize-none"
                />
              </div>
            </div>
          </Card>
        )}

        {/* ===== STEP 5: المراجعة ===== */}
        {step === 5 && (
          <Card>
            <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <CheckCircle size={15} className="text-primary-500" /> مراجعة البيانات قبل الحفظ
            </h2>
            <div className="space-y-3">
              {[
                {
                  title: "بيانات النشاط",
                  rows: [
                    ["الاسم", form.name || "—"],
                    ["القطاع", form.sector || "—"],
                    ["الميزانية الشهرية", form.budgetMonthly ? `${form.budgetMonthly.toLocaleString()} ر.س` : "—"],
                  ]
                },
                {
                  title: "الاستهداف",
                  rows: [
                    ["المدينة", `${form.city} — ${form.neighborhood || "—"}`],
                    ["الأحياء المستهدفة", form.targetAreas.join("، ") || "—"],
                    ["الفئة العمرية", form.targetAge],
                    ["الجنس", form.targetGender === "all" ? "الجميع" : form.targetGender === "male" ? "رجال" : "نساء"],
                  ]
                },
                {
                  title: "المنصات والأهداف",
                  rows: [
                    ["المنصات", form.platforms.join("، ") || "—"],
                    ["الأهداف", form.goals.join("، ") || "—"],
                  ]
                },
                {
                  title: "SEO والمحتوى",
                  rows: [
                    ["مستوى SEO", form.seoLevel],
                    ["الكلمات المفتاحية", form.seoKeywords.join("، ") || "—"],
                    ["لغة المحتوى", form.contentLanguage],
                  ]
                },
              ].map((section, si) => (
                <div key={si} className="bg-gray-50 rounded-xl p-3">
                  <div className="text-[11px] font-semibold text-gray-600 mb-2">{section.title}</div>
                  {section.rows.map(([lbl, val], ri) => (
                    <div key={ri} className="flex justify-between items-start py-1 border-b border-gray-100 last:border-0 text-xs">
                      <span className="text-gray-400">{lbl}</span>
                      <span className="text-gray-700 text-left max-w-[60%] text-right">{val}</span>
                    </div>
                  ))}
                </div>
              ))}

              <div className="bg-primary-light border border-blue-200 rounded-xl p-3 text-xs text-blue-700">
                <strong>بعد الحفظ:</strong> سيقوم Claude AI تلقائياً بتوليد استراتيجية تسويقية كاملة للعميل بناءً على هذه البيانات.
              </div>
            </div>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-4">
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
          {step < STEPS.length ? (
            <Button
              icon={<ChevronLeft size={12} />}
              onClick={() => setStep((s) => Math.min(STEPS.length, s + 1))}
              disabled={!canNext()}
            >
              التالي
            </Button>
          ) : (
            <Button
              icon={saving ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
              onClick={handleSave}
              loading={saving}
            >
              {saving ? "جارٍ الحفظ..." : "حفظ وتوليد الاستراتيجية"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
