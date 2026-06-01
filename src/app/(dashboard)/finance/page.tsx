"use client";

import { useState } from "react";
import {
  CreditCard, Wallet, AlertTriangle, TrendingUp,
  PlayerPause, Plus, Edit, RefreshCw, Receipt
} from "lucide-react";
import TopNav from "@/components/layout/TopNav";
import Breadcrumb from "@/components/layout/Breadcrumb";
import PageHeader from "@/components/layout/PageHeader";
import { Button, Card, CardHeader, KpiCard, PlatformIcon } from "@/components/ui";

// ===== MOCK DATA =====
const BUDGET_TOTAL = 8000;
const BUDGET_SPENT = 4900;

const PLATFORMS = [
  { id: "google", name: "قوقل", platform: "google", limit: 2000, spent: 2300, roi: 4.2 },
  { id: "instagram", name: "انستقرام", platform: "instagram", limit: 1200, spent: 864, roi: 3.1 },
  { id: "snapchat", name: "سناب شات", platform: "snapchat", limit: 800, spent: 360, roi: 1.8 },
  { id: "tiktok", name: "تيك توك", platform: "tiktok", limit: 600, spent: 176, roi: 0 },
];

const TRANSACTIONS = [
  { date: "24 مايو", platform: "google", desc: "إعلان بحث — باستا الرياض", amount: 320, isOver: true },
  { date: "23 مايو", platform: "instagram", desc: "ستوري رمضان — اليوم 15", amount: 86, isOver: false },
  { date: "22 مايو", platform: "google", desc: "إعلان بحث — باستا الرياض", amount: 310, isOver: false },
  { date: "21 مايو", platform: "snapchat", desc: "عروض نهاية الأسبوع", amount: 120, isOver: false },
  { date: "20 مايو", platform: "tiktok", desc: "فيديو تيك توك — إطلاق", amount: 176, isOver: false },
];

const CARDS = [
  { type: "فيزا", bank: "البنك الأهلي", last4: "4521", limit: 15000, isPrimary: true, color: "from-primary-500 to-blue-700" },
  { type: "ماستركارد", bank: "بنك الراجحي", last4: "8834", limit: 10000, isPrimary: false, color: "from-yellow-500 to-orange-500" },
];

// ===== OVERAGE BAR =====
function BudgetBar({ spent, limit, platformId }: { spent: number; limit: number; platformId: string }) {
  const pct = (spent / limit) * 100;
  const isOver = pct > 100;
  const normalPct = Math.min(pct, 100);
  const overPct = isOver ? ((spent - limit) / limit) * 100 : 0;

  const COLORS: Record<string, string> = {
    google: "#FF6B35", instagram: "#8B2FC9", snapchat: "#B8860B", tiktok: "#006E9E"
  };
  const color = COLORS[platformId] || "#1B4FFF";

  return (
    <div className="relative h-[6px] bg-gray-100 rounded-full overflow-visible">
      {/* Normal portion */}
      <div
        className="absolute top-0 right-0 h-full rounded-full"
        style={{ width: `${normalPct}%`, background: isOver ? "#FFD0C0" : color }}
      />
      {/* Over portion — hatched red */}
      {isOver && (
        <div
          className="absolute top-0 right-0 h-full rounded-r-full"
          style={{
            width: `${Math.min(overPct, 15)}%`,
            background: "repeating-linear-gradient(45deg,#FF4444,#FF4444 2px,#FF888855 2px,#FF888855 5px)",
            right: `${100 - Math.min(normalPct + overPct, 115)}%`,
          }}
        />
      )}
      {/* Limit marker */}
      <div className="absolute top-[-3px] left-0 w-[2px] h-[12px] bg-gray-600 rounded-sm" />
    </div>
  );
}

// ===== COMPONENT =====
export default function BudgetManagementPage() {
  const [platforms, setPlatforms] = useState(PLATFORMS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLimit, setEditLimit] = useState(0);

  const overageAmount = platforms.reduce((sum, p) => sum + Math.max(0, p.spent - p.limit), 0);
  const remaining = BUDGET_TOTAL - BUDGET_SPENT;

  function saveLimit(id: string) {
    setPlatforms((prev) => prev.map((p) => p.id === id ? { ...p, limit: editLimit } : p));
    setEditingId(null);
  }

  const overPlatforms = platforms.filter((p) => p.spent > p.limit);

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <TopNav currentClient={{ id: "1", name: "معك رونة" }} alertCount={3} user={{ name: "عمر", email: "omar@markiq.sa", role: "admin" }} />
      <Breadcrumb items={[
        { label: "لوحة التحكم", href: "/dashboard" },
        { label: "معك رونة", href: "/clients/1" },
        { label: "إدارة الميزانية" },
      ]} />
      <PageHeader
        title="إدارة الميزانية — معك رونة"
        subtitle="مايو 2026 — بطاقة العميل مرتبطة"
        actions={
          <>
            <Button variant="danger" icon={<PlayerPause size={11} />}>إيقاف طارئ</Button>
            <Button variant="outline" icon={<Receipt size={11} />}>تقرير</Button>
            <Button icon={<Edit size={11} />}>تعديل الميزانية</Button>
          </>
        }
      />

      <div className="p-4 max-w-[1100px] mx-auto space-y-4">

        {/* Alert Banner */}
        {overPlatforms.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3">
            <AlertTriangle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="text-sm font-semibold text-red-500 mb-1">
                تنبيه — تجاوز ميزانية {overPlatforms.map((p) => p.name).join(" و")}
              </div>
              <div className="text-xs text-red-700 mb-3">
                {overPlatforms.map((p) => (
                  `تجاوز ${p.name}: ${p.spent.toLocaleString()} ر.س من حد ${p.limit.toLocaleString()} ر.س (+${(p.spent - p.limit).toLocaleString()} ر.س)`
                )).join(" | ")}
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white rounded-lg text-[11px] font-medium hover:bg-red-600 transition-colors">
                  <PlayerPause size={11} /> إيقاف قوقل
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-500 text-white rounded-lg text-[11px] font-medium hover:bg-primary-600 transition-colors">
                  <Plus size={11} /> زيادة الحد 500 ر.س
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 text-gray-500 rounded-lg text-[11px] hover:border-gray-300 transition-colors">
                  تجاهل
                </button>
              </div>
            </div>
          </div>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-3">
          <KpiCard value={`${(BUDGET_TOTAL / 1000).toFixed(0)}K`} label="إجمالي الميزانية (ر.س)" icon={<Wallet size={13} />} iconColor="text-primary-500" iconBg="bg-primary-light" />
          <KpiCard value={`${(BUDGET_SPENT / 1000).toFixed(1)}K`} label="المنفق حتى الآن (ر.س)" change="61% من الميزانية" changeType="warn" icon={<CreditCard size={13} />} iconColor="text-yellow-700" iconBg="bg-yellow-50" />
          <KpiCard value={`${(remaining / 1000).toFixed(1)}K`} label="المتبقي (ر.س)" change="39% متاح" changeType="up" icon={<TrendingUp size={13} />} iconColor="text-green-600" iconBg="bg-green-50" />
          <KpiCard value={`+${overageAmount}`} label="تجاوز الحد (ر.س)" change="قوقل — يحتاج إجراء" changeType="down" icon={<AlertTriangle size={13} />} iconColor="text-red-500" iconBg="bg-red-50" />
        </div>

        {/* Budget Distribution */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <CardHeader title="توزيع الميزانية على المنصات" icon={<Wallet size={14} />} />
            <Button variant="outline" size="sm" icon={<Edit size={10} />}>تعديل التوزيع</Button>
          </div>

          {/* Main bar */}
          <div className="mb-5 pb-4 border-b border-gray-100">
            <div className="flex justify-between text-[10px] text-gray-500 mb-1.5">
              <span>الإجمالي المنفق</span>
              <span className="font-medium">61% مستهلك</span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: "61%", background: "linear-gradient(90deg, #1B4FFF, #4B7FFF)" }}
              />
            </div>
            <div className="flex justify-between mt-1.5 text-[11px]">
              <span className="text-primary-500 font-medium">{BUDGET_SPENT.toLocaleString()} ر.س منفق</span>
              <span className="text-green-600 font-medium">{remaining.toLocaleString()} ر.س متبقي</span>
              <span className="text-gray-400">من {BUDGET_TOTAL.toLocaleString()} ر.س</span>
            </div>
          </div>

          {/* Platform rows */}
          {platforms.map((p) => {
            const pct = (p.spent / p.limit) * 100;
            const isOver = pct > 100;
            const isEditing = editingId === p.id;

            return (
              <div key={p.id} className={`flex items-center gap-3 py-3 border-b border-gray-100 last:border-0 ${isOver ? "bg-red-50/30 -mx-1 px-1 rounded-lg" : ""}`}>
                <PlatformIcon platform={p.platform} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-medium text-gray-800">{p.name}</span>
                    <div className="flex items-center gap-1.5">
                      {isOver && (
                        <span className="flex items-center gap-1 text-[9px] bg-red-50 text-red-500 border border-red-200 px-1.5 py-0.5 rounded-full">
                          <AlertTriangle size={9} /> تجاوز الحد!
                        </span>
                      )}
                      <span className={`text-[10px] font-semibold ${isOver ? "text-red-500" : "text-primary-500"}`}>
                        {pct.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <BudgetBar spent={p.spent} limit={p.limit} platformId={p.id} />
                  <div className="flex justify-between mt-1.5 text-[10px]">
                    <span className={isOver ? "text-red-500 font-medium" : "text-gray-500"}>
                      {p.spent.toLocaleString()} ر.س منفق
                      {isOver && ` (+${(p.spent - p.limit).toLocaleString()} تجاوز)`}
                    </span>
                    <span className="text-gray-400">الحد: {p.limit.toLocaleString()} ر.س</span>
                  </div>
                </div>

                {/* ROI */}
                <div className={`text-xs font-semibold w-14 text-center flex-shrink-0 ${p.roi >= 3 ? "text-green-600" : p.roi >= 1.5 ? "text-yellow-700" : "text-gray-400"}`}>
                  {p.roi > 0 ? `${p.roi}x` : "جديد"}
                </div>

                {/* Actions */}
                <div className="flex gap-1 flex-shrink-0">
                  {isEditing ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={editLimit}
                        onChange={(e) => setEditLimit(Number(e.target.value))}
                        className="w-20 px-2 py-1 text-[11px] border border-primary-400 rounded focus:outline-none"
                      />
                      <button onClick={() => saveLimit(p.id)} className="w-6 h-6 bg-green-500 rounded flex items-center justify-center text-white">
                        <span className="text-[10px]">✓</span>
                      </button>
                      <button onClick={() => setEditingId(null)} className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center text-gray-500">
                        <span className="text-[10px]">✕</span>
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => { setEditingId(p.id); setEditLimit(p.limit); }}
                        className="w-7 h-7 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:border-primary-400 hover:text-primary-500"
                      >
                        <Edit size={11} />
                      </button>
                      <button className={`w-7 h-7 rounded-lg border flex items-center justify-center ${isOver ? "border-red-200 bg-red-50 text-red-400 hover:bg-red-100" : "border-gray-200 bg-white text-gray-400 hover:border-gray-300"}`}>
                        <PlayerPause size={11} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </Card>

        <div className="grid grid-cols-2 gap-4">
          {/* Cards */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <CardHeader title="البطاقات المرتبطة" icon={<CreditCard size={14} />} />
              <Button variant="outline" size="sm" icon={<Plus size={10} />}>ربط بطاقة</Button>
            </div>
            {CARDS.map((card, i) => (
              <div key={i} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
                <div className={`w-12 h-8 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center flex-shrink-0`}>
                  <CreditCard size={14} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-gray-800">{card.type} — {card.bank}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5 font-mono">•••• •••• •••• {card.last4}</div>
                </div>
                <div className="text-[10px] text-gray-500 flex-shrink-0">{card.limit.toLocaleString()} ر.س</div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border flex-shrink-0 ${card.isPrimary ? "bg-green-50 text-green-600 border-green-200" : "bg-gray-100 text-gray-500 border-gray-200"}`}>
                  {card.isPrimary ? "رئيسية" : "احتياطية"}
                </span>
              </div>
            ))}
          </Card>

          {/* Transactions */}
          <Card>
            <CardHeader title="آخر المعاملات" icon={<Receipt size={14} />} action="عرض الكل" />
            {TRANSACTIONS.map((t, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0">
                <PlatformIcon platform={t.platform} />
                <div className="flex-1 min-w-0">
                  <div className="text-[11.5px] text-gray-700 truncate">{t.desc}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{t.date}</div>
                </div>
                <div className={`text-xs font-semibold flex-shrink-0 ${t.isOver ? "text-red-500" : "text-gray-700"}`}>
                  {t.amount} ر.س
                </div>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full border flex-shrink-0 ${t.isOver ? "bg-red-50 text-red-500 border-red-200" : "bg-green-50 text-green-600 border-green-200"}`}>
                  {t.isOver ? "تجاوز" : "مكتمل"}
                </span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

// Missing components


