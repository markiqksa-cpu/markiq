"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin, Smartphone, Calendar, Plus, FileText, Edit,
  Users, Target, Clock, Map, Brain, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle, BarChart2, CreditCard,
  FileCheck, Receipt, ChevronRight
} from "lucide-react";
import TopNav from "@/components/layout/TopNav";
import Breadcrumb from "@/components/layout/Breadcrumb";
import PageHeader from "@/components/layout/PageHeader";
import {
  Button, Card, CardHeader, Badge, StatusBadge,
  KpiCard, ProgressBar, PlatformIcon, AlertDot, EmptyState
} from "@/components/ui";

// ===== TYPES =====
interface ClientProfileProps {
  params: { id: string };
}

// ===== MOCK DATA =====
const MOCK_CLIENT = {
  id: "1",
  name: "معك رونة",
  nameEn: "Ma3ak Rona",
  sector: "مطاعم وكافيهات",
  city: "الرياض",
  neighborhood: "حي النزهة",
  platforms: ["هنقرستيشن", "جاهز"],
  status: "active",
  since: "مايو 2026",
  stats: { campaigns: 4, budget: 8000, successRate: 72, roi: 3.2 },
  metrics: { totalSpend: 24500, newOrders: 1840, costPerOrder: 12.4 },
};

const MOCK_CAMPAIGNS = [
  { id: "1", name: "حملة رمضان — ستوري يومي", platform: "instagram", budget: 1200, progress: 72, status: "active" },
  { id: "2", name: "إعلان بحث — باستا الرياض", platform: "google", budget: 2000, progress: 88, status: "active" },
  { id: "3", name: "عروض نهاية الأسبوع", platform: "snapchat", budget: 800, progress: 45, status: "active" },
  { id: "4", name: "فيديو منتج جديد", platform: "tiktok", budget: 600, progress: 0, status: "pending" },
];

const MOCK_ALERTS = [
  { id: "1", color: "red" as const, text: "تجاوز ميزانية قوقل 15%", time: "منذ 20 دقيقة" },
  { id: "2", color: "gold" as const, text: "انخفاض CTR على سناب شات", time: "منذ 3 ساعات" },
  { id: "3", color: "green" as const, text: "انستقرام تجاوزت هدف الطلبات", time: "أمس، 4:30 م" },
  { id: "4", color: "blue" as const, text: "محتوى جديد جاهز للمراجعة", time: "أمس، 10:00 ص" },
];

const MOCK_STRATEGY = {
  summary: "زيادة الطلبات عبر تطبيقات التوصيل بنسبة 40% خلال 3 أشهر، من خلال بناء حضور رقمي قوي على انستقرام وسناب شات وقوقل، مع استهداف سكان أحياء النزهة والعليا والياسمين في الرياض.",
  kpis: [
    { target: "40%", label: "زيادة الطلبات", current: "23%", status: "warn" },
    { target: "4x", label: "عائد الاستثمار", current: "3.2x", status: "ok" },
    { target: "10", label: "تكلفة الطلب (ر.س)", current: "12.4", status: "warn" },
    { target: "500K", label: "ظهور شهري", current: "340K", status: "ok" },
  ],
  audience: {
    segments: ["25-34 سنة", "موظفون", "عائلات", "طلاب جامعيون"],
    areas: ["النزهة", "العليا", "الياسمين", "الملقا"],
    interests: ["الطعام", "التوصيل السريع", "العروض", "المطاعم"],
  },
  peakTimes: [
    { day: "الجمعة", times: ["11:00 ص", "2:00 م", "9:00 م"] },
    { day: "السبت", times: ["12:00 م", "7:00 م", "10:00 م"] },
    { day: "الأحد", times: ["1:00 م", "8:00 م"] },
    { day: "الاثنين", times: ["12:30 م", "9:00 م"] },
  ],
  phases: [
    { num: 1, title: "إعداد الحسابات والهوية", desc: "ربط المنصات + إعداد البروفايلات", date: "1-7 مايو", status: "done" },
    { num: 2, title: "إطلاق الحملات الأساسية", desc: "انستقرام + سناب شات + قوقل", date: "8-31 مايو", status: "active" },
    { num: 3, title: "التحسين والتوسع", desc: "تيك توك + تحسين الحملات القائمة", date: "يونيو", status: "pending" },
    { num: 4, title: "قياس النتائج والتقرير", desc: "مراجعة الـ KPIs + خطة الربع القادم", date: "يوليو", status: "pending" },
  ],
  aiRecs: [
    { text: "زد ميزانية قوقل 20% — يحقق أعلى عائد (4.2x) ومجال النمو واسع في كلمات باستا توصيل الرياض", priority: "urgent" },
    { text: "راجع استهداف سناب شات — CTR منخفض، يُنصح بتغيير الإبداعية أو تضييق الاستهداف الجغرافي", priority: "medium" },
    { text: "ابدأ الإعداد لحملة عيد الأضحى مبكراً للحصول على أفضل أسعار الإعلانات", priority: "planning" },
  ],
};

const MOCK_PERFORMANCE = {
  platforms: [
    { name: "قوقل", platform: "google", impressions: 120000, clicks: 8400, orders: 840, roi: 4.2, ctr: 7.0 },
    { name: "انستقرام", platform: "instagram", impressions: 95000, clicks: 5200, orders: 620, roi: 3.1, ctr: 5.5 },
    { name: "سناب شات", platform: "snapchat", impressions: 80000, clicks: 2100, orders: 280, roi: 1.8, ctr: 2.6 },
    { name: "تيك توك", platform: "tiktok", impressions: 45000, clicks: 980, orders: 100, roi: 0, ctr: 2.2 },
  ],
};

const MOCK_BUDGET = {
  total: 8000,
  spent: 4900,
  platforms: [
    { name: "قوقل", platform: "google", limit: 2000, spent: 2300, roi: 4.2 },
    { name: "انستقرام", platform: "instagram", limit: 1200, spent: 864, roi: 3.1 },
    { name: "سناب شات", platform: "snapchat", limit: 800, spent: 360, roi: 1.8 },
    { name: "تيك توك", platform: "tiktok", limit: 600, spent: 176, roi: 0 },
  ],
};

const MOCK_CONTENT = [
  { id: "1", name: "صورة باستا كريمية — رمضان", platform: "instagram", tool: "DALL-E", date: "20 مايو 2026", status: "published" },
  { id: "2", name: "فيديو ريلز — طريقة التوصيل", platform: "tiktok", tool: "Runway", date: "18 مايو 2026", status: "pending" },
  { id: "3", name: "كابشن عروض نهاية الأسبوع", platform: "snapchat", tool: "Claude AI", date: "17 مايو 2026", status: "published" },
];

const MOCK_CONTRACT = {
  number: "MRQ-2026-001",
  start: "1 مايو 2026",
  end: "30 أبريل 2027",
  value: 96000,
  status: "active",
};

const MOCK_INVOICES = [
  { number: "#INV-003", period: "مايو 2026", amount: 8000, status: "pending" },
  { number: "#INV-002", period: "أبريل 2026", amount: 8000, status: "paid" },
  { number: "#INV-001", period: "مارس 2026", amount: 8000, status: "paid" },
];

// ===== TABS =====
const TABS = [
  "نظرة عامة", "الاستراتيجية", "الحملات",
  "الأداء", "الميزانية", "المحتوى", "العقد والفواتير"
];

// ===== MAIN COMPONENT =====
export default function ClientProfilePage({ params }: ClientProfileProps) {
  const [activeTab, setActiveTab] = useState(0);
  const client = MOCK_CLIENT;

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <TopNav
        currentClient={{ id: client.id, name: client.name }}
        alertCount={3}
        user={{ name: "عمر", email: "omar@markiq.sa", role: "admin" }}
      />

      <Breadcrumb items={[
        { label: "لوحة التحكم", href: "/dashboard" },
        { label: "العملاء", href: "/clients" },
        { label: client.name },
      ]} />

      {/* Client Header */}
      <div className="bg-white border-b border-gray-200 px-5 py-4">
        <div className="flex items-start gap-4 max-w-[1400px] mx-auto">
          <div className="w-12 h-12 rounded-xl bg-primary-light flex items-center justify-center text-lg font-bold text-primary-500 flex-shrink-0">
            {client.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h1 className="text-base font-semibold text-gray-900">{client.name}</h1>
              <StatusBadge status={client.status} />
              <Badge variant="blue">{client.sector}</Badge>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
              <span className="flex items-center gap-1"><MapPin size={11} /> {client.city} — {client.neighborhood}</span>
              <span className="flex items-center gap-1"><Smartphone size={11} /> {client.platforms.join("، ")}</span>
              <span className="flex items-center gap-1"><Calendar size={11} /> عميل منذ {client.since}</span>
            </div>
            {/* Stats row */}
            <div className="grid grid-cols-4 gap-2 mt-3">
              {[
                { val: client.stats.campaigns, lbl: "حملات نشطة" },
                { val: `${client.stats.budget.toLocaleString()}`, lbl: "ميزانية (ر.س)" },
                { val: `${client.stats.successRate}%`, lbl: "نجاح الحملات" },
                { val: `${client.stats.roi}x`, lbl: "عائد الاستثمار" },
              ].map((s, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-2 text-center">
                  <div className="text-base font-semibold text-gray-900">{s.val}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-start gap-2 flex-shrink-0">
            <Button variant="outline" icon={<FileText size={11} />}>PDF</Button>
            <Button variant="outline" icon={<Edit size={11} />}>تعديل</Button>
            <Button icon={<Plus size={11} />}>حملة جديدة</Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-5 sticky top-[54px] z-40">
        <div className="flex gap-0 max-w-[1400px] mx-auto">
          {TABS.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2.5 text-xs border-b-2 transition-colors whitespace-nowrap ${
                activeTab === i
                  ? "border-primary-500 text-primary-500 font-semibold"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
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
              <KpiCard value={`${(client.metrics.totalSpend / 1000).toFixed(1)}K`} label="إجمالي الإنفاق (ر.س)" change="↑ 18% عن الشهر" changeType="up" icon={<BarChart2 size={13} />} iconColor="text-primary-500" iconBg="bg-primary-light" />
              <KpiCard value={client.metrics.newOrders.toLocaleString()} label="طلب جديد من الحملات" change="↑ 23% عن الشهر" changeType="up" icon={<TrendingUp size={13} />} iconColor="text-green-600" iconBg="bg-green-50" />
              <KpiCard value={client.metrics.costPerOrder} label="تكلفة الطلب (ر.س)" change="↓ 8% تحسن" changeType="up" icon={<Target size={13} />} iconColor="text-yellow-700" iconBg="bg-yellow-50" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader title="بيانات العميل" icon={<FileCheck size={14} />} action="تعديل" />
                {[
                  ["القطاع", client.sector],
                  ["موقع النشاط", `${client.city} — ${client.neighborhood}`],
                  ["نطاق الاستهداف", "النزهة، العليا، الياسمين"],
                  ["الفئة المستهدفة", "25-34 سنة — الجميع"],
                  ["لغة المحتوى", "عربي — لهجة سعودية"],
                  ["الهدف الرئيسي", "زيادة الطلبات"],
                ].map(([lbl, val], i) => (
                  <div key={i} className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-0 text-xs">
                    <span className="text-gray-500">{lbl}</span>
                    <span className="text-gray-800 font-medium">{val}</span>
                  </div>
                ))}
              </Card>
              <Card>
                <CardHeader title="آخر التنبيهات" icon={<AlertTriangle size={14} />} action="عرض الكل" />
                {MOCK_ALERTS.map((a) => (
                  <div key={a.id} className="flex gap-2 py-2 border-b border-gray-100 last:border-0">
                    <AlertDot color={a.color} />
                    <div>
                      <div className="text-[11.5px] text-gray-800">{a.text}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{a.time}</div>
                    </div>
                  </div>
                ))}
              </Card>
            </div>
          </>
        )}

        {/* ===== TAB 1: الاستراتيجية ===== */}
        {activeTab === 1 && (
          <>
            {/* Summary */}
            <div className="bg-primary-light border border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary-500 mb-2">
                <Brain size={14} /> ملخص الاستراتيجية
              </div>
              <p className="text-xs text-blue-700 leading-relaxed">{MOCK_STRATEGY.summary}</p>
            </div>

            {/* KPIs */}
            <Card>
              <CardHeader title="مؤشرات النجاح (KPIs)" icon={<Target size={14} />} />
              <div className="grid grid-cols-4 gap-3">
                {MOCK_STRATEGY.kpis.map((kpi, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-primary-500">{kpi.target}</div>
                    <div className="text-[10px] text-gray-500 my-1">{kpi.label}</div>
                    <div className="border-t border-dashed border-gray-200 pt-1.5">
                      <div className="text-[9px] text-gray-400">الآن</div>
                      <div className={`text-xs font-semibold ${kpi.status === "ok" ? "text-green-600" : "text-yellow-700"}`}>
                        {kpi.current}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              {/* Audience */}
              <Card>
                <CardHeader title="تحليل الجمهور" icon={<Users size={14} />} />
                {[
                  { label: "الفئات المستهدفة", items: MOCK_STRATEGY.audience.segments, color: "bg-primary-light border-blue-200 text-primary-500" },
                  { label: "الأحياء المستهدفة", items: MOCK_STRATEGY.audience.areas, color: "bg-green-50 border-green-200 text-green-600" },
                  { label: "الاهتمامات", items: MOCK_STRATEGY.audience.interests, color: "bg-yellow-50 border-yellow-200 text-yellow-700" },
                ].map((group, gi) => (
                  <div key={gi} className="mb-3 last:mb-0">
                    <div className="text-[10px] text-gray-400 mb-1.5">{group.label}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {group.items.map((item, i) => (
                        <span key={i} className={`text-[11px] px-2 py-0.5 rounded-full border ${group.color}`}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </Card>

              {/* Peak Times */}
              <Card>
                <CardHeader title="أوقات الذروة للنشر" icon={<Clock size={14} />} />
                {MOCK_STRATEGY.peakTimes.map((pt, i) => (
                  <div key={i} className="flex items-center gap-3 py-1.5 border-b border-gray-100 last:border-0">
                    <span className="text-xs font-medium text-gray-700 w-14 flex-shrink-0">{pt.day}</span>
                    <div className="flex gap-1.5 flex-wrap">
                      {pt.times.map((t, ti) => (
                        <span key={ti} className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Phases */}
              <Card>
                <CardHeader title="مراحل تنفيذ الخطة" icon={<Map size={14} />} />
                {MOCK_STRATEGY.phases.map((phase, i) => (
                  <div key={i} className="flex gap-3 py-2 border-b border-gray-100 last:border-0">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5 ${
                      phase.status === "done" ? "bg-green-500 text-white" :
                      phase.status === "active" ? "bg-primary-500 text-white" :
                      "bg-gray-100 text-gray-500 border border-gray-200"
                    }`}>
                      {phase.status === "done" ? "✓" : phase.num}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-800">{phase.title}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">{phase.desc}</div>
                    </div>
                    <span className="text-[10px] text-gray-400 flex-shrink-0 mt-0.5">{phase.date}</span>
                  </div>
                ))}
              </Card>

              {/* AI Recommendations */}
              <Card>
                <CardHeader title="توصيات الذكاء الاصطناعي" icon={<Brain size={14} />} action="تحديث" />
                {MOCK_STRATEGY.aiRecs.map((rec, i) => (
                  <div key={i} className="flex gap-2 py-2 border-b border-gray-100 last:border-0">
                    <div className="w-7 h-7 rounded-lg bg-primary-light flex items-center justify-center flex-shrink-0">
                      <Brain size={13} className="text-primary-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] text-gray-700 leading-relaxed">{rec.text}</div>
                      <span className={`inline-block mt-1 text-[9px] px-1.5 py-0.5 rounded-full ${
                        rec.priority === "urgent" ? "bg-red-50 text-red-500" :
                        rec.priority === "medium" ? "bg-yellow-50 text-yellow-700" :
                        "bg-green-50 text-green-600"
                      }`}>
                        {rec.priority === "urgent" ? "عاجل" : rec.priority === "medium" ? "متوسط" : "تخطيط"}
                      </span>
                    </div>
                  </div>
                ))}
              </Card>
            </div>
          </>
        )}

        {/* ===== TAB 2: الحملات ===== */}
        {activeTab === 2 && (
          <Card>
            <div className="flex items-center justify-between mb-3">
              <CardHeader title="جميع الحملات" icon={<Target size={14} />} />
              <Button icon={<Plus size={11} />} size="sm">حملة جديدة</Button>
            </div>
            {MOCK_CAMPAIGNS.map((camp) => (
              <Link
                key={camp.id}
                href={`/campaigns/${camp.id}`}
                className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 -mx-1 px-1 rounded-lg transition-colors"
              >
                <PlatformIcon platform={camp.platform} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-gray-800 mb-1">{camp.name}</div>
                  <div className="text-[10px] text-gray-500 mb-1">{camp.budget.toLocaleString()} ر.س</div>
                  <ProgressBar value={camp.progress} height="h-[3px]" />
                </div>
                <span className="text-[10px] text-gray-500 flex-shrink-0">{camp.progress}%</span>
                <StatusBadge status={camp.status} />
                <ChevronRight size={13} className="text-gray-300 rotate-180" />
              </Link>
            ))}
          </Card>
        )}

        {/* ===== TAB 3: الأداء ===== */}
        {activeTab === 3 && (
          <>
            <div className="grid grid-cols-3 gap-3">
              <KpiCard value="4.2x" label="أفضل عائد — قوقل" change="↑ تحسن مستمر" changeType="up" icon={<TrendingUp size={13} />} iconColor="text-green-600" iconBg="bg-green-50" />
              <KpiCard value="8.3%" label="معدل النقر (CTR)" change="↑ أعلى من المتوسط" changeType="up" icon={<BarChart2 size={13} />} iconColor="text-primary-500" iconBg="bg-primary-light" />
              <KpiCard value="340K" label="إجمالي الظهور" change="↑ 31% هذا الشهر" changeType="up" icon={<Users size={13} />} iconColor="text-purple-600" iconBg="bg-purple-50" />
            </div>
            <Card>
              <CardHeader title="أداء المنصات" icon={<BarChart2 size={14} />} />
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {["المنصة", "الظهور", "النقرات", "الطلبات", "CTR", "ROI"].map((h) => (
                        <th key={h} className="text-right py-2 px-2 text-[10px] text-gray-400 font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_PERFORMANCE.platforms.map((p, i) => (
                      <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-2 px-2">
                          <div className="flex items-center gap-2">
                            <PlatformIcon platform={p.platform} size="sm" />
                            <span className="font-medium text-gray-800">{p.name}</span>
                          </div>
                        </td>
                        <td className="py-2 px-2 text-gray-600">{p.impressions.toLocaleString()}</td>
                        <td className="py-2 px-2 text-gray-600">{p.clicks.toLocaleString()}</td>
                        <td className="py-2 px-2 text-gray-600">{p.orders}</td>
                        <td className="py-2 px-2 text-gray-600">{p.ctr}%</td>
                        <td className={`py-2 px-2 font-semibold ${p.roi >= 3 ? "text-green-600" : p.roi >= 1.5 ? "text-yellow-700" : "text-gray-400"}`}>
                          {p.roi > 0 ? `${p.roi}x` : "جديد"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}

        {/* ===== TAB 4: الميزانية ===== */}
        {activeTab === 4 && (
          <>
            <div className="grid grid-cols-3 gap-3">
              <KpiCard value={`${(MOCK_BUDGET.spent / 1000).toFixed(1)}K`} label="المنفق هذا الشهر (ر.س)" change="61% من الميزانية" changeType="warn" icon={<CreditCard size={13} />} iconColor="text-yellow-700" iconBg="bg-yellow-50" />
              <KpiCard value={`${((MOCK_BUDGET.total - MOCK_BUDGET.spent) / 1000).toFixed(1)}K`} label="المتبقي (ر.س)" change="39% متاح" changeType="up" icon={<TrendingUp size={13} />} iconColor="text-green-600" iconBg="bg-green-50" />
              <KpiCard value={`${(MOCK_BUDGET.total / 1000).toFixed(0)}K`} label="إجمالي الميزانية (ر.س)" changeType="neutral" icon={<DollarSign size={13} />} iconColor="text-primary-500" iconBg="bg-primary-light" />
            </div>
            <Card>
              <CardHeader title="توزيع الميزانية على المنصات" icon={<BarChart2 size={14} />} action="تعديل التوزيع" />
              {/* Main bar */}
              <div className="mb-4 pb-4 border-b border-gray-100">
                <div className="flex justify-between text-[10px] text-gray-500 mb-1.5">
                  <span>الإجمالي المنفق</span>
                  <span>61% مستهلك</span>
                </div>
                <ProgressBar value={MOCK_BUDGET.spent} max={MOCK_BUDGET.total} height="h-[8px]" />
                <div className="flex justify-between mt-1.5 text-[10px]">
                  <span className="text-primary-500 font-medium">{MOCK_BUDGET.spent.toLocaleString()} ر.س منفق</span>
                  <span className="text-green-600 font-medium">{(MOCK_BUDGET.total - MOCK_BUDGET.spent).toLocaleString()} ر.س متبقي</span>
                </div>
              </div>
              {/* Platform rows */}
              {MOCK_BUDGET.platforms.map((p, i) => {
                const pct = (p.spent / p.limit) * 100;
                const isOver = pct > 100;
                return (
                  <div key={i} className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0">
                    <PlatformIcon platform={p.platform} />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-medium text-gray-800">{p.name}</span>
                        <span className={`text-[10px] font-medium ${isOver ? "text-red-500" : "text-primary-500"}`}>
                          {pct.toFixed(0)}%
                        </span>
                      </div>
                      <ProgressBar
                        value={Math.min(p.spent, p.limit)}
                        max={p.limit}
                        height="h-[5px]"
                        color={isOver ? "#FF4444" : p.platform === "instagram" ? "#8B2FC9" : p.platform === "google" ? "#FF6B35" : p.platform === "snapchat" ? "#B8860B" : "#006E9E"}
                      />
                      <div className="flex justify-between mt-1 text-[10px] text-gray-400">
                        <span className={isOver ? "text-red-500 font-medium" : ""}>{p.spent.toLocaleString()} ر.س منفق {isOver && "(تجاوز!)"}</span>
                        <span>الحد: {p.limit.toLocaleString()} ر.س</span>
                      </div>
                    </div>
                    <div className={`text-xs font-semibold flex-shrink-0 w-12 text-left ${p.roi >= 3 ? "text-green-600" : p.roi >= 1.5 ? "text-yellow-700" : "text-gray-400"}`}>
                      {p.roi > 0 ? `${p.roi}x` : "جديد"}
                    </div>
                  </div>
                );
              })}
            </Card>
          </>
        )}

        {/* ===== TAB 5: المحتوى ===== */}
        {activeTab === 5 && (
          <Card>
            <div className="flex items-center justify-between mb-3">
              <CardHeader title="مكتبة المحتوى" icon={<FileText size={14} />} />
              <Button icon={<Plus size={11} />} size="sm">محتوى جديد</Button>
            </div>
            {MOCK_CONTENT.map((item) => (
              <div key={item.id} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
                <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <FileText size={18} className="text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-gray-800 mb-0.5">{item.name}</div>
                  <div className="text-[10px] text-gray-400">
                    {item.platform} · {item.tool} · {item.date}
                  </div>
                </div>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </Card>
        )}

        {/* ===== TAB 6: العقد والفواتير ===== */}
        {activeTab === 6 && (
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <div className="flex items-center justify-between mb-3">
                <CardHeader title="العقد" icon={<FileCheck size={14} />} />
                <Button variant="outline" icon={<FileText size={11} />} size="sm">تحميل PDF</Button>
              </div>
              {[
                ["رقم العقد", MOCK_CONTRACT.number],
                ["تاريخ البداية", MOCK_CONTRACT.start],
                ["تاريخ الانتهاء", MOCK_CONTRACT.end],
                ["قيمة العقد", `${MOCK_CONTRACT.value.toLocaleString()} ر.س / سنوياً`],
              ].map(([lbl, val], i) => (
                <div key={i} className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-0 text-xs">
                  <span className="text-gray-500">{lbl}</span>
                  <span className="text-gray-800 font-medium">{val}</span>
                </div>
              ))}
              <div className="flex justify-between items-center py-1.5 text-xs">
                <span className="text-gray-500">حالة العقد</span>
                <StatusBadge status={MOCK_CONTRACT.status} />
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between mb-3">
                <CardHeader title="الفواتير" icon={<Receipt size={14} />} />
                <Button icon={<Plus size={11} />} size="sm">فاتورة جديدة</Button>
              </div>
              {MOCK_INVOICES.map((inv, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0 text-xs">
                  <span className="text-gray-400 w-20 flex-shrink-0">{inv.number}</span>
                  <span className="text-gray-600 flex-1">{inv.period}</span>
                  <span className="text-gray-800 font-medium">{inv.amount.toLocaleString()} ر.س</span>
                  <StatusBadge status={inv.status} />
                </div>
              ))}
            </Card>
          </div>
        )}

      </div>
    </div>
  );
}

// Placeholder for dollar sign icon
function DollarSign(props: { size: number }) {
  return <span style={{ fontSize: props.size }}>ر</span>;
}
