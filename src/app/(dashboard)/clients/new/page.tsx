"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Building2, MapPin, Target, Search, CheckCircle,
  ChevronLeft, ChevronRight, Plus, X, Loader2
} from "lucide-react";
import TopNav from "@/components/layout/TopNav";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { Button, Card } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";

const SECTORS = [
  { label: "مطاعم وكافيهات", value: "restaurants", icon: "🍽️" },
  { label: "صالونات وتجميل", value: "salons", icon: "💇" },
  { label: "عيادات وصحة", value: "clinics", icon: "🏥" },
  { label: "متاجر وتجزئة", value: "retail", icon: "🛍️" },
  { label: "تجارة إلكترونية", value: "ecommerce", icon: "🛒" },
  { label: "تعليم وتدريب", value: "education", icon: "📚" },
  { label: "عقارات", value: "real_estate", icon: "🏢" },
  { label: "سيارات وورش", value: "automotive", icon: "🚗" },
  { label: "مقاولات وبناء", value: "construction", icon: "🏗️" },
  { label: "صناعة ومصانع", value: "manufacturing", icon: "🏭" },
  { label: "سياحة وسفر", value: "tourism", icon: "✈️" },
  { label: "رياضة ولياقة", value: "fitness", icon: "💪" },
  { label: "أخرى — حدد النشاط", value: "other", icon: "📝" },
];

const PLATFORMS = [
  { id: "instagram", label: "انستقرام", color: "#C13584" },
  { id: "snapchat", label: "سناب شات", color: "#B8860B" },
  { id: "google", label: "قوقل", color: "#FF6B35" },
  { id: "tiktok", label: "تيك توك", color: "#010101" },
  { id: "twitter", label: "تويتر X", color: "#000000" },
  { id: "youtube", label: "يوتيوب", color: "#FF0000" },
  { id: "facebook", label: "فيسبوك", color: "#1877F2" },
  { id: "maps", label: "Google Maps", color: "#34A853" },
];

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

interface FormData {
  name: string; nameEn: string; sector: string;
  activityDescription: string; targetScope: string;
  website: string; instagram: string; budgetMonthly: number;
  city: string; neighborhood: string; targetAreas: string[];
  targetAge: string; targetGender: "all" | "male" | "female";
  interests: string[]; platforms: string[]; goals: string[];
  competitors: string[]; seoKeywords: string[];
  seoLevel: string; contentLanguage: string; notes: string;
}

const INITIAL_DATA: FormData = {
  name: "", nameEn: "", sector: "", activityDescription: "", targetScope: "districts",
  website: "", instagram: "", budgetMonthly: 5000,
  city: "", neighborhood: "", targetAreas: [],
  targetAge: "25-34", targetGender: "all", interests: [],
  platforms: [], goals: [], competitors: [],
  seoKeywords: [], seoLevel: "none",
  contentLanguage: "arabic_saudi", notes: "",
};

function CitySearch({ value, onChange }: { value: string; onChange: (city: string) => void }) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { if (value) setQuery(value); }, [value]);

  useEffect(() => {
    if (!query || query.length < 1) { setResults([]); return; }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/locations?type=cities&q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.cities?.map((c: { city_name: string }) => c.city_name) || []);
        setOpen(true);
      } catch { setResults([]); }
      finally { setLoading(false); }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <input type="text" value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); onChange(""); }}
          onFocus={() => query && setOpen(true)}
          placeholder="ابحث عن المدينة... (مثال: الرياض، جدة، الدمام)"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-gray-50" />
        {loading && <Loader2 size={12} className="absolute left-2 top-2.5 animate-spin text-gray-400" />}
        {value && <div className="absolute left-2 top-3 w-2 h-2 rounded-full bg-green-400" />}
      </div>
      {open && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
          {results.map(city => (
            <button key={city} onClick={() => { onChange(city); setQuery(city); setOpen(false); }}
              className={`w-full text-right px-3 py-2 text-xs hover:bg-gray-50 border-b border-gray-50 last:border-0 ${value === city ? "bg-primary-light text-primary-500 font-medium" : "text-gray-700"}`}>
              {city}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function DistrictSelector({ city, selected, onChange }: { city: string; selected: string[]; onChange: (areas: string[]) => void }) {
  const [query, setQuery] = useState("");
  const [allDistricts, setAllDistricts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!city) { setAllDistricts([]); return; }
    setLoading(true);
    fetch(`/api/locations?type=districts&city=${encodeURIComponent(city)}`)
      .then(r => r.json())
      .then(data => { setAllDistricts(data.districts || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [city]);

  const filtered = query ? allDistricts.filter(d => d.includes(query)) : allDistricts;

  function toggle(district: string) {
    if (selected.includes(district)) onChange(selected.filter(d => d !== district));
    else onChange([...selected, district]);
  }

  if (!city) return <div className="text-xs text-gray-400 bg-gray-50 rounded-xl p-4 text-center">اختر المدينة أولاً</div>;

  return (
    <div className="space-y-2">
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 p-2 bg-primary-light border border-blue-200 rounded-xl">
          <div className="w-full text-[10px] text-primary-500 font-medium mb-1">{selected.length} حي مختار:</div>
          {selected.map(d => (
            <span key={d} className="flex items-center gap-1 px-2 py-0.5 bg-white border border-blue-200 text-primary-500 rounded-full text-[10px]">
              {d}<button onClick={() => toggle(d)}><X size={8} /></button>
            </span>
          ))}
        </div>
      )}
      <div className="relative">
        <Search size={12} className="absolute right-2.5 top-2.5 text-gray-400" />
        <input type="text" value={query} onChange={e => setQuery(e.target.value)}
          placeholder={`ابحث في أحياء ${city}...`}
          className="w-full pr-7 pl-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-gray-50" />
      </div>
      {loading ? (
        <div className="text-center py-4"><Loader2 size={16} className="animate-spin text-primary-500 mx-auto" /></div>
      ) : (
        <div className="border border-gray-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="text-xs text-gray-400 text-center py-4">لا توجد نتائج</div>
          ) : (
            <div className="grid grid-cols-3 gap-px bg-gray-100">
              {filtered.map(district => (
                <button key={district} onClick={() => toggle(district)}
                  className={`text-right px-2.5 py-2 text-[10.5px] transition-colors ${selected.includes(district) ? "bg-primary-light text-primary-500 font-medium" : "bg-white text-gray-600 hover:bg-gray-50"}`}>
                  {selected.includes(district) && "✓ "}{district}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      <div className="text-[10px] text-gray-400">{allDistricts.length} حي متاح — يمكنك اختيار أكثر من حي</div>
    </div>
  );
}

export default function NewClientPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL_DATA);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newInterest, setNewInterest] = useState("");
  const [newCompetitor, setNewCompetitor] = useState("");
  const [newKeyword, setNewKeyword] = useState("");
  const supabase = createClient();

  function update(field: keyof FormData, value: unknown) { setForm(prev => ({ ...prev, [field]: value })); }
  function toggleArray(field: keyof FormData, val: string) {
    const arr = form[field] as string[];
    update(field, arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
  }
  function addToArray(field: keyof FormData, val: string, setter: (v: string) => void) {
    if (!val.trim()) return;
    const arr = form[field] as string[];
    if (!arr.includes(val.trim())) update(field, [...arr, val.trim()]);
    setter("");
  }
  function removeFromArray(field: keyof FormData, val: string) {
    update(field, (form[field] as string[]).filter(x => x !== val));
  }

  async function handleSave() {
    setSaving(true); setError(null);
    try {
      const { data, error: err } = await supabase.from("clients").insert([{
        name: form.name, name_en: form.nameEn || null, sector: form.sector,
        city: form.city, neighborhood: form.neighborhood || form.targetAreas[0] || "",
        target_areas: form.targetAreas, target_age: form.targetAge, target_gender: form.targetGender,
        interests: form.interests, content_language: form.contentLanguage, platforms: form.platforms,
        goals: form.goals, seo_keywords: form.seoKeywords, seo_level: form.seoLevel,
        website_url: form.website || null, instagram_url: form.instagram || null,
        competitors: form.competitors, description: form.activityDescription || null,
        budget_monthly: form.budgetMonthly, status: "pending",
      }]).select().single();
      if (err) throw err;
      router.push(`/clients/${data.id}/strategy`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ في الحفظ");
    } finally { setSaving(false); }
  }

  const selectedSector = SECTORS.find(s => s.value === form.sector);
  const canNext = () => {
    if (step === 1) return form.name && form.sector && form.activityDescription;
    if (step === 2) return form.targetScope === "full_ksa" || form.city;
    if (step === 3) return form.platforms.length > 0 && form.goals.length > 0;
    return true;
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <TopNav alertCount={3} user={{ name: "عمر", email: "omar@markiq.sa", role: "admin" }} />
      <Breadcrumb items={[{ label: "لوحة التحكم", href: "/dashboard" }, { label: "العملاء", href: "/clients" }, { label: "إضافة عميل جديد" }]} />

      <div className="bg-white border-b border-gray-200 px-5 py-3">
        <div className="flex items-center gap-2 max-w-3xl mx-auto overflow-x-auto">
          {STEPS.map((s, i) => (
            <div key={s.num} className="flex items-center gap-2 flex-shrink-0">
              <div className={`flex items-center gap-1.5 ${i < step - 1 ? "text-green-600" : i === step - 1 ? "text-primary-500" : "text-gray-400"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${i < step - 1 ? "bg-green-500 text-white" : i === step - 1 ? "bg-primary-500 text-white" : "bg-gray-100 text-gray-400 border border-gray-200"}`}>
                  {i < step - 1 ? "✓" : s.num}
                </div>
                <span className={`text-[11px] whitespace-nowrap font-medium ${i === step - 1 ? "text-primary-500" : "text-gray-400"}`}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && <div className="w-6 h-px bg-gray-200 flex-shrink-0" />}
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 max-w-3xl mx-auto">

        {step === 1 && (
          <Card>
            <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2"><Building2 size={15} className="text-primary-500" /> بيانات النشاط التجاري</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">اسم النشاط بالعربي <span className="text-red-500">*</span></label>
                  <input type="text" value={form.name} onChange={e => update("name", e.target.value)} placeholder="مثال: معك رونة"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-gray-50" />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">اسم النشاط بالإنجليزي</label>
                  <input type="text" value={form.nameEn} onChange={e => update("nameEn", e.target.value)} placeholder="Ma3ak Rona" dir="ltr"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-gray-50" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-gray-500 mb-2">القطاع <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-4 gap-2">
                  {SECTORS.map(s => (
                    <button key={s.value} onClick={() => update("sector", s.value)}
                      className={`py-2.5 px-2 rounded-lg text-[10px] border text-center transition-colors ${form.sector === s.value ? "bg-primary-light border-blue-300 text-primary-500 font-medium" : "border-gray-200 text-gray-600 hover:border-primary-300"}`}>
                      <div className="text-lg mb-0.5">{s.icon}</div>{s.label}
                    </button>
                  ))}
                </div>
              </div>
              {form.sector && (
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">
                    وصف النشاط بالتفصيل <span className="text-red-500">*</span>
                    <span className="text-primary-500 mr-1 text-[10px]">— يستخدمه الذكاء الاصطناعي لتخصيص الاستراتيجية والصور</span>
                  </label>
                  <textarea value={form.activityDescription} onChange={e => update("activityDescription", e.target.value)}
                    placeholder={
                      form.sector === "restaurants" ? "مثال: مطعم متخصص في الباستا الإيطالية، يقدم توصيل عبر هنقرستيشن، يستهدف العائلات والشباب..." :
                      form.sector === "automotive" ? "مثال: ورشة متخصصة في صيانة تويوتا ولكزس، نقدم استدعاء وتغيير زيت وفحص شامل..." :
                      form.sector === "construction" ? "مثال: شركة مقاولات متخصصة في البناء والتشطيبات والديكور الداخلي..." :
                      form.sector === "manufacturing" ? "مثال: مصنع ألمنيوم متخصص في النوافذ والأبواب والواجهات الزجاجية..." :
                      form.sector === "retail" ? "مثال: متجر ألعاب أطفال يبيع ألعاب تعليمية وترفيهية، يستهدف الأمهات والعائلات..." :
                      "اكتب وصفاً تفصيلياً: ما تبيعه أو تقدمه، جمهورك المستهدف، ما يميزك عن المنافسين..."
                    }
                    rows={4} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-gray-50 resize-none" />
                </div>
              )}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">الموقع الإلكتروني</label>
                  <input type="url" value={form.website} onChange={e => update("website", e.target.value)} placeholder="https://..." dir="ltr"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-gray-50" />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">انستقرام</label>
                  <input type="text" value={form.instagram} onChange={e => update("instagram", e.target.value)} placeholder="@username" dir="ltr"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-gray-50" />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">الميزانية الشهرية (ر.س) <span className="text-red-500">*</span></label>
                  <input type="number" value={form.budgetMonthly} onChange={e => update("budgetMonthly", Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-gray-50" />
                </div>
              </div>
            </div>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2"><MapPin size={15} className="text-primary-500" /> الموقع والاستهداف الجغرافي</h2>
            <div className="space-y-4">

              {/* نطاق الاستهداف أولاً */}
              <div>
                <label className="block text-[11px] text-gray-500 mb-2">نطاق الاستهداف <span className="text-red-500">*</span></label>
                <div className="flex gap-2">
                  {[
                    { val: "districts", lbl: "أحياء محددة", icon: "📍" },
                    { val: "full_city", lbl: "مدينة كاملة", icon: "🏙️" },
                    { val: "full_ksa", lbl: "المملكة كاملة", icon: "🇸🇦" },
                  ].map(opt => (
                    <button key={opt.val}
                      onClick={() => {
                        update("targetScope", opt.val);
                        if (opt.val === "full_ksa") {
                          update("targetAreas", ["المملكة العربية السعودية — كاملة"]);
                          update("city", "المملكة العربية السعودية");
                          update("neighborhood", "");
                        } else {
                          update("targetAreas", []);
                        }
                      }}
                      className={`flex-1 py-3 px-2 rounded-xl text-[11px] border text-center transition-colors ${
                        form.targetScope === opt.val ? "bg-primary-light border-blue-300 text-primary-500 font-medium shadow-sm" : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}>
                      <div className="text-xl mb-1">{opt.icon}</div>
                      {opt.lbl}
                    </button>
                  ))}
                </div>
              </div>

              {/* المملكة كاملة */}
              {form.targetScope === "full_ksa" && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-xs text-green-700">
                  🇸🇦 سيتم استهداف جميع مناطق <strong>المملكة العربية السعودية</strong>
                </div>
              )}

              {/* البحث عن المدينة — فقط إذا اختار أحياء أو مدينة كاملة */}
              {(form.targetScope === "districts" || form.targetScope === "full_city") && (
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">المدينة <span className="text-red-500">*</span></label>
                  <CitySearch value={form.city} onChange={city => { update("city", city); update("targetAreas", []); update("neighborhood", ""); }} />
                </div>
              )}

              {/* الأحياء — فقط إذا اختار أحياء محددة وحدد المدينة */}
              {form.targetScope === "districts" && form.city && form.city !== "المملكة العربية السعودية" && (
                <DistrictSelector city={form.city} selected={form.targetAreas}
                  onChange={areas => { update("targetAreas", areas); if (areas.length > 0 && !form.neighborhood) update("neighborhood", areas[0]); }} />
              )}

              {/* مدينة كاملة */}
              {form.targetScope === "full_city" && form.city && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-700">
                  🏙️ سيتم استهداف جميع أحياء <strong>{form.city}</strong>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">الفئة العمرية</label>
                  <select value={form.targetAge} onChange={e => update("targetAge", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-gray-50">
                    {["18-24", "25-34", "35-44", "45-54", "55+", "الجميع"].map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">الجنس المستهدف</label>
                  <div className="flex gap-2">
                    {[{ val: "all", lbl: "الجميع" }, { val: "male", lbl: "رجال" }, { val: "female", lbl: "نساء" }].map(g => (
                      <button key={g.val} onClick={() => update("targetGender", g.val)}
                        className={`flex-1 py-2 rounded-lg text-[11px] border transition-colors ${form.targetGender === g.val ? "bg-primary-light border-blue-300 text-primary-500 font-medium" : "border-gray-200 text-gray-600"}`}>
                        {g.lbl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-gray-500 mb-1">الاهتمامات والسلوك الشرائي</label>
                <div className="text-[10px] text-gray-400 mb-2">أمثلة: الأكل خارج المنزل، التسوق أونلاين، السيارات الفارهة، العناية بالبشرة، الرياضة...</div>
                <div className="flex gap-2 mb-2">
                  <input type="text" value={newInterest} onChange={e => setNewInterest(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addToArray("interests", newInterest, setNewInterest)}
                    placeholder="مثال: الأكل خارج المنزل — ثم اضغط Enter"
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-gray-50" />
                  <Button size="sm" onClick={() => addToArray("interests", newInterest, setNewInterest)} icon={<Plus size={11} />}>إضافة</Button>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {["الأكل خارج المنزل", "التسوق أونلاين", "السيارات", "العناية بالمظهر", "الرياضة", "السفر", "الألعاب", "التقنية"].map(s => (
                    !form.interests.includes(s) && (
                      <button key={s} onClick={() => update("interests", [...form.interests, s])}
                        className="px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-[10px] hover:bg-primary-light hover:text-primary-500 transition-colors">
                        + {s}
                      </button>
                    )
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {form.interests.map(int => (
                    <span key={int} className="flex items-center gap-1 px-2 py-1 bg-primary-light border border-blue-200 text-primary-500 rounded-full text-[10px]">
                      {int} <button onClick={() => removeFromArray("interests", int)}><X size={9} /></button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2"><Target size={15} className="text-primary-500" /> المنصات والأهداف التسويقية</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-[11px] text-gray-500 mb-2">المنصات الإعلانية <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-4 gap-2">
                  {PLATFORMS.map(p => (
                    <button key={p.id} onClick={() => toggleArray("platforms", p.id)}
                      className={`py-3 px-2 rounded-lg text-[11px] border text-center transition-all flex flex-col items-center gap-1.5 ${form.platforms.includes(p.id) ? "border-blue-300 bg-primary-light text-primary-500 font-medium shadow-sm" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                      <PlatformSVG id={p.id} active={form.platforms.includes(p.id)} />
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-gray-500 mb-2">الأهداف التسويقية <span className="text-red-500">*</span> <span className="text-gray-400 text-[10px]">— يمكن اختيار أكثر من هدف</span></label>
                <div className="space-y-2">
                  {GOALS.map(g => (
                    <button key={g} onClick={() => toggleArray("goals", g)}
                      className={`w-full text-right px-3 py-2 rounded-lg text-xs border transition-colors flex items-center gap-2 ${form.goals.includes(g) ? "bg-green-50 border-green-300 text-green-700" : "border-gray-200 text-gray-600 hover:border-green-200"}`}>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${form.goals.includes(g) ? "bg-green-500 border-green-500" : "border-gray-300"}`}>
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
                  <input type="text" value={newCompetitor} onChange={e => setNewCompetitor(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addToArray("competitors", newCompetitor, setNewCompetitor)}
                    placeholder="اسم منافس أو رابط انستقرامه..."
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-gray-50" />
                  <Button size="sm" onClick={() => addToArray("competitors", newCompetitor, setNewCompetitor)} icon={<Plus size={11} />}>إضافة</Button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {form.competitors.map(c => (
                    <span key={c} className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px]">
                      {c} <button onClick={() => removeFromArray("competitors", c)}><X size={9} /></button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {step === 4 && (
          <Card>
            <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2"><Search size={15} className="text-primary-500" /> SEO والمحتوى</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] text-gray-500 mb-1">مستوى SEO الحالي</label>
                <div className="flex gap-2">
                  {[{ val: "none", lbl: "لا يوجد" }, { val: "weak", lbl: "ضعيف" }, { val: "good", lbl: "جيد" }, { val: "excellent", lbl: "ممتاز" }].map(s => (
                    <button key={s.val} onClick={() => update("seoLevel", s.val)}
                      className={`flex-1 py-2 rounded-lg text-[11px] border transition-colors ${form.seoLevel === s.val ? "bg-primary-light border-blue-300 text-primary-500 font-medium" : "border-gray-200 text-gray-600"}`}>
                      {s.lbl}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-gray-500 mb-1">الكلمات المفتاحية لـ SEO</label>
                <div className="flex gap-2 mb-2">
                  <input type="text" value={newKeyword} onChange={e => setNewKeyword(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addToArray("seoKeywords", newKeyword, setNewKeyword)}
                    placeholder="مثال: ورشة سيارات الرياض، مطعم باستا توصيل..."
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-gray-50" />
                  <Button size="sm" onClick={() => addToArray("seoKeywords", newKeyword, setNewKeyword)} icon={<Plus size={11} />}>إضافة</Button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {form.seoKeywords.map(kw => (
                    <span key={kw} className="flex items-center gap-1 px-2 py-1 bg-primary-light border border-blue-200 text-primary-500 rounded-full text-[10px]">
                      {kw} <button onClick={() => removeFromArray("seoKeywords", kw)}><X size={9} /></button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-gray-500 mb-2">لغة المحتوى</label>
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGES.map(l => (
                    <button key={l.id} onClick={() => update("contentLanguage", l.id)}
                      className={`py-2 px-3 rounded-lg text-[11px] border text-right transition-colors ${form.contentLanguage === l.id ? "bg-primary-light border-blue-300 text-primary-500 font-medium" : "border-gray-200 text-gray-600"}`}>
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-gray-500 mb-1">ملاحظات إضافية للذكاء الاصطناعي</label>
                <textarea value={form.notes} onChange={e => update("notes", e.target.value)}
                  placeholder="أي معلومات إضافية تساعد الذكاء الاصطناعي في بناء الاستراتيجية..." rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-gray-50 resize-none" />
              </div>
            </div>
          </Card>
        )}

        {step === 5 && (
          <Card>
            <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2"><CheckCircle size={15} className="text-primary-500" /> مراجعة البيانات قبل الحفظ</h2>
            <div className="space-y-3">
              {[
                { title: "بيانات النشاط", rows: [["الاسم", form.name || "—"], ["القطاع", `${selectedSector?.icon} ${selectedSector?.label}` || "—"], ["وصف النشاط", form.activityDescription || "—"], ["الميزانية", `${form.budgetMonthly.toLocaleString()} ر.س`]] },
                { title: "الاستهداف", rows: [["المدينة", form.city || "—"], ["النطاق", form.targetScope === "full_ksa" ? "المملكة كاملة" : form.targetScope === "full_city" ? `${form.city} كاملة` : `${form.targetAreas.length} حي`], ["الفئة العمرية", form.targetAge], ["الجنس", form.targetGender === "all" ? "الجميع" : form.targetGender === "male" ? "رجال" : "نساء"]] },
                { title: "المنصات والأهداف", rows: [["المنصات", form.platforms.map(p => PLATFORMS.find(pl => pl.id === p)?.label || p).join("، ") || "—"], ["الأهداف", form.goals.join("، ") || "—"]] },
              ].map((section, si) => (
                <div key={si} className="bg-gray-50 rounded-xl p-3">
                  <div className="text-[11px] font-semibold text-gray-600 mb-2">{section.title}</div>
                  {section.rows.map(([lbl, val], ri) => (
                    <div key={ri} className="flex justify-between items-start py-1 border-b border-gray-100 last:border-0 text-xs">
                      <span className="text-gray-400 flex-shrink-0">{lbl}</span>
                      <span className="text-gray-700 max-w-[65%] text-right">{val}</span>
                    </div>
                  ))}
                </div>
              ))}
              {error && <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-600">{error}</div>}
              <div className="bg-primary-light border border-blue-200 rounded-xl p-3 text-xs text-blue-700">
                <strong>بعد الحفظ:</strong> سيقوم Claude AI تلقائياً بتوليد استراتيجية تسويقية مخصصة بناءً على بيانات نشاطك.
              </div>
            </div>
          </Card>
        )}

        <div className="flex items-center justify-between mt-4">
          <Button variant="outline" icon={<ChevronRight size={12} />} onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1}>السابق</Button>
          <span className="text-xs text-gray-400">الخطوة <span className="text-primary-500 font-medium">{step}</span> من {STEPS.length}</span>
          {step < STEPS.length ? (
            <Button icon={<ChevronLeft size={12} />} onClick={() => setStep(s => Math.min(STEPS.length, s + 1))} disabled={!canNext()}>التالي</Button>
          ) : (
            <Button onClick={handleSave} disabled={saving} icon={saving ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}>
              {saving ? "جارٍ الحفظ..." : "حفظ وتوليد الاستراتيجية"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
