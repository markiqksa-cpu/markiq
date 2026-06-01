"use client";

import { useState } from "react";
import {
  BarChart2, Eye, ShoppingCart, DollarSign, TrendingUp,
  FileDown, Table, RefreshCw, Brain, AlertTriangle,
  Calendar, Target, ChevronUp, ChevronDown
} from "lucide-react";
import TopNav from "@/components/layout/TopNav";
import Breadcrumb from "@/components/layout/Breadcrumb";
import PageHeader from "@/components/layout/PageHeader";
import { Button, Card, CardHeader, KpiCard, PlatformIcon, ProgressBar } from "@/components/ui";

// ===== MOCK DATA =====
const PLATFORM_DATA = [
  { name: "قوقل", platform: "google", impressions: 120000, clicks: 8400, orders: 840, spend: 2300, roi: 4.2, ctr: 7.0, trend: "up" },
  { name: "انستقرام", platform: "instagram", impressions: 95000, clicks: 5200, orders: 620, spend: 1200, roi: 3.1, ctr: 5.5, trend: "up" },
  { name: "سناب شات", platform: "snapchat", impressions: 80000, clicks: 2100, orders: 280, spend: 800, roi: 1.8, ctr: 2.6, trend: "down" },
  { name: "تيك توك", platform: "tiktok", impressions: 45000, clicks: 980, orders: 100, spend: 600, roi: 0, ctr: 2.2, trend: "neutral" },
];

const CHART_DATA = [
  { day: "1", orders: 35, spend: 280 },
  { day: "5", orders: 45, spend: 320 },
  { day: "10", orders: 60, spend: 400 },
  { day: "15", orders: 75, spend: 450 },
  { day: "18", orders: 55, spend: 380 },
  { day: "20", orders: 90, spend: 550 },
  { day: "22", orders: 80, spend: 500 },
  { day: "24", orders: 70, spend: 440 },
];

const AI_INSIGHTS = [
  { type: "opportunity", icon: <TrendingUp size={13} />, text: "قوقل يحقق 4.2x ROI — زيادة ميزانيته 20% ستجلب ~170 طلب إضافي", priority: "urgent" },
  { type: "warning", icon: <AlertTriangle size={13} />, text: "سناب شات CTR أقل من المتوسط — يُنصح بتغيير الإبداعية أو تضييق الاستهداف", priority: "warning" },
  { type: "timing", icon: <Calendar size={13} />, text: "الجمعة والسبت يحققان 40% من الطلبات — ركز الإنفاق على هذين اليومين", priority: "info" },
  { type: "goal", icon: <Target size={13} />, text: "أنت عند 77% من هدف الشهر — الوتيرة الحالية تحقق الهدف بنهاية الشهر", priority: "success" },
];

const PERIOD_TABS = ["هذا الشهر", "الأسبوع", "آخر 3 أشهر", "مخصص"];

const PRIORITY_STYLES: Record<string, { badge: string; icon: string }> = {
  urgent: { badge: "bg-red-50 text-red-500 border-red-200", icon: "text-red-500" },
  warning: { badge: "bg-yellow-50 text-yellow-700 border-yellow-200", icon: "text-yellow-600" },
  info: { badge: "bg-primary-light text-primary-500 border-blue-200", icon: "text-primary-500" },
  success: { badge: "bg-green-50 text-green-600 border-green-200", icon: "text-green-500" },
};

const PRIORITY_LABELS: Record<string, string> = {
  urgent: "عاجل", warning: "مراجعة", info: "تحسين", success: "على المسار"
};

// ===== MINI BAR CHART =====
function MiniBarChart() {
  const maxOrders = Math.max(...CHART_DATA.map((d) => d.orders));
  const maxSpend = Math.max(...CHART_DATA.map((d) => d.spend));
  const TARGET_Y = 70; // target line at 70 orders

  return (
    <div className="relative">
      {/* Legend */}
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
          <div className="w-3 h-3 rounded-sm bg-primary-500" /> الطلبات
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
          <div className="w-3 h-3 rounded-sm bg-yellow-400" /> الإنفاق (ر.س × 10)
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
          <div className="w-6 h-0.5 bg-red-400 border-dashed border-t border-red-400" /> الهدف اليومي
        </div>
      </div>

      {/* Y axis + bars */}
      <div className="flex gap-1">
        {/* Y labels */}
        <div className="flex flex-col justify-between text-[9px] text-gray-400 ml-1" style={{ height: 100 }}>
          <span>120</span>
          <span>90</span>
          <span>60</span>
          <span>30</span>
          <span>0</span>
        </div>
        {/* Chart area */}
        <div className="flex-1 relative" style={{ height: 100 }}>
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((pct) => (
            <div key={pct} className="absolute w-full border-t border-gray-100" style={{ bottom: `${pct}%` }} />
          ))}
          {/* Target line */}
          <div
            className="absolute w-full border-t-2 border-dashed border-red-400 z-10"
            style={{ bottom: `${(TARGET_Y / maxOrders) * 100}%` }}
          >
            <span className="absolute -top-3 -left-1 text-[8px] text-red-400 font-medium">هدف</span>
          </div>
          {/* Bars */}
          <div className="absolute inset-0 flex items-end gap-0.5">
            {CHART_DATA.map((d, i) => (
              <div key={i} className="flex-1 flex items-end gap-0.5">
                <div
                  className="flex-1 bg-primary-500 rounded-t-sm transition-all"
                  style={{ height: `${(d.orders / maxOrders) * 100}%` }}
                />
                <div
                  className="flex-1 bg-yellow-400 rounded-t-sm opacity-70 transition-all"
                  style={{ height: `${(d.spend / maxSpend) * 100}%` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* X labels */}
      <div className="flex gap-0.5 mr-7 mt-1">
        {CHART_DATA.map((d, i) => (
          <div key={i} className="flex-1 text-center text-[9px] text-gray-400">{d.day}</div>
        ))}
      </div>

      {/* Comparison strip */}
      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-100">
        {[
          { label: "الهدف", val: "2,400 طلب", actual: "1,840 طلب", pct: 77, color: "#1B4FFF", actualColor: "#00A86B" },
          { label: "الميزانية", val: "8,000 ر.س", actual: "4,900 ر.س", pct: 100, color: "#1B4FFF", actualColor: "#FFB800" },
          { label: "تكلفة الطلب", val: "10 ر.س هدف", actual: "12.4 ر.س فعلي", pct: 100, color: "#1B4FFF", actualColor: "#FF4444" },
        ].map((c, i) => (
          <div key={i} className="bg-gray-50 rounded-lg p-2">
            <div className="text-[10px] text-gray-400 mb-1.5">{c.label}</div>
            <div className="text-[11px] text-gray-700 font-medium mb-0.5">{c.val}</div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mb-1">
              <div className="h-full rounded-full" style={{ width: `${c.pct}%`, backgroundColor: c.color }} />
            </div>
            <div className="text-[10px] font-medium" style={{ color: c.actualColor }}>{c.actual}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== COMPONENT =====
export default function PerformanceReportsPage() {
  const [activePeriod, setActivePeriod] = useState("هذا الشهر");
  const [activeCampaign, setActiveCampaign] = useState("جميع الحملات");
  const [sortField, setSortField] = useState("roi");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const sorted = [...PLATFORM_DATA].sort((a, b) => {
    const av = a[sortField as keyof typeof a] as number;
    const bv = b[sortField as keyof typeof b] as number;
    return sortDir === "desc" ? bv - av : av - bv;
  });

  function handleSort(field: string) {
    if (sortField === field) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("desc"); }
  }

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ChevronDown size={11} className="text-gray-300" />;
    return sortDir === "desc" ? <ChevronDown size={11} className="text-primary-500" /> : <ChevronUp size={11} className="text-primary-500" />;
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <TopNav currentClient={{ id: "1", name: "معك رونة" }} alertCount={3} user={{ name: "عمر", email: "omar@markiq.sa", role: "admin" }} />
      <Breadcrumb items={[
        { label: "لوحة التحكم", href: "/dashboard" },
        { label: "التقارير" },
      ]} />
      <PageHeader
        title="تقارير الأداء — معك رونة"
        subtitle="مايو 2026 — تحديث تلقائي كل 6 ساعات"
        actions={
          <>
            <Button variant="outline" icon={<FileDown size={11} />}>PDF</Button>
            <Button variant="outline" icon={<Table size={11} />}>Excel</Button>
            <Button icon={<RefreshCw size={11} />}>تحديث</Button>
          </>
        }
      />

      {/* Filter Bar */}
      <div className="bg-white border-b border-gray-200 px-5 py-2 flex gap-2 items-center flex-wrap">
        {PERIOD_TABS.map((t) => (
          <button key={t} onClick={() => setActivePeriod(t)} className={`px-3 py-1.5 rounded-full text-[11px] border transition-colors ${activePeriod === t ? "bg-primary-500 text-white border-primary-500" : "border-gray-200 text-gray-500"}`}>
            {t}
          </button>
        ))}
        <select
          value={activeCampaign}
          onChange={(e) => setActiveCampaign(e.target.value)}
          className="mr-auto text-[11px] px-2.5 py-1.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 focus:outline-none"
        >
          {["جميع الحملات", "حملة رمضان", "إعلان بحث قوقل", "عروض نهاية الأسبوع"].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="p-4 max-w-[1200px] mx-auto space-y-4">

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-3">
          <KpiCard value="340K" label="إجمالي الظهور" change="↑ 31% عن الشهر الماضي" changeType="up" icon={<Eye size={13} />} iconColor="text-primary-500" iconBg="bg-primary-light" />
          <KpiCard value="1,840" label="طلب جديد" change="↑ 23% عن الشهر الماضي" changeType="up" icon={<ShoppingCart size={13} />} iconColor="text-green-600" iconBg="bg-green-50" />
          <KpiCard value="12.4" label="تكلفة الطلب (ر.س)" change="↓ 8% تحسن" changeType="up" icon={<DollarSign size={13} />} iconColor="text-yellow-700" iconBg="bg-yellow-50" />
          <KpiCard value="3.2x" label="عائد الاستثمار" change="↑ 0.4 عن الشهر" changeType="up" icon={<TrendingUp size={13} />} iconColor="text-purple-600" iconBg="bg-purple-50" />
        </div>

        {/* Chart */}
        <Card>
          <CardHeader title="أداء الطلبات والإنفاق اليومي" icon={<BarChart2 size={14} />} />
          <MiniBarChart />
        </Card>

        {/* Platform Performance */}
        <Card>
          <CardHeader title="أداء المنصات التفصيلي" icon={<BarChart2 size={14} />} />
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100">
                  {[
                    { label: "المنصة", field: "name" },
                    { label: "الظهور", field: "impressions" },
                    { label: "النقرات", field: "clicks" },
                    { label: "الطلبات", field: "orders" },
                    { label: "CTR%", field: "ctr" },
                    { label: "الإنفاق", field: "spend" },
                    { label: "ROI", field: "roi" },
                  ].map((col) => (
                    <th
                      key={col.field}
                      onClick={() => handleSort(col.field)}
                      className="text-right py-2 px-3 text-[10px] text-gray-400 font-medium cursor-pointer hover:text-gray-600 select-none"
                    >
                      <div className="flex items-center gap-1">
                        {col.label}
                        <SortIcon field={col.field} />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((p, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <PlatformIcon platform={p.platform} />
                        <span className="font-medium text-gray-800">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-gray-600">{p.impressions.toLocaleString()}</td>
                    <td className="py-3 px-3 text-gray-600">{p.clicks.toLocaleString()}</td>
                    <td className="py-3 px-3 text-gray-600">{p.orders}</td>
                    <td className="py-3 px-3">
                      <span className={p.ctr >= 5 ? "text-green-600 font-medium" : p.ctr >= 2.5 ? "text-yellow-700" : "text-red-500"}>
                        {p.ctr}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-gray-600">{p.spend.toLocaleString()} ر.س</td>
                    <td className="py-3 px-3">
                      <span className={`font-semibold ${p.roi >= 3 ? "text-green-600" : p.roi >= 1.5 ? "text-yellow-700" : "text-gray-400"}`}>
                        {p.roi > 0 ? `${p.roi}x` : "جديد"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* AI Insights */}
        <div className="bg-primary-light border border-blue-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-primary-500 mb-3">
            <Brain size={15} /> تحليل وتوصيات الذكاء الاصطناعي
          </div>
          <div className="grid grid-cols-2 gap-3">
            {AI_INSIGHTS.map((ins, i) => {
              const st = PRIORITY_STYLES[ins.priority];
              return (
                <div key={i} className="bg-white rounded-xl p-3 border border-blue-100 flex gap-3">
                  <div className="w-7 h-7 bg-primary-light rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className={st.icon}>{ins.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] text-gray-700 leading-relaxed mb-1.5">{ins.text}</div>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full border ${st.badge}`}>
                      {PRIORITY_LABELS[ins.priority]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
