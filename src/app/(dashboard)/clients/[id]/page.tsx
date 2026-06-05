"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin, Smartphone, Calendar, Plus, FileText, Edit,
  Target, Brain, TrendingUp, BarChart2, FileCheck,
  ChevronRight, Loader2, Check, X, ChevronDown
} from "lucide-react";
import TopNav from "@/components/layout/TopNav";
import Breadcrumb from "@/components/layout/Breadcrumb";
import {
  Button, Card, CardHeader, Badge, StatusBadge,
  KpiCard, ProgressBar, PlatformIcon
} from "@/components/ui";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";

interface ClientProfileProps {
  params: { id: string };
}

const PLATFORM_LABELS: Record<string, string> = {
  instagram: "انستقرام", snapchat: "سناب شات", google: "قوقل",
  tiktok: "تيك توك", twitter: "تويتر", facebook: "فيسبوك",
  youtube: "يوتيوب", maps: "قوقل ماب",
};

const SECTOR_LABELS: Record<string, string> = {
  restaurants: "مطاعم وكافيهات", salons: "صالونات ومراكز تجميل",
  clinics: "عيادات وصحة", retail: "متاجر وبيع بالتجزئة",
  ecommerce: "تجارة إلكترونية", education: "تعليم وتدريب",
  real_estate: "عقارات", other: "أخرى",
};

const LANGUAGE_LABELS: Record<string, string> = {
  arabic_saudi: "عربي — لهجة سعودية", arabic_gulf: "عربي — لهجة خليجي",
  arabic_egyptian: "عربي — لهجة مصرية", arabic_formal: "عربي — فصيح",
  english: "إنجليزي", bilingual: "ثنائي (عربي + إنجليزي)",
};

const TABS = ["نظرة عامة", "الاستراتيجية", "الحملات", "الأداء", "الميزانية", "المحتوى", "العقد والفواتير"];

const STATUS_OPTIONS = [
  { value: "active", label: "نشط", color: "text-green-600 bg-green-50 border-green-200" },
  { value: "pending", label: "قيد المراجعة", color: "text-yellow-700 bg-yellow-50 border-yellow-200" },
  { value: "inactive", label: "غير نشط", color: "text-gray-500 bg-gray-100 border-gray-200" },
];

// ===== EDIT MODAL =====
function EditModal({
  client,
  onSave,
  onClose,
}: {
  client: Record<string, unknown>;
  onSave: (data: Record<string, unknown>) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    name: String(client.name || ""),
    city: String(client.city || ""),
    neighborhood: String(client.neighborhood || ""),
    budget_monthly: Number(client.budget_monthly || 0),
    website_url: String(client.website_url || ""),
    instagram_url: String(client.instagram_url || ""),
    description: String(client.description || ""),
  });
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    await onSave(form);
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="text-sm font-semibold text-gray-800">تعديل بيانات العميل</div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
        </div>
        <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-[11px] text-gray-500 mb-1">اسم النشاط</label>
            <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">المدينة</label>
              <input type="text" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary-500" />
            </div>
            <div>
              <label className="block text-[11px] text-gray-500 mb-1">الحي</label>
              <input type="text" value={form.neighborhood} onChange={e => setForm(f => ({ ...f, neighborhood: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary-500" />
            </div>
          </div>
          <div>
            <label className="block text-[11px] text-gray-500 mb-1">الميزانية الشهرية (ر.س)</label>
            <input type="number" value={form.budget_monthly} onChange={e => setForm(f => ({ ...f, budget_monthly: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary-500" />
          </div>
          <div>
            <label className="block text-[11px] text-gray-500 mb-1">الموقع الإلكتروني</label>
            <input type="url" value={form.website_url} onChange={e => setForm(f => ({ ...f, website_url: e.target.value }))}
              dir="ltr" placeholder="https://"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary-500" />
          </div>
          <div>
            <label className="block text-[11px] text-gray-500 mb-1">انستقرام</label>
            <input type="text" value={form.instagram_url} onChange={e => setForm(f => ({ ...f, instagram_url: e.target.value }))}
              dir="ltr" placeholder="@username"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary-500" />
          </div>
          <div>
            <label className="block text-[11px] text-gray-500 mb-1">ملاحظات</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary-500 resize-none" />
          </div>
        </div>
        <div className="flex gap-2 p-4 border-t border-gray-100">
          <button onClick={onClose} className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-xs text-gray-600 hover:bg-gray-50">إلغاء</button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-xl text-xs font-medium hover:bg-primary-600 disabled:opacity-50 flex items-center justify-center gap-1.5">
            {saving ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
            {saving ? "جاري الحفظ..." : "حفظ التعديلات"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== STATUS DROPDOWN =====
function StatusDropdown({ status, onChange }: { status: string; onChange: (s: string) => void }) {
  const [open, setOpen] = useState(false);
  const current = STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[1];

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium border cursor-pointer ${current.color}`}>
        {current.label}
        <ChevronDown size={10} />
      </button>
      {open && (
        <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden min-w-[130px]">
          {STATUS_OPTIONS.map(opt => (
            <button key={opt.value} onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-right px-3 py-2 text-[11px] hover:bg-gray-50 flex items-center gap-2 ${status === opt.value ? "font-semibold" : ""}`}>
              {status === opt.value && <Check size={10} className="text-primary-500" />}
              <span className={`px-2 py-0.5 rounded-full border text-[10px] ${opt.color}`}>{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ===== MAIN COMPONENT =====
export default function ClientProfilePage({ params }: ClientProfileProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [client, setClient] = useState<Record<string, unknown> | null>(null);
  const [strategy, setStrategy] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEdit, setShowEdit] = useState(false);

  const supabase = createSupabaseClient();

  useEffect(() => {
    async function fetchClient() {
      setLoading(true);
      try {
        const [clientRes, strategyRes] = await Promise.all([
          supabase.from("clients").select(`*, campaigns(id, name, status, budget_total, spend, platforms)`).eq("id", params.id).single(),
          supabase.from("strategies").select("*").eq("client_id", params.id).single(),
        ]);
        if (clientRes.error) throw clientRes.error;
        setClient(clientRes.data);
        if (!strategyRes.error) setStrategy(strategyRes.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "حدث خطأ");
      } finally {
        setLoading(false);
      }
    }
    fetchClient();
  }, [params.id]);

  // ===== تغيير الحالة =====
  async function handleStatusChange(newStatus: string) {
    if (!client) return;
    const { error: err } = await supabase
      .from("clients")
      .update({ status: newStatus })
      .eq("id", params.id);
    if (!err) setClient(prev => prev ? { ...prev, status: newStatus } : prev);
  }

  // ===== حفظ التعديلات =====
  async function handleSaveEdit(data: Record<string, unknown>) {
    const { error: err } = await supabase
      .from("clients")
      .update(data)
      .eq("id", params.id);
    if (!err) {
      setClient(prev => prev ? { ...prev, ...data } : prev);
      setShowEdit(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <Loader2 size={28} className="animate-spin text-primary-500 mx-auto mb-3" />
          <div className="text-xs text-gray-400">جاري تحميل بيانات العميل...</div>
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="text-red-500 text-sm mb-2">لم يتم العثور على العميل</div>
          <Link href="/clients" className="text-primary-500 text-xs underline">العودة للعملاء</Link>
        </div>
      </div>
    );
  }

  const name = String(client.name || "");
  const sector = SECTOR_LABELS[String(client.sector || "")] || String(client.sector || "");
  const city = String(client.city || "");
  const neighborhood = String(client.neighborhood || "");
  const platforms = (client.platforms as string[]) || [];
  const status = String(client.status || "pending");
  const budgetMonthly = Number(client.budget_monthly || 0);
  const goals = (client.goals as string[]) || [];
  const targetAreas = (client.target_areas as string[]) || [];
  const targetAge = String(client.target_age || "—");
  const targetGender = String(client.target_gender || "all");
  const contentLanguage = LANGUAGE_LABELS[String(client.content_language || "")] || String(client.content_language || "—");
  const websiteUrl = String(client.website_url || "");
  const instagramUrl = String(client.instagram_url || "");
  const campaigns = (client.campaigns as Record<string, unknown>[]) || [];
  const activeCampaigns = campaigns.filter(c => c.status === "active").length;
  const totalSpend = campaigns.reduce((s, c) => s + Number(c.spend || 0), 0);
  const createdAt = client.created_at
    ? new Date(String(client.created_at)).toLocaleDateString("ar-SA", { month: "long", year: "numeric" })
    : "—";
  const genderLabel = targetGender === "all" ? "الجميع" : targetGender === "male" ? "رجال" : "نساء";

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {showEdit && (
        <EditModal client={client} onSave={handleSaveEdit} onClose={() => setShowEdit(false)} />
      )}

      <TopNav currentClient={{ id: params.id, name }} alertCount={3} user={{ name: "عمر", email: "omar@markiq.sa", role: "admin" }} />
      <Breadcrumb items={[
        { label: "لوحة التحكم", href: "/dashboard" },
        { label: "العملاء", href: "/clients" },
        { label: name },
      ]} />

      {/* Client Header */}
      <div className="bg-white border-b border-gray-200 px-5 py-4">
        <div className="flex items-start gap-4 max-w-[1400px] mx-auto">
          <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center text-lg font-bold text-primary-500 flex-shrink-0">
            {name.slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h1 className="text-base font-semibold text-gray-900">{name}</h1>
              <StatusDropdown status={status} onChange={handleStatusChange} />
              <Badge variant="blue">{sector}</Badge>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
              <span className="flex items-center gap-1"><MapPin size={11} /> {city} — {neighborhood}</span>
              <span className="flex items-center gap-1">
                <Smartphone size={11} />
                {platforms.map(p => PLATFORM_LABELS[p] || p).join("، ") || "—"}
              </span>
              <span className="flex items-center gap-1"><Calendar size={11} /> عميل منذ {createdAt}</span>
            </div>
            <div className="grid grid-cols-4 gap-2 mt-3">
              {[
                { val: activeCampaigns, lbl: "حملات نشطة" },
                { val: budgetMonthly > 0 ? budgetMonthly.toLocaleString() : "—", lbl: "ميزانية (ر.س)" },
                { val: campaigns.length, lbl: "إجمالي الحملات" },
                { val: totalSpend > 0 ? totalSpend.toLocaleString() : "—", lbl: "إجمالي الإنفاق" },
              ].map((s, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-2 text-center">
                  <div className="text-base font-semibold text-gray-900">{s.val}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-start gap-2 flex-shrink-0">
            <Button variant="outline" icon={<FileText size={11} />}>تقرير شهري</Button>
            <Button variant="outline" icon={<Edit size={11} />} onClick={() => setShowEdit(true)}>تعديل البيانات</Button>
            <Link href={`/campaigns/new?client=${params.id}`}>
              <Button icon={<Plus size={11} />}>حملة جديدة</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-5 sticky top-[54px] z-40">
        <div className="flex gap-0 max-w-[1400px] mx-auto">
          {TABS.map((tab, i) => (
            <button key={i} onClick={() => setActiveTab(i)}
              className={`px-4 py-2.5 text-xs border-b-2 transition-colors whitespace-nowrap ${
                activeTab === i ? "border-primary-500 text-primary-500 font-semibold" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4 max-w-[1400px] mx-auto space-y-4">

        {/* TAB 0: نظرة عامة */}
        {activeTab === 0 && (
          <>
            <div className="grid grid-cols-3 gap-3">
              <KpiCard value={budgetMonthly > 0 ? `${(budgetMonthly / 1000).toFixed(1)}K` : "—"} label="الميزانية الشهرية (ر.س)" icon={<BarChart2 size={13} />} iconColor="text-primary-500" iconBg="bg-primary-light" />
              <KpiCard value={activeCampaigns} label="حملة نشطة" icon={<TrendingUp size={13} />} iconColor="text-green-600" iconBg="bg-green-50" />
              <KpiCard value={totalSpend > 0 ? totalSpend.toLocaleString() : "—"} label="إجمالي الإنفاق (ر.س)" icon={<Target size={13} />} iconColor="text-yellow-700" iconBg="bg-yellow-50" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <div className="flex items-center justify-between mb-3">
  <CardHeader title="بيانات العميل" icon={<FileCheck size={14} />} />
  <button onClick={() => setShowEdit(true)} className="text-[11px] text-primary-500 hover:underline">تعديل</button>
</div>
                {[
                  ["القطاع", sector],
                  ["موقع النشاط", `${city} — ${neighborhood}`],
                  ["الأحياء المستهدفة", targetAreas.join("، ") || "—"],
                  ["الفئة المستهدفة", `${targetAge} — ${genderLabel}`],
                  ["لغة المحتوى", contentLanguage],
                  ["الأهداف", goals.join("، ") || "—"],
                ].map(([lbl, val], i) => (
                  <div key={i} className="flex justify-between items-start py-1.5 border-b border-gray-100 last:border-0 text-xs gap-3">
                    <span className="text-gray-500 flex-shrink-0">{lbl}</span>
                    <span className="text-gray-800 font-medium text-right">{val}</span>
                  </div>
                ))}
              </Card>
              <Card>
                <CardHeader title="المنصات الإعلانية" icon={<Smartphone size={14} />} />
                {platforms.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {platforms.map((p) => (
                      <div key={p} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg">
                        <PlatformIcon platform={p} size="sm" />
                        <span className="text-xs text-gray-700">{PLATFORM_LABELS[p] || p}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-gray-400 py-3 text-center">لا توجد منصات محددة</div>
                )}
                {(websiteUrl || instagramUrl) && (
                  <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5">
                    {websiteUrl && (
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">الموقع</span>
                        <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline truncate max-w-[180px]">{websiteUrl}</a>
                      </div>
                    )}
                    {instagramUrl && (
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">انستقرام</span>
                        <span className="text-gray-700">{instagramUrl}</span>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </div>
            {campaigns.length > 0 && (
              <Card>
                <CardHeader title="الحملات" icon={<Target size={14} />} action="عرض الكل" onAction={() => setActiveTab(2)} />
                {campaigns.slice(0, 4).map((camp, i) => {
                  const campPlatforms = (camp.platforms as string[]) || [];
                  const budget = Number(camp.budget_total || 0);
                  const spend = Number(camp.spend || 0);
                  const pct = budget > 0 ? Math.round((spend / budget) * 100) : 0;
                  return (
                    <div key={i} className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0">
                      {campPlatforms[0] && <PlatformIcon platform={campPlatforms[0]} size="sm" />}
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-gray-800 mb-1">{String(camp.name || "")}</div>
                        <ProgressBar value={pct} max={100} height="h-[3px]" />
                      </div>
                      <span className="text-[10px] text-gray-500">{pct}%</span>
                      <StatusBadge status={String(camp.status || "")} />
                    </div>
                  );
                })}
              </Card>
            )}
          </>
        )}

        {/* TAB 1: الاستراتيجية */}
        {activeTab === 1 && (
          strategy ? (
            <>
              <div className="bg-primary-light border border-blue-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-primary-500">
                    <Brain size={15} /> ملخص الاستراتيجية
                  </div>
                  <Link href={`/clients/${params.id}/strategy`}>
                    <button className="text-[11px] text-primary-500 hover:underline">إعادة التوليد</button>
                  </Link>
                </div>
                <p className="text-xs text-blue-700 leading-relaxed">{String(strategy.summary || "")}</p>
              </div>

              {/* KPIs */}
              <Card>
                <CardHeader title="مؤشرات الأداء المستهدفة (KPIs)" icon={<Target size={14} />} />
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { val: `${strategy.kpi_orders_target}%`, label: "زيادة الطلبات", icon: "📦" },
                    { val: `${strategy.kpi_roi_target}x`, label: "عائد الاستثمار", icon: "📈" },
                    { val: `${strategy.kpi_cpo_target} ر.س`, label: "تكلفة الطلب", icon: "💰" },
                    { val: `${((Number(strategy.kpi_impressions_target) || 0) / 1000).toFixed(0)}K`, label: "ظهور شهري", icon: "👁️" },
                  ].map((kpi, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-3 text-center">
                      <div className="text-2xl mb-1">{kpi.icon}</div>
                      <div className="text-xl font-bold text-primary-500">{kpi.val}</div>
                      <div className="text-[10px] text-gray-500 mt-1">{kpi.label}</div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Phases */}
              {Array.isArray(strategy.phases) && (strategy.phases as Record<string, unknown>[]).length > 0 && (
                <Card>
                  <CardHeader title="مراحل تنفيذ الخطة" icon={<TrendingUp size={14} />} />
                  <div className="grid grid-cols-4 gap-3">
                    {(strategy.phases as Record<string, unknown>[]).map((phase, i) => (
                      <div key={i} className="flex flex-col items-center text-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-2 ${i === 0 ? "bg-green-500 text-white" : i === 1 ? "bg-primary-500 text-white" : "bg-gray-100 text-gray-400 border border-gray-200"}`}>
                          {i === 0 ? "✓" : i + 1}
                        </div>
                        <div className="text-xs font-medium text-gray-800 mb-1">{String(phase.title || "")}</div>
                        <div className="text-[10px] text-gray-500 mb-1">{String(phase.description || "")}</div>
                        <span className="text-[9px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{String(phase.duration || "")}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* AI Recommendations */}
              {Array.isArray(strategy.ai_recommendations) && (
                <Card>
                  <CardHeader title="توصيات الذكاء الاصطناعي" icon={<Brain size={14} />} />
                  <div className="space-y-2">
                    {(strategy.ai_recommendations as Record<string, unknown>[]).map((rec, i) => {
                      const priority = String(rec.priority || "planning");
                      const config = priority === "urgent" ? { label: "عاجل", color: "text-red-500", bg: "bg-red-50" } :
                                     priority === "medium" ? { label: "متوسط", color: "text-yellow-700", bg: "bg-yellow-50" } :
                                     { label: "تخطيط", color: "text-green-600", bg: "bg-green-50" };
                      return (
                        <div key={i} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                          <div className="w-7 h-7 bg-primary-light rounded-lg flex items-center justify-center flex-shrink-0">
                            <Brain size={13} className="text-primary-500" />
                          </div>
                          <div className="flex-1">
                            <div className="text-[11.5px] text-gray-700 leading-relaxed">{String(rec.text || "")}</div>
                          </div>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full h-fit flex-shrink-0 ${config.bg} ${config.color} font-medium`}>
                            {config.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <Brain size={32} className="mx-auto mb-3 text-gray-300" />
              <div className="text-sm text-gray-500 mb-2">لم يتم توليد الاستراتيجية بعد</div>
              <div className="text-xs text-gray-400 mb-4">اضغط لتوليد استراتيجية تسويقية كاملة بالذكاء الاصطناعي</div>
              <Link href={`/clients/${params.id}/strategy`}>
                <Button icon={<Brain size={12} />}>توليد الاستراتيجية</Button>
              </Link>
            </div>
          )
        )}

        {/* TAB 2: الحملات */}
        {activeTab === 2 && (
          <Card>
            <div className="flex items-center justify-between mb-3">
              <CardHeader title="جميع الحملات" icon={<Target size={14} />} />
              <Link href={`/campaigns/new?client=${params.id}`}>
                <Button icon={<Plus size={11} />} size="sm">حملة جديدة</Button>
              </Link>
            </div>
            {campaigns.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <Target size={28} className="mx-auto mb-2 opacity-30" />
                <div className="text-xs">لا توجد حملات بعد</div>
              </div>
            ) : (
              campaigns.map((camp, i) => {
                const campPlatforms = (camp.platforms as string[]) || [];
                const budget = Number(camp.budget_total || 0);
                const spend = Number(camp.spend || 0);
                const pct = budget > 0 ? Math.round((spend / budget) * 100) : 0;
                return (
                  <Link key={i} href={`/campaigns/${String(camp.id)}`}
                    className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 -mx-1 px-1 rounded-lg transition-colors">
                    {campPlatforms[0] && <PlatformIcon platform={campPlatforms[0]} />}
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-800 mb-1">{String(camp.name || "")}</div>
                      <div className="text-[10px] text-gray-500 mb-1">{budget.toLocaleString()} ر.س</div>
                      <ProgressBar value={pct} max={100} height="h-[3px]" />
                    </div>
                    <span className="text-[10px] text-gray-500 flex-shrink-0">{pct}%</span>
                    <StatusBadge status={String(camp.status || "")} />
                    <ChevronRight size={13} className="text-gray-300 rotate-180" />
                  </Link>
                );
              })
            )}
          </Card>
        )}

        {/* TABs 3-6 */}
        {(activeTab === 3 || activeTab === 4 || activeTab === 5 || activeTab === 6) && (
          <div className="text-center py-16 text-gray-400">
            <BarChart2 size={32} className="mx-auto mb-3 opacity-30" />
            <div className="text-sm mb-1">
              {activeTab === 3 ? "تقارير الأداء" :
               activeTab === 4 ? "إدارة الميزانية" :
               activeTab === 5 ? "مكتبة المحتوى" : "العقد والفواتير"}
            </div>
            <div className="text-xs">ستكون متاحة بعد ربط الحملات الأولى</div>
          </div>
        )}

      </div>
    </div>
  );
}
