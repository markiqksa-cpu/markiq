"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users, Megaphone, TrendingUp, DollarSign, AlertTriangle,
  Trophy, BarChart2, Lock, Plus, Download, CheckCircle,
  Clock, Calendar, ArrowUpRight, Loader2
} from "lucide-react";
import TopNav from "@/components/layout/TopNav";
import PageHeader from "@/components/layout/PageHeader";
import {
  Button, KpiCard, Card, CardHeader, StatusBadge,
  ProgressBar, PlatformIcon, AlertDot
} from "@/components/ui";
import { createClient } from "@/lib/supabase/client";

function getToday(): string {
  const days = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
  const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
  const now = new Date();
  return `${days[now.getDay()]}، ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
}

const SECTOR_LABELS: Record<string, string> = {
  restaurants: "مطاعم وكافيهات", salons: "صالونات", clinics: "عيادات",
  retail: "متاجر", ecommerce: "تجارة إلكترونية", education: "تعليم",
  real_estate: "عقارات", other: "أخرى",
};

export default function DashboardPage() {
  const [clients, setClients] = useState<Record<string, unknown>[]>([]);
  const [campaigns, setCampaigns] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [clientsRes, campaignsRes] = await Promise.all([
          supabase.from("clients").select("id, name, sector, status, budget_monthly").order("created_at", { ascending: false }),
          supabase.from("campaigns").select("id, name, status, platforms, spend, budget_total, client_id").order("created_at", { ascending: false }),
        ]);
        setClients(clientsRes.data || []);
        setCampaigns(campaignsRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const activeClients = clients.filter(c => c.status === "active").length;
  const activeCampaigns = campaigns.filter(c => c.status === "active").length;
  const totalBudget = clients.reduce((s, c) => s + Number(c.budget_monthly || 0), 0);
  const totalSpend = campaigns.reduce((s, c) => s + Number(c.spend || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <TopNav alertCount={0} user={{ name: "عمر", email: "omar@markiq.sa", role: "admin" }} />
      <PageHeader
        title="لوحة التحكم"
        subtitle={`${getToday()} — ${clients.length} عميل في المنصة`}
        actions={
          <>
            <Button variant="outline" icon={<Download size={12} />}>تصدير</Button>
            <Link href="/campaigns/new"><Button icon={<Plus size={12} />}>حملة جديدة</Button></Link>
          </>
        }
      />

      <div className="p-4 space-y-4 max-w-[1400px] mx-auto">

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 size={28} className="animate-spin text-primary-500 mx-auto mb-3" />
              <div className="text-xs text-gray-400">جاري تحميل البيانات...</div>
            </div>
          </div>
        ) : (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-5 gap-3">
              <KpiCard value={clients.length} label="إجمالي العملاء" icon={<Users size={13} />} iconColor="text-primary-500" iconBg="bg-primary-light" />
              <KpiCard value={activeClients} label="عميل نشط" change={activeClients > 0 ? `${activeClients} نشط` : "لا يوجد"} changeType="up" icon={<Megaphone size={13} />} iconColor="text-yellow-700" iconBg="bg-yellow-50" />
              <KpiCard value={activeCampaigns} label="حملة جارية" icon={<TrendingUp size={13} />} iconColor="text-purple-600" iconBg="bg-purple-50" />
              <KpiCard value={totalBudget > 0 ? `${(totalBudget / 1000).toFixed(0)}K` : "—"} label="إجمالي الميزانيات (ر.س)" icon={<DollarSign size={13} />} iconColor="text-green-600" iconBg="bg-green-50" />
              <KpiCard value={campaigns.length} label="إجمالي الحملات" icon={<AlertTriangle size={13} />} iconColor="text-red-500" iconBg="bg-red-50" />
            </div>

            {/* Performance Banner */}
            <div className="bg-primary-light border border-blue-200 rounded-xl p-3 flex items-center gap-4">
              <div className="flex items-center gap-2 flex-1">
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Trophy size={14} className="text-white" />
                </div>
                <div>
                  <div className="text-base font-semibold text-primary-500">{activeClients} / {clients.length}</div>
                  <div className="text-[10px] text-blue-600">عملاء نشطون</div>
                </div>
              </div>
              <div className="w-px h-8 bg-blue-200" />
              <div className="flex items-center gap-2 flex-1">
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BarChart2 size={14} className="text-white" />
                </div>
                <div>
                  <div className="text-base font-semibold text-primary-500">{totalSpend > 0 ? `${(totalSpend / 1000).toFixed(0)}K` : "—"} ر.س</div>
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

            {/* Row 2: Clients + Campaigns */}
            <div className="grid grid-cols-2 gap-4">

              {/* Clients */}
              <Card>
                <CardHeader title="العملاء" icon={<Users size={14} />} action={<Link href="/clients">عرض الكل</Link>} />
                {clients.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Users size={24} className="mx-auto mb-2 opacity-30" />
                    <div className="text-xs">لا يوجد عملاء بعد</div>
                    <Link href="/clients/new" className="text-primary-500 text-xs underline mt-1 block">إضافة عميل</Link>
                  </div>
                ) : (
                  clients.slice(0, 5).map((client) => (
                    <Link key={String(client.id)} href={`/clients/${client.id}`}
                      className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0 hover:bg-gray-50 -mx-1 px-1 rounded-lg transition-colors group">
                      <div className="w-7 h-7 rounded-full bg-primary-light flex items-center justify-center text-[11px] font-semibold text-primary-500 flex-shrink-0">
                        {String(client.name || "").slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-gray-800 group-hover:text-primary-500 transition-colors">{String(client.name || "")}</div>
                        <div className="text-[10px] text-gray-500">{SECTOR_LABELS[String(client.sector || "")] || String(client.sector || "")}</div>
                      </div>
                      <StatusBadge status={String(client.status || "")} />
                      <div className="text-[11px] text-gray-500 flex-shrink-0">
                        {Number(client.budget_monthly || 0) > 0 ? `${Number(client.budget_monthly).toLocaleString()} ر.س` : "—"}
                      </div>
                      <ArrowUpRight size={12} className="text-gray-300 group-hover:text-primary-500 transition-colors flex-shrink-0" />
                    </Link>
                  ))
                )}
              </Card>

              {/* Campaigns */}
              <Card>
                <CardHeader title="الحملات الجارية" icon={<Megaphone size={14} />} action={<Link href="/campaigns">عرض الكل</Link>} />
                {campaigns.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Megaphone size={24} className="mx-auto mb-2 opacity-30" />
                    <div className="text-xs">لا توجد حملات بعد</div>
                    <Link href="/campaigns/new" className="text-primary-500 text-xs underline mt-1 block">إضافة حملة</Link>
                  </div>
                ) : (
                  campaigns.slice(0, 5).map((campaign) => {
                    const platforms = (campaign.platforms as string[]) || [];
                    const budget = Number(campaign.budget_total || 0);
                    const spend = Number(campaign.spend || 0);
                    const pct = budget > 0 ? Math.round((spend / budget) * 100) : 0;
                    return (
                      <Link key={String(campaign.id)} href={`/campaigns/${campaign.id}`}
                        className="flex items-center gap-2 py-2 border-b border-gray-100 last:border-0 hover:bg-gray-50 -mx-1 px-1 rounded-lg transition-colors">
                        {platforms[0] && <PlatformIcon platform={platforms[0]} />}
                        <div className="flex-1 min-w-0">
                          <div className="text-[11.5px] text-gray-800 truncate">{String(campaign.name || "")}</div>
                          <ProgressBar value={pct} max={100} height="h-[3px]" />
                        </div>
                        <span className="text-[10px] text-gray-500 flex-shrink-0">{pct}%</span>
                        <StatusBadge status={String(campaign.status || "")} />
                      </Link>
                    );
                  })
                )}
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader title="إجراءات سريعة" icon={<CheckCircle size={14} />} />
              <div className="grid grid-cols-4 gap-3 mt-2">
                {[
                  { label: "إضافة عميل", href: "/clients/new", icon: <Users size={16} /> },
                  { label: "حملة جديدة", href: "/campaigns/new", icon: <Megaphone size={16} /> },
                  { label: "التقارير", href: "/reports", icon: <BarChart2 size={16} /> },
                  { label: "التقويم", href: "/calendar", icon: <Calendar size={16} /> },
                ].map((action, i) => (
                  <Link key={i} href={action.href}
                    className="flex flex-col items-center gap-2 py-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-primary-300 hover:bg-primary-light transition-colors text-center group">
                    <div className="text-gray-400 group-hover:text-primary-500 transition-colors">{action.icon}</div>
                    <div className="text-xs text-gray-600 group-hover:text-primary-500 transition-colors font-medium">{action.label}</div>
                  </Link>
                ))}
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
