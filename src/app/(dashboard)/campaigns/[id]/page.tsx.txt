"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Target, TrendingUp, DollarSign, BarChart2, Calendar,
  ChevronRight, Loader2, Play, Pause, CheckCircle, Clock
} from "lucide-react";
import TopNav from "@/components/layout/TopNav";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { Card, CardHeader, StatusBadge, ProgressBar, KpiCard, Button } from "@/components/ui";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";

interface CampaignPageProps {
  params: { id: string };
}

const PLATFORM_LABELS: Record<string, string> = {
  instagram: "انستقرام", snapchat: "سناب شات", google: "قوقل",
  tiktok: "تيك توك", twitter: "تويتر", facebook: "فيسبوك",
  youtube: "يوتيوب", maps: "قوقل ماب",
};

const PlatformIcon = ({ platform }: { platform: string }) => {
  const icons: Record<string, JSX.Element> = {
    instagram: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
        <rect width="24" height="24" rx="6" fill="#C13584" />
        <rect x="6" y="6" width="12" height="12" rx="3.5" stroke="white" strokeWidth="1.5" fill="none" />
        <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="1.5" fill="none" />
        <circle cx="16.2" cy="7.8" r="0.9" fill="white" />
      </svg>
    ),
    snapchat: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
        <rect width="24" height="24" rx="6" fill="#FFFC00" />
        <path d="M12 5c-2.5 0-4 1.8-4 4v1.5c-.5.2-1 .4-1.2.8-.2.4 0 .8.3 1 .4.1.8.2 1.2.2-.3.8-1 1.5-1.8 2 .5.2 1.5.4 2.5.2l.2.8c.6 0 1.2-.1 1.8-.3.6.2 1.2.3 1.8.3l.2-.8c1 .2 2-.1 2.5-.2-.8-.5-1.5-1.2-1.8-2 .4 0 .8-.1 1.2-.2.3-.2.5-.6.3-1-.2-.4-.7-.6-1.2-.8V9c0-2.2-1.5-4-4-4z" fill="#333" />
      </svg>
    ),
    google: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
        <rect width="24" height="24" rx="6" fill="white" stroke="#E2E8F0" />
        <path d="M19 12.2c0-.6-.1-1.2-.2-1.7H12v3.2h3.9c-.2.9-.7 1.7-1.5 2.2v1.8h2.4c1.4-1.3 2.2-3.2 2.2-5.5z" fill="#4285F4" />
        <path d="M12 19c2 0 3.6-.6 4.8-1.7l-2.4-1.8c-.6.4-1.4.7-2.4.7-1.9 0-3.4-1.2-4-2.9H7.5v1.9C8.8 17.6 10.3 19 12 19z" fill="#34A853" />
        <path d="M8 13.3c-.2-.6-.3-1.1-.3-1.7 0-.6.1-1.2.3-1.7V8H5.5C5 9 4.8 10.5 4.8 12c0 1.5.3 2.9.8 4.2L8 13.3z" fill="#FBBC05" />
        <path d="M12 7.4c1.1 0 2 .4 2.7 1.1l2-2C15.6 5.4 14 4.8 12 4.8 10.3 4.8 8.8 6.2 7.5 8l2.5 1.9c.6-1.5 2.1-2.5 4-2.5z" fill="#EA4335" />
      </svg>
    ),
    tiktok: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
        <rect width="24" height="24" rx="6" fill="#010101" />
        <path d="M16 7.5c.8 1 2 1.5 3 1.5v2.2c-.7 0-1.9-.3-2.7-.8v4.6c0 2.3-1.9 4.2-4.2 4.2a4.2 4.2 0 01-4.2-4.2 4.2 4.2 0 014.2-4.2c.2 0 .5 0 .7.1v2.3c-.2-.1-.5-.1-.7-.1a2 2 0 00-2 2 2 2 0 002 2 2 2 0 002-2V5h2.2c.1.9.7 2.1 1.7 2.5z" fill="white" />
      </svg>
    ),
    twitter: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
        <rect width="24" height="24" rx="6" fill="black" />
        <path d="M7 7h3.5l2 2.8 2.5-2.8H17l-3.5 4 4 6h-3.5l-2.3-3.2-2.7 3.2H7l3.8-4.5L7 7z" fill="white" />
      </svg>
    ),
    facebook: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
        <rect width="24" height="24" rx="6" fill="#1877F2" />
        <path d="M13.5 19v-5.5h2l.3-2.3h-2.3V9.8c0-.6.3-1.2 1.2-1.2H16V6.7s-.9-.1-1.8-.1c-1.8 0-3 1.1-3 3v1.6H9v2.3h2.2V19h2.3z" fill="white" />
      </svg>
    ),
  };
  return icons[platform] || (
    <div className="w-5 h-5 rounded-lg bg-gray-100 flex items-center justify-center text-[9px] text-gray-500 font-bold">
      {platform.slice(0, 2).toUpperCase()}
    </div>
  );
};

export default function CampaignDetailPage({ params }: CampaignPageProps) {
  const [campaign, setCampaign] = useState<Record<string, unknown> | null>(null);
  const [content, setContent] = useState<Record<string, unknown>[]>([]);
  const [client, setClient] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createSupabaseClient();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const { data: camp } = await supabase
          .from("campaigns")
          .select("*")
          .eq("id", params.id)
          .single();

        if (camp) {
          setCampaign(camp);
          const [contentRes, clientRes] = await Promise.all([
            supabase.from("content").select("*").eq("campaign_id", params.id),
            supabase.from("clients").select("id, name").eq("id", camp.client_id).single(),
          ]);
          setContent(contentRes.data || []);
          setClient(clientRes.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [params.id]);

  async function toggleStatus() {
    if (!campaign) return;
    const newStatus = campaign.status === "active" ? "paused" : "active";
    await supabase.from("campaigns").update({ status: newStatus }).eq("id", params.id);
    setCampaign(prev => prev ? { ...prev, status: newStatus } : prev);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <Loader2 size={28} className="animate-spin text-primary-500" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="text-red-500 text-sm mb-2">لم يتم العثور على الحملة</div>
          <Link href="/campaigns" className="text-primary-500 text-xs underline">العودة للحملات</Link>
        </div>
      </div>
    );
  }

  const platforms = (campaign.platforms as string[]) || [];
  const budget = Number(campaign.budget_total || 0);
  const spend = Number(campaign.spend || 0);
  const spendPct = budget > 0 ? Math.round((spend / budget) * 100) : 0;
  const impressions = Number(campaign.impressions || 0);
  const clicks = Number(campaign.clicks || 0);
  const orders = Number(campaign.orders || 0);
  const roi = Number(campaign.roi || 0);
  const status = String(campaign.status || "");
  const clientId = String(campaign.client_id || "");

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <TopNav
        currentClient={client ? { id: clientId, name: String(client.name || "") } : null}
        alertCount={0}
        user={{ name: "عمر", email: "omar@markiq.sa", role: "admin" }}
      />
      <Breadcrumb items={[
        { label: "لوحة التحكم", href: "/dashboard" },
        { label: "الحملات", href: "/campaigns" },
        ...(client ? [{ label: String(client.name || ""), href: `/clients/${clientId}` }] : []),
        { label: String(campaign.name || "") },
      ]} />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-5 py-4">
        <div className="flex items-start gap-4 max-w-[1200px] mx-auto">
          <div className="flex gap-1.5 flex-shrink-0">
            {platforms.slice(0, 3).map(p => <PlatformIcon key={p} platform={p} />)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-base font-semibold text-gray-900">{String(campaign.name || "")}</h1>
              <StatusBadge status={status} />
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              {client && <span>{String(client.name || "")}</span>}
              {!!campaign.start_date && <span className="flex items-center gap-1"><Calendar size={11} /> {String(campaign.start_date || "")} {String(campaign.end_date || "")}</span>}
              <span>{platforms.map(p => PLATFORM_LABELS[p] || p).join("، ")}</span>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Button variant="outline"
              icon={status === "active" ? <Pause size={11} /> : <Play size={11} />}
              onClick={toggleStatus}>
              {status === "active" ? "إيقاف مؤقت" : "استئناف"}
            </Button>
            <Link href={`/campaigns/${params.id}/review`}>
              <Button icon={<CheckCircle size={11} />}>مراجعة المحتوى</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="p-4 max-w-[1200px] mx-auto space-y-4">

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-3">
          <KpiCard value={budget > 0 ? `${(budget / 1000).toFixed(1)}K` : "—"} label="الميزانية الكلية (ر.س)" icon={<DollarSign size={13} />} iconColor="text-primary-500" iconBg="bg-primary-light" />
          <KpiCard value={impressions > 0 ? impressions.toLocaleString() : "—"} label="الظهور" icon={<BarChart2 size={13} />} iconColor="text-blue-600" iconBg="bg-blue-50" />
          <KpiCard value={clicks > 0 ? clicks.toLocaleString() : "—"} label="النقرات" icon={<TrendingUp size={13} />} iconColor="text-green-600" iconBg="bg-green-50" />
          <KpiCard value={roi > 0 ? `${roi}x` : "—"} label="عائد الاستثمار" icon={<Target size={13} />} iconColor="text-yellow-700" iconBg="bg-yellow-50" />
        </div>

        {/* Budget Progress */}
        <Card>
          <CardHeader title="الميزانية والإنفاق" icon={<DollarSign size={14} />} />
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-gray-500">الإنفاق الكلي</span>
                <span className="font-medium text-gray-700">{spendPct}%</span>
              </div>
              <ProgressBar value={spend} max={budget || 1} height="h-[8px]" />
              <div className="flex justify-between mt-1 text-[10px]">
                <span className="text-primary-500 font-medium">{spend.toLocaleString()} ر.س منفق</span>
                <span className="text-green-600 font-medium">{(budget - spend).toLocaleString()} ر.س متبقي</span>
              </div>
            </div>

            {/* توزيع المنصات */}
            {Object.entries((campaign.budget_distribution as Record<string, number>) || {}).map(([pid, amt]) => (
              <div key={pid} className="flex items-center gap-3">
                <PlatformIcon platform={pid} />
                <div className="flex-1">
                  <ProgressBar value={Number(amt)} max={budget || 1} height="h-[4px]" />
                </div>
                <span className="text-[10px] text-gray-500 w-20 text-left">{Number(amt).toLocaleString()} ر.س</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Content */}
        {content.length > 0 && (
          <Card>
            <div className="flex items-center justify-between mb-3">
              <CardHeader title="المحتوى المجدول" icon={<Clock size={14} />} />
              <Link href={`/campaigns/${params.id}/review`}>
                <button className="text-[11px] text-primary-500 hover:underline">مراجعة الكل</button>
              </Link>
            </div>
            <div className="space-y-2">
              {content.slice(0, 5).map((c, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <PlatformIcon platform={String(c.platform || "")} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-700 leading-relaxed line-clamp-2">
                      {String(c.caption || "لا يوجد محتوى")}
                    </div>
                    {(c.hashtags as string[] || []).length > 0 && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {(c.hashtags as string[]).slice(0, 3).map((h, hi) => (
                          <span key={hi} className="text-[9px] text-primary-500">{h}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <StatusBadge status={String(c.status || "")} />
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Campaign Details */}
        <Card>
          <CardHeader title="تفاصيل الحملة" icon={<Target size={14} />} />
          {[
            ["الهدف", String(campaign.goal || "—")],
            ["المنصات", platforms.map(p => PLATFORM_LABELS[p] || p).join("، ") || "—"],
            ["تاريخ البداية", String(campaign.start_date || "—")],
            ["تاريخ الانتهاء", String(campaign.end_date || "—")],
            ["الطلبات", orders > 0 ? String(orders) : "—"],
          ].map(([lbl, val], i) => (
            <div key={i} className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-0 text-xs">
              <span className="text-gray-500">{lbl}</span>
              <span className="text-gray-800 font-medium">{val}</span>
            </div>
          ))}
        </Card>

      </div>
    </div>
  );
}
