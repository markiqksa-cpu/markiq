"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users, Megaphone, TrendingUp, DollarSign, AlertTriangle,
  Trophy, BarChart2, Lock, Plus, Download, CheckCircle,
  Clock, Calendar, ArrowUpRight
} from "lucide-react";
import TopNav from "@/components/layout/TopNav";
import PageHeader from "@/components/layout/PageHeader";
import {
  Button, KpiCard, Card, CardHeader, Badge, StatusBadge,
  ProgressBar, PlatformIcon, AlertDot
} from "@/components/ui";

// ===== MOCK DATA =====
const MOCK_STATS = {
  activeClients: 12,
  activeCampaigns: 28,
  campaignSuccessRate: 68,
  monthlyRevenue: 38000,
  totalAdSpend: 47000,
  urgentAlerts: 3,
  clientsHitGoal: 9,
  totalClients: 12,
};

const MOCK_CLIENTS = [
  { id: "1", name: "معك رونة", type: "مطعم باستا", status: "active", budget: 8000 },
  { id: "2", name: "صحة بلس", type: "عيادة تغذية", status: "active", budget: 5500 },
  { id: "3", name: "برق ستور", type: "متجر إلكتروني", status: "pending", budget: 12000 },
  { id: "4", name: "نخبة صالون", type: "صالون رجالي", status: "active", budget: 3200 },
];

const MOCK_ALERTS = [
  { id: "1", color: "red" as const, text: "معك رونة — تجاوز ميزانية قوقل 15%", time: "منذ 20 دقيقة" },
  { id: "2", color: "gold" as const, text: "صحة بلس — انخفاض CTR على انستقرام", time: "منذ ساعتين" },
  { id: "3", color: "blue" as const, text: "3 منشورات تنتظر موافقتك", time: "اليوم 9:15 ص" },
  { id: "4", color: "gold" as const, text: "تجديد عقد نخبة صالون خلال 7 أيام", time: "اليوم 8:00 ص" },
];

const MOCK_CAMPAIGNS = [
  { id: "1", name: "رمضان ستوري — معك رونة", platform: "instagram", progress: 72, color: "#8B2FC9" },
  { id: "2", name: "فيديو منتج — صحة بلس", platform: "tiktok", progress: 45, color: "#006E9E" },
  { id: "3", name: "إعلان بحث — برق ستور", platform: "google", progress: 88, color: "#FF6B35" },
  { id: "4", name: "ستوري عروض — نخبة صالون", platform: "snapchat", progress: 30, color: "#B8860B" },
];

const MOCK_TASKS = [
  { id: "1", title: "مراجعة محتوى معك رونة", time: "12:00 ظ", status: "todo", priority: "urgent" },
  { id: "2", title: "إعداد استراتيجية برق ستور", time: "3:00 م", status: "todo", priority: "today" },
  { id: "3", title: "تقرير أداء نخبة صالون", time: "مكتمل", status: "done", priority: "done" },
  { id: "4", title: "اجتماع عميل جديد", time: "5:00 م", status: "todo", priority: "scheduled" },
];

// ===== HELPERS =====
function getToday(): string {
  const days = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
  const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
  const now = new Date();
  return `${days[now.getDay()]}، ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
}

const PRIORITY_STYLES: Record<string, string> = {
  urgent: "text-red-500",
  today: "text-yellow-700",
  scheduled: "text-primary-500",
  done: "text-green-600",
};

const PRIORITY_LABELS: Record<string, string> = {
  urgent: "عاجل",
  today: "اليوم",
  scheduled: "مجدول",
  done: "✓ منجز",
};

// ===== DASHBOARD PAGE =====
export default function DashboardPage() {
  const [alertCount] = useState(MOCK_STATS.urgentAlerts);

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">

      {/* Top Navigation */}
      <TopNav
        alertCount={alertCount}
        user={{ name: "عمر", email: "omar@markiq.sa", role: "admin" }}
      />

      {/* Page Header */}
      <PageHeader
        title="لوحة التحكم"
        subtitle={`${getToday()} — عندك ${alertCount} حملات تنتظر المراجعة`}
        actions={
          <>
            <Button variant="outline" icon={<Download size={12} />}>تصدير</Button>
            <Button icon={<Plus size={12} />}>حملة جديدة</Button>
          </>
        }
      />

      <div className="p-4 space-y-4 max-w-[1400px] mx-auto">

        {/* KPIs */}
        <div className="grid grid-cols-5 gap-3">
          <KpiCard
            value={MOCK_STATS.activeClients}
            label="عميل نشط"
            change="↑ 2 هذا الشهر"
            changeType="up"
            icon={<Users size={13} />}
            iconColor="text-primary-500"
            iconBg="bg-primary-light"
          />
          <KpiCard
            value={MOCK_STATS.activeCampaigns}
            label="حملة جارية"
            change="↑ 5 هذا الأسبوع"
            changeType="up"
            icon={<Megaphone size={13} />}
            iconColor="text-yellow-700"
            iconBg="bg-yellow-50"
          />
          <KpiCard
            value={`${MOCK_STATS.campaignSuccessRate}%`}
            label="نجاح الحملات"
            change="↑ 4% عن الشهر"
            changeType="up"
            icon={<TrendingUp size={13} />}
            iconColor="text-purple-600"
            iconBg="bg-purple-50"
          />
          <KpiCard
            value={`${(MOCK_STATS.monthlyRevenue / 1000).toFixed(0)}K`}
            label="إيرادات Markiq (ر.س)"
            change="↑ 18% عن الشهر"
            changeType="up"
            icon={<DollarSign size={13} />}
            iconColor="text-green-600"
            iconBg="bg-green-50"
          />
          <KpiCard
            value={MOCK_STATS.urgentAlerts}
            label="تنبيه عاجل"
            change="↑ 1 جديد اليوم"
            changeType="warn"
            icon={<AlertTriangle size={13} />}
            iconColor="text-red-500"
            iconBg="bg-red-50"
          />
        </div>

        {/* Performance Banner */}
        <div className="bg-primary-light border border-blue-200 rounded-xl p-3 flex items-center gap-4">
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Trophy size={14} className="text-white" />
            </div>
            <div>
              <div className="text-base font-semibold text-primary-500">
                {MOCK_STATS.clientsHitGoal} / {MOCK_STATS.totalClients}
              </div>
              <div className="text-[10px] text-blue-600">عملاء حققوا هدفهم هذا الشهر</div>
            </div>
          </div>
          <div className="w-px h-8 bg-blue-200" />
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <BarChart2 size={14} className="text-white" />
            </div>
            <div>
              <div className="text-base font-semibold text-primary-500">
                {(MOCK_STATS.totalAdSpend / 1000).toFixed(0)}K ر.س
              </div>
              <div className="text-[10px] text-blue-600">إجمالي الإنفاق الإعلاني</div>
            </div>
          </div>
          <div className="w-px h-8 bg-blue-200" />
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Lock size={14} className="text-white" />
            </div>
            <div>
              <div className="text-base font-semibold text-primary-500">اتصال آمن</div>
              <div className="text-[10px] text-blue-600">مشفر بالكامل SSL/TLS</div>
            </div>
          </div>
        </div>

        {/* Row 2: Clients + Alerts */}
        <div className="grid grid-cols-[1.4fr_1fr] gap-4">

          {/* Active Clients */}
          <Card>
            <CardHeader
              title="العملاء النشطون"
              icon={<Users size={14} />}
              action={<Link href="/clients">عرض الكل</Link>}
            />
            <div className="space-y-0">
              {MOCK_CLIENTS.map((client) => (
                <Link
                  key={client.id}
                  href={`/clients/${client.id}`}
                  className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0 hover:bg-gray-50 -mx-1 px-1 rounded-lg transition-colors group"
                >
                  <div className="w-7 h-7 rounded-full bg-primary-light flex items-center justify-center text-[11px] font-semibold text-primary-500 flex-shrink-0">
                    {client.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-800 group-hover:text-primary-500 transition-colors">
                      {client.name}
                    </div>
                    <div className="text-[10px] text-gray-500">{client.type}</div>
                  </div>
                  <StatusBadge status={client.status} />
                  <div className="text-[11px] text-gray-500 flex-shrink-0">
                    {client.budget.toLocaleString()} ر.س
                  </div>
                  <ArrowUpRight size={12} className="text-gray-300 group-hover:text-primary-500 transition-colors flex-shrink-0" />
                </Link>
              ))}
            </div>
          </Card>

          {/* Alerts */}
          <Card>
            <CardHeader
              title="تنبيهات الحملات"
              icon={<AlertTriangle size={14} />}
              action={<Link href="/alerts">عرض الكل</Link>}
            />
            <div className="space-y-0">
              {MOCK_ALERTS.map((alert) => (
                <div key={alert.id} className="flex gap-2 py-2 border-b border-gray-100 last:border-0">
                  <AlertDot color={alert.color} className="mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[11.5px] text-gray-800 leading-snug">{alert.text}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{alert.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Row 3: Campaigns + Tasks */}
        <div className="grid grid-cols-2 gap-4">

          {/* Active Campaigns */}
          <Card>
            <CardHeader
              title="الحملات الجارية"
              icon={<Megaphone size={14} />}
              action={<Link href="/campaigns">عرض الكل</Link>}
            />
            <div className="space-y-0">
              {MOCK_CAMPAIGNS.map((campaign) => (
                <Link
                  key={campaign.id}
                  href={`/campaigns/${campaign.id}`}
                  className="flex items-center gap-2 py-2 border-b border-gray-100 last:border-0 hover:bg-gray-50 -mx-1 px-1 rounded-lg transition-colors"
                >
                  <PlatformIcon platform={campaign.platform} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[11.5px] text-gray-800 truncate">{campaign.name}</div>
                    <ProgressBar value={campaign.progress} color={campaign.color} height="h-[3px]" />
                  </div>
                  <span className="text-[10px] text-gray-500 flex-shrink-0">{campaign.progress}%</span>
                </Link>
              ))}
            </div>
          </Card>

          {/* Today's Tasks */}
          <Card>
            <CardHeader
              title="مهام اليوم"
              icon={<Calendar size={14} />}
              action={<Link href="/tasks">عرض الكل</Link>}
            />
            <div className="space-y-0">
              {MOCK_TASKS.map((task) => (
                <div key={task.id} className="flex items-center gap-2 py-2 border-b border-gray-100 last:border-0">
                  <div className={`w-[17px] h-[17px] rounded border flex items-center justify-center flex-shrink-0 ${
                    task.status === "done"
                      ? "bg-green-50 border-green-200"
                      : "border-gray-200"
                  }`}>
                    {task.status === "done" && <CheckCircle size={11} className="text-green-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-[11.5px] ${task.status === "done" ? "line-through text-gray-400" : "text-gray-800"}`}>
                      {task.title}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5">
                      <Clock size={9} />
                      {task.time}
                    </div>
                  </div>
                  <span className={`text-[10px] flex-shrink-0 font-medium ${PRIORITY_STYLES[task.priority]}`}>
                    {PRIORITY_LABELS[task.priority]}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
