"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search, Plus, Filter, ArrowUpRight,
  Users, Megaphone, TrendingUp, DollarSign, Trash2, AlertTriangle
} from "lucide-react";
import TopNav from "@/components/layout/TopNav";
import Breadcrumb from "@/components/layout/Breadcrumb";
import PageHeader from "@/components/layout/PageHeader";
import { Button, Card, KpiCard, StatusBadge, ProgressBar } from "@/components/ui";
import { useClients } from "@/hooks/useClients";
import { createClient } from "@/lib/supabase/client";

// ===== PLATFORM ICONS (SVG حقيقية) =====
const PlatformIcon = ({ platform }: { platform: string }) => {
  const icons: Record<string, JSX.Element> = {
    instagram: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none">
        <rect width="24" height="24" rx="6" fill="#C13584" />
        <rect x="6" y="6" width="12" height="12" rx="3.5" stroke="white" strokeWidth="1.5" fill="none" />
        <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="1.5" fill="none" />
        <circle cx="16.2" cy="7.8" r="0.9" fill="white" />
      </svg>
    ),
    snapchat: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none">
        <rect width="24" height="24" rx="6" fill="#FFFC00" />
        <path d="M12 5c-2.5 0-4 1.8-4 4v1.5c-.5.2-1 .4-1.2.8-.2.4 0 .8.3 1 .4.1.8.2 1.2.2-.3.8-1 1.5-1.8 2 .5.2 1.5.4 2.5.2l.2.8c.6 0 1.2-.1 1.8-.3.6.2 1.2.3 1.8.3l.2-.8c1 .2 2-.1 2.5-.2-.8-.5-1.5-1.2-1.8-2 .4 0 .8-.1 1.2-.2.3-.2.5-.6.3-1-.2-.4-.7-.6-1.2-.8V9c0-2.2-1.5-4-4-4z" fill="#333" />
      </svg>
    ),
    google: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none">
        <rect width="24" height="24" rx="6" fill="white" stroke="#E2E8F0" />
        <path d="M19 12.2c0-.6-.1-1.2-.2-1.7H12v3.2h3.9c-.2.9-.7 1.7-1.5 2.2v1.8h2.4c1.4-1.3 2.2-3.2 2.2-5.5z" fill="#4285F4" />
        <path d="M12 19c2 0 3.6-.6 4.8-1.7l-2.4-1.8c-.6.4-1.4.7-2.4.7-1.9 0-3.4-1.2-4-2.9H7.5v1.9C8.8 17.6 10.3 19 12 19z" fill="#34A853" />
        <path d="M8 13.3c-.2-.6-.3-1.1-.3-1.7 0-.6.1-1.2.3-1.7V8H5.5C5 9 4.8 10.5 4.8 12c0 1.5.3 2.9.8 4.2L8 13.3z" fill="#FBBC05" />
        <path d="M12 7.4c1.1 0 2 .4 2.7 1.1l2-2C15.6 5.4 14 4.8 12 4.8 10.3 4.8 8.8 6.2 7.5 8l2.5 1.9c.6-1.5 2.1-2.5 4-2.5z" fill="#EA4335" />
      </svg>
    ),
    tiktok: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none">
        <rect width="24" height="24" rx="6" fill="#010101" />
        <path d="M16 7.5c.8 1 2 1.5 3 1.5v2.2c-.7 0-1.9-.3-2.7-.8v4.6c0 2.3-1.9 4.2-4.2 4.2a4.2 4.2 0 01-4.2-4.2 4.2 4.2 0 014.2-4.2c.2 0 .5 0 .7.1v2.3c-.2-.1-.5-.1-.7-.1a2 2 0 00-2 2 2 2 0 002 2 2 2 0 002-2V5h2.2c.1.9.7 2.1 1.7 2.5z" fill="white" />
      </svg>
    ),
    facebook: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none">
        <rect width="24" height="24" rx="6" fill="#1877F2" />
        <path d="M13.5 19v-5.5h2l.3-2.3h-2.3V9.8c0-.6.3-1.2 1.2-1.2H16V6.7s-.9-.1-1.8-.1c-1.8 0-3 1.1-3 3v1.6H9v2.3h2.2V19h2.3z" fill="white" />
      </svg>
    ),
    twitter: (
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none">
        <rect width="24" height="24" rx="6" fill="black" />
        <path d="M7 7h3.5l2 2.8 2.5-2.8H17l-3.5 4 4 6h-3.5l-2.3-3.2-2.7 3.2H7l3.8-4.5L7 7z" fill="white" />
      </svg>
    ),
  };

  return icons[platform] || (
    <div className="w-3.5 h-3.5 rounded bg-gray-200 flex items-center justify-center text-[7px] text-gray-500 font-bold">
      {platform.slice(0, 2).toUpperCase()}
    </div>
  );
};

// ===== DELETE MODAL =====
function DeleteModal({
  client,
  onConfirm,
  onCancel,
  loading,
}: {
  client: { name: string };
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" dir="rtl">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-modal">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={18} className="text-red-500" />
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-800">حذف العميل</div>
            <div className="text-xs text-gray-400 mt-0.5">هذا الإجراء لا يمكن التراجع عنه</div>
          </div>
        </div>
        <p className="text-xs text-gray-600 mb-5 leading-relaxed">
          هل أنت متأكد من حذف عميل <span className="font-semibold text-gray-800">{client.name}</span>؟
          سيتم حذف جميع بياناته وحملاته نهائياً.
        </p>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-xs text-gray-600 hover:bg-gray-50 transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {loading ? "جاري الحذف..." : "نعم، احذف"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ===== FILTERS =====
const STATUS_FILTERS = ["الكل", "نشط", "قيد المراجعة", "غير نشط"];

// ===== MAIN COMPONENT =====
export default function ClientsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("الكل");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const supabase = createClient();

  // جلب البيانات من Supabase
  const { clients, loading, error, refetch } = useClients({
    search: search || undefined,
    status:
      statusFilter === "نشط" ? "active" :
      statusFilter === "قيد المراجعة" ? "pending" :
      statusFilter === "غير نشط" ? "inactive" :
      undefined,
  });

  // ===== حذف العميل =====
  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      const { error } = await supabase
        .from("clients")
        .delete()
        .eq("id", deleteTarget.id);

      if (error) throw error;
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      console.error("فشل الحذف:", err);
    } finally {
      setDeleteLoading(false);
    }
  }

  // ===== إحصائيات =====
  const activeCount = clients.filter((c) => c.status === "active").length;
  const totalBudget = clients.reduce((s, c) => s + (c.budgetMonthly || 0), 0);
  const rois = clients.filter((c) => (c.roi ?? 0) > 0).map((c) => c.roi ?? 0);
  const avgROI = rois.length > 0 ? rois.reduce((a, b) => a + b, 0) / rois.length : 0;

  // ===== الحالة: تحميل / خطأ =====
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <TopNav alertCount={0} user={{ name: "عمر", email: "omar@markiq.sa", role: "admin" }} />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <div className="text-xs text-gray-400">جاري تحميل العملاء...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="text-red-500 text-sm mb-2">حدث خطأ في تحميل البيانات</div>
          <div className="text-xs text-gray-400">{error}</div>
          <button onClick={refetch} className="mt-3 text-primary-500 text-xs underline">إعادة المحاولة</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {deleteTarget && (
        <DeleteModal
          client={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}

      <TopNav alertCount={3} user={{ name: "عمر", email: "omar@markiq.sa", role: "admin" }} />
      <Breadcrumb items={[
        { label: "لوحة التحكم", href: "/dashboard" },
        { label: "العملاء" },
      ]} />
      <PageHeader
        title="العملاء"
        subtitle={`${clients.length} عميل — ${activeCount} نشط`}
        actions={
          <>
            <Button variant="outline" icon={<Filter size={11} />}>تصفية</Button>
            <Link href="/clients/new">
              <Button icon={<Plus size={11} />}>عميل جديد</Button>
            </Link>
          </>
        }
      />

      <div className="p-4 max-w-[1200px] mx-auto space-y-4">

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-3">
          <KpiCard value={clients.length} label="إجمالي العملاء" icon={<Users size={13} />} iconColor="text-primary-500" iconBg="bg-primary-light" />
          <KpiCard value={activeCount} label="عميل نشط" change="↑ 2 هذا الشهر" changeType="up" icon={<Megaphone size={13} />} iconColor="text-green-600" iconBg="bg-green-50" />
          <KpiCard value={totalBudget > 0 ? `${(totalBudget / 1000).toFixed(0)}K` : "0"} label="إجمالي الميزانيات (ر.س)" icon={<DollarSign size={13} />} iconColor="text-yellow-700" iconBg="bg-yellow-50" />
          <KpiCard value={avgROI > 0 ? `${avgROI.toFixed(1)}x` : "—"} label="متوسط العائد" change="↑ جيد" changeType="up" icon={<TrendingUp size={13} />} iconColor="text-purple-600" iconBg="bg-purple-50" />
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
            {clients.map((client) => {
              const budget = client.budgetMonthly || 0;
              const spent = client.totalSpend || 0;
              const spentPct = budget > 0 ? Math.round((spent / budget) * 100) : 0;
              const platforms: string[] = client.platforms || [];
              const initials = client.name?.slice(0, 2) || "عم";

              return (
                <div key={client.id} className="relative group">
                  <Link href={`/clients/${client.id}`}>
                    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-primary-400 hover:shadow-card transition-all cursor-pointer">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold flex-shrink-0 bg-primary-light text-primary-500">
                          {initials}
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
                          <span>{spentPct}%</span>
                        </div>
                        <ProgressBar value={spent} max={budget || 1} height="h-[4px]" />
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { val: budget > 0 ? `${(budget / 1000).toFixed(1)}K` : "—", label: "ميزانية" },
                          { val: client.activeCampaigns ?? 0, label: "حملات" },
                          { val: (client.roi ?? 0) > 0 ? `${client.roi}x` : "—", label: "ROI" },
                        ].map((s, i) => (
                          <div key={i} className="bg-gray-50 rounded-lg p-1.5 text-center">
                            <div className="text-xs font-semibold text-gray-800">{s.val}</div>
                            <div className="text-[9px] text-gray-400">{s.label}</div>
                          </div>
                        ))}
                      </div>

                      {/* Platforms */}
                      <div className="flex gap-1.5 mt-3 pt-3 border-t border-gray-100 items-center">
                        {platforms.slice(0, 5).map((p) => (
                          <PlatformIcon key={p} platform={p} />
                        ))}
                        <div className="text-[10px] text-gray-400 mr-auto">
                          منذ {new Date(client.createdAt).toLocaleDateString("ar-SA", { month: "long", year: "numeric" })}
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setDeleteTarget({ id: client.id, name: client.name });
                    }}
                    className="absolute top-3 left-3 w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:border-red-200 hover:text-red-500 text-gray-400 z-10"
                    title="حذف العميل"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              );
            })}

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
                    {["العميل", "القطاع", "الميزانية", "المنصات", "الحملات", "ROI", "الحالة", ""].map((h) => (
                      <th key={h} className="text-right py-2 px-3 text-[10px] text-gray-400 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {clients.map((client) => (
                    <tr key={client.id} className="border-b border-gray-50 hover:bg-gray-50 group">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-semibold flex-shrink-0 bg-primary-light text-primary-500">
                            {client.name?.slice(0, 2)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">{client.name}</div>
                            <div className="text-[10px] text-gray-400">{client.city} — {client.neighborhood}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-gray-500">{client.sector}</td>
                      <td className="py-3 px-3 text-gray-700 font-medium">
                        {(client.budgetMonthly || 0).toLocaleString()} ر.س
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex gap-1 items-center">
                          {(client.platforms || []).slice(0, 4).map((p: string) => (
                            <PlatformIcon key={p} platform={p} />
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-gray-600">{client.activeCampaigns ?? 0}</td>
                      <td className="py-3 px-3">
                        <span className={`font-semibold ${(client.roi ?? 0) >= 3 ? "text-green-600" : (client.roi ?? 0) >= 1.5 ? "text-yellow-700" : "text-gray-400"}`}>
                          {(client.roi ?? 0) > 0 ? `${client.roi}x` : "—"}
                        </span>
                      </td>
                      <td className="py-3 px-3"><StatusBadge status={client.status} /></td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <Link href={`/clients/${client.id}`} className="text-primary-500 hover:text-primary-600 flex items-center gap-1 text-[10px]">
                            عرض <ArrowUpRight size={10} />
                          </Link>
                          <button
                            onClick={() => setDeleteTarget({ id: client.id, name: client.name })}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-500"
                            title="حذف"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {clients.length === 0 && !loading && (
          <div className="text-center py-16 text-gray-400">
            <Users size={32} className="mx-auto mb-3 opacity-30" />
            <div className="text-sm mb-2">لا يوجد عملاء بعد</div>
            <div className="text-xs mb-4">ابدأ بإضافة عميلك الأول</div>
            <Link href="/clients/new">
              <button className="px-4 py-2 bg-primary-500 text-white rounded-xl text-xs font-medium hover:bg-primary-600 transition-colors">
                إضافة عميل
              </button>
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
