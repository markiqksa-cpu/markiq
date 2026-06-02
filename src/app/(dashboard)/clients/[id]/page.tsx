"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin, Smartphone, Calendar, Plus, FileText, Edit,
  Users, Target, Clock, Map, Brain, TrendingUp,
  AlertTriangle, CheckCircle, BarChart2, CreditCard,
  FileCheck, Receipt, ChevronRight, Loader2
} from "lucide-react";
import TopNav from "@/components/layout/TopNav";
import Breadcrumb from "@/components/layout/Breadcrumb";
import {
  Button, Card, CardHeader, Badge, StatusBadge,
  KpiCard, ProgressBar, PlatformIcon, AlertDot
} from "@/components/ui";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";

// ===== TYPES =====
interface ClientProfileProps {
  params: { id: string };
}

// ===== PLATFORM LABEL MAP =====
const PLATFORM_LABELS: Record<string, string> = {
  instagram: "انستقرام",
  snapchat: "سناب شات",
  google: "قوقل",
  tiktok: "تيك توك",
  twitter: "تويتر",
  facebook: "فيسبوك",
  youtube: "يوتيوب",
  maps: "قوقل ماب",
};

const SECTOR_LABELS: Record<string, string> = {
  restaurants: "مطاعم وكافيهات",
  salons: "صالونات ومراكز تجميل",
  clinics: "عيادات وصحة",
  retail: "متاجر وبيع بالتجزئة",
  ecommerce: "تجارة إلكترونية",
  education: "تعليم وتدريب",
  real_estate: "عقارات",
  other: "أخرى",
};

const LANGUAGE_LABELS: Record<string, string> = {
  arabic_saudi: "عربي — لهجة سعودية",
  arabic_gulf: "عربي — لهجة خليجي",
  arabic_egyptian: "عربي — لهجة مصرية",
  arabic_formal: "عربي — فصيح",
  english: "إنجليزي",
  bilingual: "ثنائي (عربي + إنجليزي)",
};

// ===== TABS =====
const TABS = [
  "نظرة عامة", "الاستراتيجية", "الحملات",
  "الأداء", "الميزانية", "المحتوى", "العقد والفواتير"
];

// ===== MAIN COMPONENT =====
export default function ClientProfilePage({ params }: ClientProfileProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [client, setClient] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createSupabaseClient();

  useEffect(() => {
    async function fetchClient() {
      setLoading(true);
      try {
        const { data, error: err } = await supabase
          .from("clients")
          .select(`
            *,
            campaigns(id, name, status, budget_total, spend, platforms)
          `)
          .eq("id", params.id)
          .single();

        if (err) throw err;
        setClient(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "حدث خطأ");
      } finally {
        setLoading(false);
      }
    }
    fetchClient();
  }, [params.id]);

  // ===== Loading =====
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

  // ===== Error =====
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

  // ===== Data =====
  const name = (client.name as string) || "";
  const sector = SECTOR_LABELS[(client.sector as string)] || (client.sector as string) || "";
  const city = (client.city as string) || "";
  const neighborhood = (client.neighborhood as string) || "";
  const platforms = (client.platforms as string[]) || [];
  const status = (client.status as string) || "pending";
  const budgetMonthly = (client.budget_monthly as number) || 0;
  const goals = (client.goals as string[]) || [];
  const targetAreas = (client.target_areas as string[]) || [];
  const targetAge = (client.target_age as string) || "—";
  const targetGender = (client.target_gender as string) || "all";
  const contentLanguage = LANGUAGE_LABELS[(client.content_language as string)] || (client.content_language as string) || "—";
  const campaigns = (client.campaigns as Record<string, unknown>[]) || [];
  const activeCampaigns = campaigns.filter(c => c.status === "active").length;
  const totalSpend = campaigns.reduce((s, c) => s + ((c.spend as number) || 0), 0);
  const createdAt = client.created_at ? new Date(client.created_at as string).toLocaleDateString("ar-SA", { month: "long", year: "numeric" }) : "—";

  const genderLabel = targetGender === "all" ? "الجميع" : targetGender === "male" ? "رجال" : "نساء";

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <TopNav
        currentClient={{ id: params.id, name }}
        alertCount={3}
        user={{ name: "عمر", email: "omar@markiq.sa", role: "admin" }}
      />

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
              <StatusBadge status={status} />
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
                { val: budgetMonthly > 0 ? `${budgetMonthly.toLocaleString()}` : "—", lbl: "ميزانية (ر.س)" },
                { val: campaigns.length, lbl: "إجمالي الحملات" },
                { val: totalSpend > 0 ? `${totalSpend.toLocaleString()}` : "—", lbl: "إجمالي الإنفاق" },
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
            <Button variant="outline" icon={<Edit size={11} />}>تعديل البيانات</Button>
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
                activeTab === i
                  ? "border-primary-500 text-primary-500 font-semibold"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4 max-w-[1400px] mx-auto space-y-4">

        {/* ===== TAB 0: نظرة عامة ===== */}
        {activeTab === 0 && (
          <>
            <div className="grid grid-cols-3 gap-3">
              <KpiCard value={budgetMonthly > 0 ? `${(budgetMonthly / 1000).toFixed(1)}K` : "—"} label="الميزانية الشهرية (ر.س)" icon={<BarChart2 size={13} />} iconColor="text-primary-500" iconBg="bg-primary-light" />
              <KpiCard value={activeCampaigns} label="حملة نشطة" icon={<TrendingUp size={13} />} iconColor="text-green-600" iconBg="bg-green-50" />
              <KpiCard value={totalSpend > 0 ? `${totalSpend.toLocaleString()}` : "—"} label="إجمالي الإنفاق (ر.س)" icon={<Target size={13} />} iconColor="text-yellow-700" iconBg="bg-yellow-50" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader title="بيانات العميل" icon={<FileCheck size={14} />} action="تعديل" />
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

                {(!!client.website_url || !!client.instagram_url) && (
                  <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5">
                    {client.website_url && (
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">الموقع</span>
                        <a href={client.website_url as string} target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline truncate max-w-[180px]">{client.website_url as string}</a>
                      </div>
                    )}
                    {client.instagram_url && (
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">انستقرام</span>
                        <span className="text-gray-700">{client.instagram_url as string}</span>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </div>

            {/* Campaigns quick view */}
            {campaigns.length > 0 && (
              <Card>
                <CardHeader title="الحملات" icon={<Target size={14} />} action="عرض الكل" />
                {campaigns.slice(0, 4).map((camp, i) => {
                  const campPlatforms = (camp.platforms as string[]) || [];
                  const budget = (camp.budget_total as number) || 0;
                  const spend = (camp.spend as number) || 0;
                  const pct = budget > 0 ? Math.round((spend / budget) * 100) : 0;
                  return (
                    <div key={i} className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0">
                      {campPlatforms[0] && <PlatformIcon platform={campPlatforms[0]} size="sm" />}
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-gray-800 mb-1">{camp.name as string}</div>
                        <ProgressBar value={pct} max={100} height="h-[3px]" />
                      </div>
                      <span className="text-[10px] text-gray-500">{pct}%</span>
                      <StatusBadge status={camp.status as string} />
                    </div>
                  );
                })}
              </Card>
            )}
          </>
        )}

        {/* ===== TAB 1: الاستراتيجية ===== */}
        {activeTab === 1 && (
          <div className="text-center py-16">
            <Brain size={32} className="mx-auto mb-3 text-gray-300" />
            <div className="text-sm text-gray-500 mb-2">لم يتم توليد الاستراتيجية بعد</div>
            <div className="text-xs text-gray-400 mb-4">اضغط لتوليد استراتيجية تسويقية كاملة بالذكاء الاصطناعي</div>
            <Link href={`/clients/${params.id}/strategy`}>
              <Button icon={<Brain size={12} />}>توليد الاستراتيجية</Button>
            </Link>
          </div>
        )}

        {/* ===== TAB 2: الحملات ===== */}
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
                const budget = (camp.budget_total as number) || 0;
                const spend = (camp.spend as number) || 0;
                const pct = budget > 0 ? Math.round((spend / budget) * 100) : 0;
                return (
                  <Link key={i} href={`/campaigns/${camp.id}`}
                    className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 -mx-1 px-1 rounded-lg transition-colors">
                    {campPlatforms[0] && <PlatformIcon platform={campPlatforms[0]} />}
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-800 mb-1">{camp.name as string}</div>
                      <div className="text-[10px] text-gray-500 mb-1">{budget.toLocaleString()} ر.س</div>
                      <ProgressBar value={pct} max={100} height="h-[3px]" />
                    </div>
                    <span className="text-[10px] text-gray-500 flex-shrink-0">{pct}%</span>
                    <StatusBadge status={camp.status as string} />
                    <ChevronRight size={13} className="text-gray-300 rotate-180" />
                  </Link>
                );
              })
            )}
          </Card>
        )}

        {/* ===== TABs 3-6: قريباً ===== */}
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
