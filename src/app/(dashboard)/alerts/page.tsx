"use client";

import { useState } from "react";
import {
  Bell, CheckCheck, Settings, AlertTriangle, Clock,
  FileText, TrendingDown, Search, Trophy, Check, X,
  ChevronDown
} from "lucide-react";
import TopNav from "@/components/layout/TopNav";
import Breadcrumb from "@/components/layout/Breadcrumb";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui";

// ===== TYPES =====
type AlertPriority = "urgent" | "warning" | "info" | "success";

interface Alert {
  id: string;
  type: string;
  priority: AlertPriority;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  isResolved: boolean;
  client?: string;
  platform?: string;
  meta?: string;
  actions: AlertAction[];
}

interface AlertAction {
  label: string;
  type: "primary" | "red" | "outline" | "green";
  followUp?: string;
}

// ===== MOCK DATA =====
const MOCK_ALERTS: Alert[] = [
  {
    id: "1", type: "budget_exceeded", priority: "urgent",
    title: "تجاوز ميزانية قوقل — معك رونة",
    message: "تجاوز الإنفاق على قوقل الحد المحدد بنسبة 15% — الإنفاق الحالي 2,300 ر.س من ميزانية 2,000 ر.س. النظام اكتشف هذا تلقائياً.",
    time: "منذ 20 دقيقة", isRead: false, isResolved: false,
    client: "معك رونة", platform: "قوقل", meta: "+300 ر.س تجاوز",
    actions: [
      { label: "زيادة الحد 500 ر.س", type: "primary" },
      { label: "إيقاف الحملة", type: "red" },
      { label: "تجاهل", type: "outline" },
    ],
  },
  {
    id: "2", type: "content_pending", priority: "urgent",
    title: "3 منشورات تنتظر موافقتك قبل النشر",
    message: "موعد نشر ستوري رمضان الأول خلال ساعتين — يحتاج موافقتك قبل النشر التلقائي.",
    time: "منذ ساعة", isRead: false, isResolved: false,
    client: "معك رونة", platform: "انستقرام", meta: "موعد النشر: 12:00 م",
    actions: [
      { label: "مراجعة واعتماد", type: "green" },
      { label: "تأجيل ساعة", type: "outline" },
    ],
  },
  {
    id: "3", type: "contract_renewal", priority: "urgent",
    title: "تجديد عقد نخبة صالون — خلال 7 أيام",
    message: "عقد نخبة صالون ينتهي في 31 مايو 2026 — يجب التواصل مع العميل وتجديد العقد قبل انتهاء الخدمة.",
    time: "اليوم 8:00 ص", isRead: false, isResolved: false,
    client: "نخبة صالون", meta: "ينتهي 31 مايو • 3,200 ر.س/شهر",
    actions: [
      { label: "تواصل مع العميل", type: "primary" },
      { label: "تجديد العقد", type: "green" },
      { label: "تذكير لاحقاً", type: "outline" },
    ],
  },
  {
    id: "4", type: "ctr_low", priority: "warning",
    title: "انخفاض CTR على سناب شات — معك رونة",
    message: "معدل النقر (CTR) على سناب شات انخفض إلى 1.2% — أقل من المتوسط المتوقع 2.6%. يُقترح تغيير الإبداعية.",
    time: "منذ 3 ساعات", isRead: true, isResolved: false,
    client: "معك رونة", platform: "سناب شات", meta: "CTR: 1.2%",
    actions: [
      { label: "تغيير الإبداعية", type: "primary" },
      { label: "تعديل الاستهداف", type: "outline" },
      { label: "تجاهل", type: "outline" },
    ],
  },
  {
    id: "5", type: "seo_opportunity", priority: "warning",
    title: "فرصة SEO — كلمة مفتاحية جديدة",
    message: "كلمة \"باستا كريمية توصيل الرياض\" يبحث عنها 1,200 شخص شهرياً ولم تستهدفها بعد — إضافتها قد تزيد الطلبات 15-20%.",
    time: "أمس 6:00 م", isRead: true, isResolved: false,
    client: "معك رونة", platform: "قوقل", meta: "1,200 بحث/شهر",
    actions: [
      { label: "إضافة الكلمة", type: "primary" },
      { label: "لاحقاً", type: "outline" },
    ],
  },
  {
    id: "6", type: "goal_reached", priority: "success",
    title: "انستقرام تجاوز هدف الطلبات — معك رونة",
    message: "حملة انستقرام حققت 620 طلب من هدف 500 — تجاوز الهدف بنسبة 24%. عائد الاستثمار وصل 3.1x.",
    time: "أمس 4:30 م", isRead: true, isResolved: false,
    client: "معك رونة", platform: "انستقرام", meta: "+24% فوق الهدف",
    actions: [
      { label: "عرض التقرير", type: "primary" },
      { label: "رائع، شكراً", type: "outline" },
    ],
  },
];

const PRIORITY_CONFIG: Record<AlertPriority, { bg: string; border: string; iconBg: string; iconColor: string; badge: string; badgeText: string; label: string }> = {
  urgent: { bg: "bg-red-50/80", border: "border-red-200", iconBg: "bg-red-100", iconColor: "text-red-500", badge: "bg-red-50 text-red-500 border-red-200", badgeText: "عاجل", label: "عاجل — يحتاج إجراء فوري" },
  warning: { bg: "bg-yellow-50/60", border: "border-yellow-200", iconBg: "bg-yellow-100", iconColor: "text-yellow-700", badge: "bg-yellow-50 text-yellow-700 border-yellow-200", badgeText: "تحذير", label: "تحذير — يحتاج مراجعة" },
  info: { bg: "bg-blue-50/60", border: "border-blue-200", iconBg: "bg-blue-100", iconColor: "text-blue-500", badge: "bg-blue-50 text-blue-500 border-blue-200", badgeText: "معلومة", label: "معلومة" },
  success: { bg: "bg-green-50/60", border: "border-green-200", iconBg: "bg-green-100", iconColor: "text-green-600", badge: "bg-green-50 text-green-600 border-green-200", badgeText: "إنجاز", label: "إنجاز" },
};

const ALERT_ICONS: Record<string, React.ReactNode> = {
  budget_exceeded: <AlertTriangle size={16} />,
  content_pending: <Clock size={16} />,
  contract_renewal: <FileText size={16} />,
  ctr_low: <TrendingDown size={16} />,
  seo_opportunity: <Search size={16} />,
  goal_reached: <Trophy size={16} />,
};

const ACTION_STYLES: Record<string, string> = {
  primary: "bg-primary-500 text-white border-none hover:bg-primary-600",
  red: "bg-red-50 text-red-500 border border-red-200 hover:bg-red-100",
  outline: "bg-white text-gray-500 border border-gray-200 hover:border-gray-300",
  green: "bg-green-500 text-white border-none hover:bg-green-600",
};

const FILTERS = ["الكل", "عاجل", "تحذير", "معلومة", "مكتمل"];

// ===== COMPONENT =====
export default function AlertsCenterPage() {
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
  const [activeFilter, setActiveFilter] = useState("الكل");
  const [clientFilter, setClientFilter] = useState("جميع العملاء");

  const urgentCount = alerts.filter((a) => a.priority === "urgent" && !a.isResolved).length;
  const warningCount = alerts.filter((a) => a.priority === "warning" && !a.isResolved).length;
  const successCount = alerts.filter((a) => a.priority === "success").length;

  const filtered = alerts.filter((a) => {
    if (activeFilter === "عاجل") return a.priority === "urgent";
    if (activeFilter === "تحذير") return a.priority === "warning";
    if (activeFilter === "معلومة") return a.priority === "info";
    if (activeFilter === "مكتمل") return a.isResolved;
    return true;
  });

  const grouped = {
    urgent: filtered.filter((a) => a.priority === "urgent" && !a.isResolved),
    warning: filtered.filter((a) => a.priority === "warning" && !a.isResolved),
    info: filtered.filter((a) => a.priority === "info" && !a.isResolved),
    success: filtered.filter((a) => a.priority === "success" && !a.isResolved),
  };

  function markAllRead() {
    setAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })));
  }

  function resolve(id: string) {
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, isResolved: true } : a));
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <TopNav alertCount={urgentCount} user={{ name: "عمر", email: "omar@markiq.sa", role: "admin" }} />
      <Breadcrumb items={[
        { label: "لوحة التحكم", href: "/dashboard" },
        { label: "مركز التنبيهات" },
      ]} />
      <PageHeader
        title="مركز التنبيهات"
        subtitle={`${urgentCount + warningCount} تنبيهات نشطة — ${urgentCount} تحتاج إجراء فورياً`}
        actions={
          <>
            <Button variant="outline" icon={<CheckCheck size={11} />} onClick={markAllRead}>تعليم الكل مقروء</Button>
            <Button icon={<Settings size={11} />}>إعدادات التنبيهات</Button>
          </>
        }
      />

      {/* Summary Strip */}
      <div className="bg-white border-b border-gray-200 px-5 py-2.5">
        <div className="flex gap-6 max-w-[1200px] mx-auto">
          {[
            { color: "bg-red-500", label: "عاجل", count: urgentCount },
            { color: "bg-yellow-400", label: "تحذير", count: warningCount },
            { color: "bg-primary-500", label: "معلومة", count: 0 },
            { color: "bg-green-500", label: "إنجاز", count: successCount },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
              <span className="text-base font-semibold text-gray-800">{s.count}</span>
              <span className="text-[11px] text-gray-500">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border-b border-gray-200 px-5 py-2 flex gap-2 items-center flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] border transition-colors ${
              activeFilter === f ? "bg-primary-500 text-white border-primary-500" : "border-gray-200 text-gray-500 hover:border-gray-300"
            }`}
          >
            {f}
            {f === "عاجل" && urgentCount > 0 && (
              <span className="text-[9px] bg-red-500 text-white px-1 py-0.5 rounded-full mr-1">{urgentCount}</span>
            )}
          </button>
        ))}
        <div className="mr-auto flex gap-2">
          <select
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
            className="text-[11px] px-2.5 py-1.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 focus:outline-none"
          >
            {["جميع العملاء", "معك رونة", "صحة بلس", "نخبة صالون"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-4 max-w-[1200px] mx-auto space-y-3">
        {/* Render grouped alerts */}
        {(["urgent", "warning", "info", "success"] as AlertPriority[]).map((priority) => {
          const group = grouped[priority];
          if (!group.length) return null;
          const config = PRIORITY_CONFIG[priority];
          return (
            <div key={priority}>
              <div className="text-[10px] text-gray-400 font-medium flex items-center gap-2 py-1.5">
                {config.label}
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <div className="space-y-2">
                {group.map((alert) => (
                  <AlertCard
                    key={alert.id}
                    alert={alert}
                    config={config}
                    onResolve={() => resolve(alert.id)}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Bell size={32} className="mx-auto mb-3 opacity-30" />
            <div className="text-sm">لا توجد تنبيهات في هذه الفئة</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ===== ALERT CARD =====
function AlertCard({
  alert, config, onResolve
}: {
  alert: Alert;
  config: typeof PRIORITY_CONFIG[AlertPriority];
  onResolve: () => void;
}) {
  const ACTION_STYLES: Record<string, string> = {
    primary: "bg-primary-500 text-white border-none hover:bg-primary-600",
    red: "bg-red-50 text-red-500 border border-red-200 hover:bg-red-100",
    outline: "bg-white text-gray-500 border border-gray-200 hover:border-gray-300",
    green: "bg-green-500 text-white border-none hover:bg-green-600",
  };

  const ALERT_ICONS: Record<string, React.ReactNode> = {
    budget_exceeded: <AlertTriangle size={16} />,
    content_pending: <Clock size={16} />,
    contract_renewal: <FileText size={16} />,
    ctr_low: <TrendingDown size={16} />,
    seo_opportunity: <Search size={16} />,
    goal_reached: <Trophy size={16} />,
  };

  return (
    <div className={`flex gap-3 p-4 rounded-xl border ${config.bg} ${config.border}`}>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${config.iconBg} ${config.iconColor}`}>
        {ALERT_ICONS[alert.type] || <Bell size={16} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-1.5">
          <div className="text-xs font-semibold text-gray-800">{alert.title}</div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`text-[9px] px-2 py-0.5 rounded-full border ${config.badge}`}>
              {config.badgeText}
            </span>
            <span className="text-[10px] text-gray-400">{alert.time}</span>
            {!alert.isRead && <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />}
          </div>
        </div>
        <div className="text-[11px] text-gray-600 leading-relaxed mb-2">{alert.message}</div>
        <div className="flex gap-2 flex-wrap mb-3">
          {alert.client && (
            <span className="flex items-center gap-1 text-[10px] bg-white border border-gray-200 px-2 py-0.5 rounded-full text-gray-500">
              🏢 {alert.client}
            </span>
          )}
          {alert.platform && (
            <span className="flex items-center gap-1 text-[10px] bg-white border border-gray-200 px-2 py-0.5 rounded-full text-gray-500">
              📱 {alert.platform}
            </span>
          )}
          {alert.meta && (
            <span className="flex items-center gap-1 text-[10px] bg-white border border-gray-200 px-2 py-0.5 rounded-full text-gray-500">
              {alert.meta}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {alert.actions.map((action, i) => (
              <button
                key={i}
                onClick={action.type !== "outline" ? onResolve : undefined}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${ACTION_STYLES[action.type]}`}
              >
                {action.label}
              </button>
            ))}
          </div>
          <button
            onClick={onResolve}
            className="text-[10px] text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1"
          >
            <Check size={10} /> تم الحل
          </button>
        </div>
      </div>
    </div>
  );
}
