"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search, Plus, Filter, ArrowUpRight,
  Users, Megaphone, TrendingUp, DollarSign
} from "lucide-react";
import TopNav from "@/components/layout/TopNav";
import Breadcrumb from "@/components/layout/Breadcrumb";
import PageHeader from "@/components/layout/PageHeader";
import { Button, Card, KpiCard, StatusBadge, Badge, ProgressBar } from "@/components/ui";

// ===== MOCK DATA =====
const CLIENTS = [
  {
    id: "1", name: "معك رونة", nameEn: "Ma3ak Rona", sector: "مطاعم وكافيهات",
    city: "الرياض", neighborhood: "النزهة", status: "active",
    budget: 8000, spent: 4900, campaigns: 4, roi: 3.2,
    since: "مايو 2026", color: "bg-primary-light text-primary-500", initials: "مر",
    platforms: ["instagram", "snapchat", "google", "tiktok"],
  },
  {
    id: "2", name: "صحة بلس", nameEn: "Health Plus", sector: "عيادات وصحة",
    city: "الرياض", neighborhood: "العليا", status: "active",
    budget: 5500, spent: 3100, campaigns: 3, roi: 2.8,
    since: "أبريل 2026", color: "bg-green-50 text-green-600", initials: "صح",
    platforms: ["instagram", "google"],
  },
  {
    id: "3", name: "برق ستور", nameEn: "Barq Store", sector: "تجارة إلكترونية",
    city: "الرياض", neighborhood: "المربع", status: "pending",
    budget: 12000, spent: 0, campaigns: 0, roi: 0,
    since: "مايو 2026", color: "bg-yellow-50 text-yellow-700", initials: "بر",
    platforms: ["google", "instagram", "tiktok"],
  },
  {
    id: "4", name: "نخبة صالون", nameEn: "Nukhba Salon", sector: "صالونات ومراكز تجميل",
    city: "الرياض", neighborhood: "السليمانية", status: "active",
    budget: 3200, spent: 1800, campaigns: 2, roi: 2.1,
    since: "مارس 2026", color: "bg-purple-50 text-purple-600", initials: "نخ",
    platforms: ["snapchat", "instagram"],
  },
  {
    id: "5", name: "الدرة العقارية", nameEn: "Al-Durra Real Estate", sector: "عقارات",
    city: "جدة", neighborhood: "الحمراء", status: "active",
    budget: 15000, spent: 8200, campaigns: 5, roi: 4.1,
    since: "يناير 2026", color: "bg-blue-50 text-blue-600", initials: "در",
    platforms: ["google", "instagram", "facebook"],
  },
  {
    id: "6", name: "كوفي هاوس", nameEn: "Coffee House", sector: "مطاعم وكافيهات",
    city: "الدمام", neighborhood: "الشاطئ", status: "inactive",
    budget: 2000, spent: 2000, campaigns: 1, roi: 1.2,
    since: "فبراير 2026", color: "bg-gray-100 text-gray-500", initials: "كو",
    platforms: ["instagram"],
  },
];

const SECTORS = ["الكل", "مطاعم وكافيهات", "صالونات", "عيادات", "تجارة إلكترونية", "عقارات"];
const STATUS_FILTERS = ["الكل", "نشط", "قيد المراجعة", "غير نشط"];

// ===== COMPONENT =====
export default function ClientsPage() {
  const [search, setSearch] = useState("");
  const [sectorFilter, setSectorFilter] = useState("الكل");
  const [statusFilter, setStatusFilter] = useState("الكل");
  const [view, setView] = useState<"grid" | "list">("grid");

  const filtered = CLIENTS.filter((c) => {
    const matchSearch = c.name.includes(search) || c.sector.includes(search) || c.city.includes(search);
    const matchSector = sectorFilter === "الكل" || c.sector.includes(sectorFilter);
    const matchStatus = statusFilter === "الكل" ||
      (statusFilter === "نشط" && c.status === "active") ||
      (statusFilter === "قيد المراجعة" && c.status === "pending") ||
      (statusFilter === "غير نشط" && c.status === "inactive");
    return matchSearch && matchSector && matchStatus;
  });

  const activeCount = CLIENTS.filter((c) => c.status === "active").length;
  const totalBudget = CLIENTS.reduce((s, c) => s + c.budget, 0);
  const avgROI = CLIENTS.filter((c) => c.roi > 0).reduce((s, c) => s + c.roi, 0) / CLIENTS.filter((c) => c.roi > 0).length;

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <TopNav alertCount={3} user={{ name: "عمر", email: "omar@markiq.sa", role: "admin" }} />
      <Breadcrumb items={[
        { label: "لوحة التحكم", href: "/dashboard" },
        { label: "العملاء" },
      ]} />
      <PageHeader
        title="العملاء"
        subtitle={`${CLIENTS.length} عميل — ${activeCount} نشط`}
        actions={
          <>
            <Button variant="outline" icon={<Filter size={11} />}>تصفية</Button>
            <Button icon={<Plus size={11} />}>عميل جديد</Button>
          </>
        }
      />

      <div className="p-4 max-w-[1200px] mx-auto space-y-4">

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-3">
          <KpiCard value={CLIENTS.length} label="إجمالي العملاء" icon={<Users size={13} />} iconColor="text-primary-500" iconBg="bg-primary-light" />
          <KpiCard value={activeCount} label="عميل نشط" change="↑ 2 هذا الشهر" changeType="up" icon={<Megaphone size={13} />} iconColor="text-green-600" iconBg="bg-green-50" />
          <KpiCard value={`${(totalBudget / 1000).toFixed(0)}K`} label="إجمالي الميزانيات (ر.س)" icon={<DollarSign size={13} />} iconColor="text-yellow-700" iconBg="bg-yellow-50" />
          <KpiCard value={`${avgROI.toFixed(1)}x`} label="متوسط العائد" change="↑ جيد" changeType="up" icon={<TrendingUp size={13} />} iconColor="text-purple-600" iconBg="bg-purple-50" />
        </div>

        {/* Search + Filters */}
        <div className="flex gap-3 items-center flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث بالاسم أو القطاع أو المدينة..."
              className="w-full pr-9 pl-3 py-2 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-primary-500"
            />
          </div>
          <div className="flex gap-1.5">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1.5 rounded-full text-[11px] border transition-colors ${statusFilter === f ? "bg-primary-500 text-white border-primary-500" : "border-gray-200 text-gray-500 bg-white"}`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex gap-1 mr-auto">
            <button onClick={() => setView("grid")} className={`w-7 h-7 rounded border flex items-center justify-center text-[11px] ${view === "grid" ? "bg-primary-500 text-white border-primary-500" : "border-gray-200 bg-white text-gray-400"}`}>▦</button>
            <button onClick={() => setView("list")} className={`w-7 h-7 rounded border flex items-center justify-center text-[11px] ${view === "list" ? "bg-primary-500 text-white border-primary-500" : "border-gray-200 bg-white text-gray-400"}`}>☰</button>
          </div>
        </div>

        {/* Grid View */}
        {view === "grid" && (
          <div className="grid grid-cols-3 gap-4">
            {filtered.map((client) => (
              <Link key={client.id} href={`/clients/${client.id}`}>
                <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-primary-400 hover:shadow-card transition-all cursor-pointer group">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold flex-shrink-0 ${client.color}`}>
                      {client.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <div className="text-sm font-semibold text-gray-800 group-hover:text-primary-500 transition-colors">{client.name}</div>
                        <ArrowUpRight size={13} className="text-gray-300 group-hover:text-primary-500 transition-colors flex-shrink-0" />
                      </div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{client.sector} • {client.city}</div>
                    </div>
                    <StatusBadge status={client.status} />
                  </div>

                  {/* Budget Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                      <span>الميزانية المستهلكة</span>
                      <span>{Math.round((client.spent / client.budget) * 100)}%</span>
                    </div>
                    <ProgressBar value={client.spent} max={client.budget} height="h-[4px]" />
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { val: `${(client.budget / 1000).toFixed(1)}K`, label: "ميزانية" },
                      { val: client.campaigns, label: "حملات" },
                      { val: client.roi > 0 ? `${client.roi}x` : "—", label: "ROI" },
                    ].map((s, i) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-1.5 text-center">
                        <div className="text-xs font-semibold text-gray-800">{s.val}</div>
                        <div className="text-[9px] text-gray-400">{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Platforms */}
                  <div className="flex gap-1 mt-3 pt-3 border-t border-gray-100">
                    {client.platforms.slice(0, 4).map((p) => (
                      <div key={p} className="w-5 h-5 rounded text-[8px] flex items-center justify-center bg-gray-100 text-gray-500 font-bold">
                        {p === "instagram" ? "IG" : p === "snapchat" ? "SN" : p === "google" ? "GG" : p === "tiktok" ? "TK" : p === "facebook" ? "FB" : "??"}
                      </div>
                    ))}
                    <div className="text-[10px] text-gray-400 mr-auto flex items-center">منذ {client.since}</div>
                  </div>
                </div>
              </Link>
            ))}

            {/* Add New Client Card */}
            <Link href="/clients/new">
              <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:border-primary-400 hover:bg-primary-light/20 transition-all cursor-pointer min-h-[200px]">
                <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center">
                  <Plus size={20} className="text-primary-500" />
                </div>
                <div className="text-xs font-medium text-gray-500">إضافة عميل جديد</div>
              </div>
            </Link>
          </div>
        )}

        {/* List View */}
        {view === "list" && (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["العميل", "القطاع", "الميزانية", "المنفق", "الحملات", "ROI", "الحالة", ""].map((h) => (
                      <th key={h} className="text-right py-2 px-3 text-[10px] text-gray-400 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((client) => (
                    <tr key={client.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-semibold flex-shrink-0 ${client.color}`}>{client.initials}</div>
                          <div>
                            <div className="font-medium text-gray-800">{client.name}</div>
                            <div className="text-[10px] text-gray-400">{client.city} — {client.neighborhood}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-gray-500">{client.sector}</td>
                      <td className="py-3 px-3 text-gray-700 font-medium">{client.budget.toLocaleString()} ر.س</td>
                      <td className="py-3 px-3">
                        <div>
                          <div className="text-gray-700">{client.spent.toLocaleString()} ر.س</div>
                          <ProgressBar value={client.spent} max={client.budget} height="h-[3px]" />
                        </div>
                      </td>
                      <td className="py-3 px-3 text-gray-600">{client.campaigns}</td>
                      <td className="py-3 px-3">
                        <span className={`font-semibold ${client.roi >= 3 ? "text-green-600" : client.roi >= 1.5 ? "text-yellow-700" : "text-gray-400"}`}>
                          {client.roi > 0 ? `${client.roi}x` : "—"}
                        </span>
                      </td>
                      <td className="py-3 px-3"><StatusBadge status={client.status} /></td>
                      <td className="py-3 px-3">
                        <Link href={`/clients/${client.id}`} className="text-primary-500 hover:text-primary-600 flex items-center gap-1 text-[10px]">
                          عرض <ArrowUpRight size={10} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Users size={32} className="mx-auto mb-3 opacity-30" />
            <div className="text-sm mb-2">لا توجد نتائج مطابقة</div>
            <div className="text-xs">جرّب تغيير معايير البحث</div>
          </div>
        )}
      </div>
    </div>
  );
}
