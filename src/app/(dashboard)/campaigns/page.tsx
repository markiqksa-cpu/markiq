"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus, Filter, Search, Megaphone, TrendingUp,
  DollarSign, CheckCircle, Clock, AlertTriangle, Eye
} from "lucide-react";
import TopNav from "@/components/layout/TopNav";
import PageHeader from "@/components/layout/PageHeader";
import { Button, Card, KpiCard, Badge, PlatformIcon } from "@/components/ui";

const CAMPAIGNS = [
  { id: "1", name: "رمضان 2026 — معك رونة", client: "معك رونة", status: "active", platform: "instagram", budget: 8000, spend: 4200, roi: 3.2, startDate: "1 مارس", endDate: "30 مارس" },
  { id: "2", name: "إطلاق منتج جديد — صحة بلس", client: "صحة بلس", status: "active", platform: "google", budget: 12000, spend: 7800, roi: 4.1, startDate: "15 مارس", endDate: "15 أبريل" },
  { id: "3", name: "توعية العلامة — برق ستور", client: "برق ستور", status: "paused", platform: "tiktok", budget: 5000, spend: 2100, roi: 1.8, startDate: "1 فبراير", endDate: "28 فبراير" },
  { id: "4", name: "عروض نهاية الموسم", client: "نخبة صالون", status: "active", platform: "snapchat", budget: 3000, spend: 1500, roi: 2.5, startDate: "20 مارس", endDate: "20 أبريل" },
  { id: "5", name: "حملة بحث — كلمات مفتاحية", client: "معك رونة", status: "completed", platform: "google", budget: 6000, spend: 6000, roi: 5.2, startDate: "1 يناير", endDate: "28 فبراير" },
];

const STATUS_LABELS: Record<string, string> = { active: "نشطة", paused: "موقوفة", completed: "مكتملة", draft: "مسودة" };
const STATUS_COLORS: Record<string, string> = { active: "success", paused: "warning", completed: "default", draft: "default" };

export default function CampaignsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = CAMPAIGNS.filter(c => {
    const matchSearch = c.name.includes(search) || c.client.includes(search);
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const activeCampaigns = CAMPAIGNS.filter(c => c.status === "active").length;
  const totalBudget = CAMPAIGNS.reduce((s, c) => s + c.budget, 0);
  const totalSpend = CAMPAIGNS.reduce((s, c) => s + c.spend, 0);
  const avgRoi = (CAMPAIGNS.reduce((s, c) => s + c.roi, 0) / CAMPAIGNS.length).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <TopNav currentClient={null} alertCount={3} user={{ name: "عمر", email: "omar@markiq.sa", role: "admin" }} />
      <PageHeader
        title="الحملات الإعلانية"
        subtitle={`${CAMPAIGNS.length} حملة — ${activeCampaigns} نشطة`}
        actions={
          <>
            <Button variant="outline" icon={<Filter size={11} />}>تصفية</Button>
            <Link href="/campaigns/new">
              <Button icon={<Plus size={11} />}>حملة جديدة</Button>
            </Link>
          </>
        }
      />

      <div className="p-4 max-w-[1100px] mx-auto space-y-4">
        <div className="grid grid-cols-4 gap-3">
          <KpiCard value={String(activeCampaigns)} label="حملات نشطة" icon={<Megaphone size={13} />} iconColor="text-primary-500" iconBg="bg-primary-light" />
          <KpiCard value={`${(totalBudget/1000).toFixed(0)}K`} label="إجمالي الميزانية (ر.س)" icon={<DollarSign size={13} />} iconColor="text-yellow-700" iconBg="bg-yellow-50" />
          <KpiCard value={`${(totalSpend/1000).toFixed(1)}K`} label="إجمالي الإنفاق (ر.س)" icon={<TrendingUp size={13} />} iconColor="text-green-600" iconBg="bg-green-50" />
          <KpiCard value={`${avgRoi}x`} label="متوسط العائد" icon={<CheckCircle size={13} />} iconColor="text-blue-600" iconBg="bg-blue-50" />
        </div>

        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 relative">
              <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="ابحث عن حملة أو عميل..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pr-9 pl-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-400"
              />
            </div>
            <div className="flex gap-2">
              {["all", "active", "paused", "completed"].map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${statusFilter === s ? "bg-primary-500 text-white border-primary-500" : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"}`}
                >
                  {s === "all" ? "الكل" : STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            {filtered.map(c => (
              <div key={c.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl hover:border-primary-200 hover:bg-primary-50/30 transition-colors">
                <PlatformIcon platform={c.platform} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium text-gray-800 truncate">{c.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                      c.status === "active" ? "bg-green-50 text-green-600 border-green-200" :
                      c.status === "paused" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                      "bg-gray-100 text-gray-500 border-gray-200"
                    }`}>{STATUS_LABELS[c.status]}</span>
                  </div>
                  <div className="text-[11px] text-gray-400">{c.client} · {c.startDate} — {c.endDate}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xs font-medium text-gray-700">{c.spend.toLocaleString()} / {c.budget.toLocaleString()} ر.س</div>
                  <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-primary-500 rounded-full" style={{ width: `${Math.min((c.spend/c.budget)*100, 100)}%` }} />
                  </div>
                </div>
                <div className={`text-sm font-bold flex-shrink-0 w-12 text-center ${c.roi >= 3 ? "text-green-600" : c.roi >= 2 ? "text-yellow-700" : "text-gray-400"}`}>
                  {c.roi}x
                </div>
                <Link href={`/campaigns/${c.id}/review`}>
                  <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:border-primary-400 hover:text-primary-500 transition-colors">
                    <Eye size={14} />
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
