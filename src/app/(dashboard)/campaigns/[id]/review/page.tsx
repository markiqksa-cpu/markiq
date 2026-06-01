"use client";

import { useState } from "react";
import {
  RefreshCw, CheckSquare, Check, X, Edit, Eye,
  AlertCircle, CheckCircle, Clock
} from "lucide-react";
import TopNav from "@/components/layout/TopNav";
import Breadcrumb from "@/components/layout/Breadcrumb";
import PageHeader from "@/components/layout/PageHeader";
import { Button, Badge, PlatformIcon } from "@/components/ui";

// ===== TYPES =====
type ContentStatus = "pending" | "approved" | "rejected";

interface ContentItem {
  id: string;
  platform: string;
  name: string;
  preview: string;
  type: string;
  time: string;
  status: ContentStatus;
  caption: string;
  hashtags: string[];
  client: string;
  budget: number;
  aiScore: Record<string, string>;
  expectedReach: number;
}

// ===== MOCK DATA =====
const MOCK_CONTENT: ContentItem[] = [
  {
    id: "1", platform: "instagram", name: "ستوري رمضان — اليوم 1",
    preview: "🌙 رمضان كريم! جرّب باستا معك رونة...",
    type: "صورة + كابشن", time: "اليوم، 12:00 م", status: "pending",
    caption: "🌙 رمضان كريم من معك رونة!\nاستمتع بأشهى الباستا الكريمية في ليالي رمضان — توصيل سريع لحيك 🍝✨\nاطلب الحين وأول طلب بتوصيل مجاني!",
    hashtags: ["#معك_رونة", "#باستا_الرياض", "#رمضان_كريم", "#توصيل_سريع"],
    client: "معك رونة", budget: 150,
    aiScore: { "جودة الكابشن": "ممتاز ✓", "الهاشتاقات": "مرتفع ✓", "وقت النشر": "مثالي ✓", "اللهجة": "سعودية ✓", "توقع التفاعل": "مرتفع" },
    expectedReach: 4200,
  },
  {
    id: "2", platform: "snapchat", name: "عرض نهاية الأسبوع",
    preview: "خصم 20% على كل طلباتك هالأسبوع...",
    type: "فيديو قصير", time: "الجمعة، 7:00 م", status: "pending",
    caption: "⚡ عرض محدود — خصم 20% على كل طلباتك هالأسبوع من معك رونة!\nمو بس كذا، التوصيل مجاني فوق 50 ريال 🎉",
    hashtags: ["#معك_رونة", "#عرض_اليوم", "#توصيل_مجاني"],
    client: "معك رونة", budget: 200,
    aiScore: { "جودة الكابشن": "جيد ✓", "الهاشتاقات": "مناسب ✓", "وقت النشر": "جيد ✓", "اللهجة": "سعودية ✓", "توقع التفاعل": "متوسط" },
    expectedReach: 3100,
  },
  {
    id: "3", platform: "google", name: "إعلان بحث — باستا توصيل",
    preview: "أطيب باستا في الرياض — توصيل سريع...",
    type: "نص إعلاني", time: "دائم", status: "pending",
    caption: "أطيب باستا في الرياض | معك رونة | توصيل سريع لحيك | اطلب الحين",
    hashtags: [],
    client: "معك رونة", budget: 300,
    aiScore: { "جودة النص": "ممتاز ✓", "الكلمات المفتاحية": "مرتفع ✓", "CTA": "واضح ✓", "الطول": "مثالي ✓", "توقع النقر": "مرتفع" },
    expectedReach: 8500,
  },
  {
    id: "4", platform: "instagram", name: "ريلز — طريقة التحضير",
    preview: "شوف كيف نحضر الباستا الكريمية...",
    type: "فيديو ريلز", time: "السبت، 9:00 م", status: "approved",
    caption: "🍝 شوف كيف نحضر باستاتنا الكريمية من الصفر!\nكل المكونات طازجة، والطعم ما في مثيله 😍",
    hashtags: ["#معك_رونة", "#باستا", "#طبخ", "#مطعم_الرياض"],
    client: "معك رونة", budget: 180,
    aiScore: { "جودة المحتوى": "ممتاز ✓", "الهاشتاقات": "مرتفع ✓", "وقت النشر": "مثالي ✓", "اللهجة": "سعودية ✓", "توقع التفاعل": "مرتفع جداً" },
    expectedReach: 6800,
  },
  {
    id: "5", platform: "tiktok", name: "تيك توك — طبق اليوم",
    preview: "طبقنا الجديد وصل! باستا كريمية...",
    type: "فيديو قصير", time: "الأحد، 1:00 م", status: "approved",
    caption: "طبقنا الجديد وصل! 🔥 الباستا الكريمية الخاصة من معك رونة — جربها وقولنا رأيك!",
    hashtags: ["#معك_رونة", "#باستا_كريمية", "#جديد", "#فود"],
    client: "معك رونة", budget: 150,
    aiScore: { "جودة المحتوى": "جيد ✓", "الهاشتاقات": "جيد ✓", "وقت النشر": "جيد ✓", "اللهجة": "سعودية ✓", "توقع التفاعل": "متوسط" },
    expectedReach: 5200,
  },
];

const FILTERS = [
  { id: "all", label: "الكل", count: 5 },
  { id: "pending", label: "قيد المراجعة", count: 3 },
  { id: "approved", label: "معتمد", count: 2 },
  { id: "rejected", label: "مرفوض", count: 0 },
];

const STATUS_CONFIG = {
  pending: { label: "قيد المراجعة", color: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-200", dot: "bg-yellow-400" },
  approved: { label: "معتمد", color: "text-green-600", bg: "bg-green-50", border: "border-green-200", dot: "bg-green-500" },
  rejected: { label: "مرفوض", color: "text-red-500", bg: "bg-red-50", border: "border-red-200", dot: "bg-red-500" },
};

// ===== COMPONENT =====
export default function ContentReviewPage() {
  const [content, setContent] = useState<ContentItem[]>(MOCK_CONTENT);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedId, setSelectedId] = useState("1");
  const [editingCaption, setEditingCaption] = useState(false);
  const [editedCaption, setEditedCaption] = useState("");

  const filtered = activeFilter === "all"
    ? content
    : content.filter((c) => c.status === activeFilter);

  const selected = content.find((c) => c.id === selectedId)!;

  function updateStatus(id: string, status: ContentStatus) {
    setContent((prev) => prev.map((c) => c.id === id ? { ...c, status } : c));
    if (status === "approved" || status === "rejected") {
      const next = content.find((c) => c.id !== id && c.status === "pending");
      if (next) setSelectedId(next.id);
    }
  }

  function approveAll() {
    setContent((prev) => prev.map((c) => c.status === "pending" ? { ...c, status: "approved" } : c));
  }

  function startEdit() {
    setEditedCaption(selected.caption);
    setEditingCaption(true);
  }

  function saveEdit() {
    setContent((prev) => prev.map((c) => c.id === selectedId ? { ...c, caption: editedCaption } : c));
    setEditingCaption(false);
  }

  const pendingCount = content.filter((c) => c.status === "pending").length;

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <TopNav
        currentClient={{ id: "1", name: "معك رونة" }}
        alertCount={pendingCount}
        user={{ name: "عمر", email: "omar@markiq.sa", role: "admin" }}
      />
      <Breadcrumb items={[
        { label: "لوحة التحكم", href: "/dashboard" },
        { label: "الحملات", href: "/campaigns" },
        { label: "مراجعة المحتوى" },
      ]} />
      <PageHeader
        title="مراجعة المحتوى — معك رونة"
        subtitle={`${pendingCount} منشورات تنتظر موافقتك قبل النشر`}
        actions={
          <>
            <Button variant="outline" icon={<RefreshCw size={11} />}>إعادة التوليد</Button>
            <Button variant="success" icon={<CheckSquare size={11} />} onClick={approveAll}>اعتماد الكل</Button>
          </>
        }
      />

      {/* Filter Bar */}
      <div className="bg-white border-b border-gray-200 px-5 py-2 flex gap-2 items-center">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] border transition-colors ${
              activeFilter === f.id
                ? "bg-primary-500 text-white border-primary-500"
                : "border-gray-200 text-gray-500 hover:border-gray-300"
            }`}
          >
            {f.label}
            {f.count > 0 && (
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                activeFilter === f.id ? "bg-white/30 text-white" : "bg-red-500 text-white"
              }`}>{f.count}</span>
            )}
          </button>
        ))}
        <span className="mr-auto text-[10px] text-gray-400">حملة رمضان — معك رونة</span>
      </div>

      <div className="p-4 max-w-[1200px] mx-auto space-y-4">

        {/* Content List */}
        <div className="space-y-2">
          {/* Pending group */}
          {filtered.some((c) => c.status === "pending") && (
            <>
              <div className="text-[10px] text-gray-400 font-medium flex items-center gap-2 py-1">
                قيد المراجعة
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              {filtered.filter((c) => c.status === "pending").map((item) => (
                <ContentListItem
                  key={item.id}
                  item={item}
                  isSelected={selectedId === item.id}
                  onClick={() => setSelectedId(item.id)}
                />
              ))}
            </>
          )}

          {/* Approved/Rejected group */}
          {filtered.some((c) => c.status !== "pending") && (
            <>
              <div className="text-[10px] text-gray-400 font-medium flex items-center gap-2 py-1 mt-2">
                معتمد / مرفوض
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              {filtered.filter((c) => c.status !== "pending").map((item) => (
                <ContentListItem
                  key={item.id}
                  item={item}
                  isSelected={selectedId === item.id}
                  onClick={() => setSelectedId(item.id)}
                />
              ))}
            </>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Selected Preview */}
        {selected && (
          <div className="space-y-4">
            {/* Preview Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <PlatformIcon platform={selected.platform} />
                <span className="text-sm font-semibold text-gray-800">{selected.name}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${STATUS_CONFIG[selected.status].bg} ${STATUS_CONFIG[selected.status].color} border ${STATUS_CONFIG[selected.status].border}`}>
                  {STATUS_CONFIG[selected.status].label}
                </span>
              </div>
              <div className="flex gap-2">
                {selected.status === "pending" && (
                  <>
                    <button
                      onClick={() => updateStatus(selected.id, "rejected")}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-500 border border-red-200 rounded-lg text-[11px] hover:bg-red-100 transition-colors"
                    >
                      <X size={11} /> رفض
                    </button>
                    <Button variant="outline" icon={<Edit size={11} />} onClick={startEdit}>تعديل</Button>
                    <button
                      onClick={() => updateStatus(selected.id, "approved")}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 border border-green-200 rounded-lg text-[11px] font-medium hover:bg-green-100 transition-colors"
                    >
                      <Check size={11} /> اعتماد
                    </button>
                  </>
                )}
                {selected.status === "approved" && (
                  <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg">
                    <CheckCircle size={12} /> معتمد — جاهز للنشر
                  </div>
                )}
                {selected.status === "rejected" && (
                  <button
                    onClick={() => updateStatus(selected.id, "pending")}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-600 border border-gray-200 rounded-lg text-[11px] hover:border-primary-500 transition-colors"
                  >
                    <RefreshCw size={11} /> إعادة للمراجعة
                  </button>
                )}
              </div>
            </div>

            {/* Post Mock */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              {/* Post Header */}
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100">
                <div className="w-7 h-7 rounded-full bg-primary-light flex items-center justify-center text-[11px] font-semibold text-primary-500">مر</div>
                <div>
                  <div className="text-xs font-semibold text-gray-800">معك رونة</div>
                  <div className="text-[10px] text-gray-400">@ma3ak_rona</div>
                </div>
                <div className="mr-auto text-[10px] text-gray-400 capitalize">{selected.platform} · {selected.type}</div>
              </div>

              {/* Image placeholder */}
              <div className="h-40 bg-gradient-to-br from-primary-light to-blue-100 flex items-center justify-center border-b border-gray-100">
                <div className="text-center text-gray-400">
                  <Eye size={32} className="mx-auto mb-1 opacity-30" />
                  <div className="text-xs opacity-50">معاينة الصورة / الفيديو</div>
                </div>
              </div>

              {/* Caption */}
              <div className="px-4 py-3">
                <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line mb-2">{selected.caption}</p>
                {selected.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {selected.hashtags.map((h, i) => (
                      <span key={i} className="text-[11px] text-primary-500">{h}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Post Footer */}
              <div className="px-4 py-2 border-t border-gray-100 flex gap-4">
                <div className="flex items-center gap-1 text-[10px] text-gray-400">
                  <Clock size={11} /> {selected.time}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-gray-400">
                  <Eye size={11} /> متوقع: {selected.expectedReach.toLocaleString()} مشاهدة
                </div>
                <div className="flex items-center gap-1 text-[10px] text-gray-400">
                  💰 {selected.budget} ر.س
                </div>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border border-gray-200 rounded-xl p-3">
                <div className="text-[11px] font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                  <AlertCircle size={13} className="text-primary-500" /> تفاصيل المنشور
                </div>
                {[
                  ["المنصة", selected.platform],
                  ["نوع المحتوى", selected.type],
                  ["وقت النشر", selected.time],
                  ["الميزانية", `${selected.budget} ر.س`],
                ].map(([lbl, val], i) => (
                  <div key={i} className="flex justify-between py-1 border-b border-gray-100 last:border-0 text-xs">
                    <span className="text-gray-400">{lbl}</span>
                    <span className="text-gray-700 font-medium capitalize">{val}</span>
                  </div>
                ))}
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-3">
                <div className="text-[11px] font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                  <AlertCircle size={13} className="text-primary-500" /> تقييم الذكاء الاصطناعي
                </div>
                {Object.entries(selected.aiScore).map(([key, val], i) => (
                  <div key={i} className="flex justify-between py-1 border-b border-gray-100 last:border-0 text-xs">
                    <span className="text-gray-400">{key}</span>
                    <span className={val.includes("مرتفع") || val.includes("ممتاز") || val.includes("مثالي") || val.includes("واضح") ? "text-green-600 font-medium" : "text-primary-500 font-medium"}>
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Caption Editor */}
            <div className="bg-white border border-gray-200 rounded-xl p-3">
              <div className="text-[11px] font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                <Edit size={13} className="text-primary-500" /> تعديل الكابشن
              </div>
              {editingCaption ? (
                <>
                  <textarea
                    value={editedCaption}
                    onChange={(e) => setEditedCaption(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-primary-400 rounded-lg text-xs bg-gray-50 focus:outline-none resize-none leading-relaxed"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[10px] text-green-500">✓ لهجة سعودية &nbsp; ✓ CTA واضح</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingCaption(false)}>إلغاء</Button>
                      <Button size="sm" onClick={saveEdit}>حفظ التعديل</Button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line bg-gray-50 rounded-lg px-3 py-2 mb-2">
                    {selected.caption}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-green-500">✓ لهجة سعودية &nbsp; ✓ هاشتاقات مناسبة &nbsp; ✓ CTA واضح</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" icon={<Edit size={10} />} onClick={startEdit}>تعديل</Button>
                      <Button variant="outline" size="sm" icon={<RefreshCw size={10} />}>إعادة توليد</Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ===== LIST ITEM COMPONENT =====
function ContentListItem({
  item, isSelected, onClick
}: { item: ContentItem; isSelected: boolean; onClick: () => void }) {
  const st = STATUS_CONFIG[item.status];
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
        isSelected ? "border-primary-400 bg-primary-light" : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <PlatformIcon platform={item.platform} />
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium text-gray-800 mb-0.5">{item.name}</div>
        <div className="text-[10px] text-gray-500 truncate">{item.preview}</div>
        <div className="flex gap-1.5 mt-1">
          <span className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">{item.type}</span>
          <span className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">{item.time}</span>
        </div>
      </div>
      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${st.dot}`} />
    </div>
  );
}

// Missing variant
declare module "@/components/ui" {
  interface ButtonProps {
    variant?: "primary" | "outline" | "ghost" | "danger" | "success";
  }
}
