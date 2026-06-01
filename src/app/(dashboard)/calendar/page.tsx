"use client";

import { useState } from "react";
import {
  ChevronLeft, ChevronRight, Plus, List, Calendar
} from "lucide-react";
import TopNav from "@/components/layout/TopNav";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { Button, PlatformIcon } from "@/components/ui";

// ===== TYPES =====
interface CalEvent {
  id: string; platform: string; name: string; client: string;
  time: string; status: "approved" | "pending" | "active" | "setup";
  lineColor: string;
}

// ===== EVENTS DATA =====
const EVENTS: Record<string, CalEvent[]> = {
  "2026-5-1": [{ id: "e1", platform: "instagram", name: "ستوري رمضان", client: "معك رونة", time: "12:00 م", status: "approved", lineColor: "#8B2FC9" }],
  "2026-5-3": [{ id: "e2", platform: "google", name: "إعلان بحث", client: "معك رونة", time: "9:00 ص", status: "active", lineColor: "#FF6B35" }],
  "2026-5-5": [
    { id: "e3", platform: "instagram", name: "ريلز باستا", client: "معك رونة", time: "7:00 م", status: "approved", lineColor: "#8B2FC9" },
    { id: "e4", platform: "snapchat", name: "عرض سناب", client: "نخبة صالون", time: "9:00 م", status: "pending", lineColor: "#B8860B" },
  ],
  "2026-5-8": [{ id: "e5", platform: "instagram", name: "حملة صحة بلس", client: "صحة بلس", time: "10:00 ص", status: "active", lineColor: "#1B4FFF" }],
  "2026-5-10": [
    { id: "e6", platform: "google", name: "إعلان بحث", client: "معك رونة", time: "8:00 ص", status: "active", lineColor: "#FF6B35" },
    { id: "e7", platform: "instagram", name: "ستوري أسبوعي", client: "معك رونة", time: "12:00 م", status: "approved", lineColor: "#8B2FC9" },
  ],
  "2026-5-12": [{ id: "e8", platform: "tiktok", name: "فيديو تيك توك", client: "معك رونة", time: "3:00 م", status: "setup", lineColor: "#006E9E" }],
  "2026-5-14": [{ id: "e9", platform: "snapchat", name: "عرض نهاية الأسبوع", client: "نخبة صالون", time: "7:00 م", status: "approved", lineColor: "#B8860B" }],
  "2026-5-15": [
    { id: "e10", platform: "instagram", name: "ريلز جديد", client: "معك رونة", time: "1:00 م", status: "pending", lineColor: "#8B2FC9" },
    { id: "e11", platform: "google", name: "إعلان بحث", client: "معك رونة", time: "9:00 ص", status: "active", lineColor: "#FF6B35" },
    { id: "e12", platform: "instagram", name: "مناسبة وطنية", client: "جميع", time: "طوال اليوم", status: "approved", lineColor: "#00A86B" },
  ],
  "2026-5-19": [{ id: "e13", platform: "instagram", name: "ستوري صحة بلس", client: "صحة بلس", time: "12:00 م", status: "approved", lineColor: "#8B2FC9" }],
  "2026-5-21": [
    { id: "e14", platform: "snapchat", name: "عرض سناب", client: "نخبة صالون", time: "7:00 م", status: "approved", lineColor: "#B8860B" },
    { id: "e15", platform: "tiktok", name: "فيديو تيك", client: "معك رونة", time: "9:00 م", status: "setup", lineColor: "#006E9E" },
  ],
  "2026-5-23": [{ id: "e16", platform: "google", name: "إعلان بحث", client: "معك رونة", time: "9:00 ص", status: "active", lineColor: "#FF6B35" }],
  "2026-5-24": [
    { id: "e17", platform: "instagram", name: "ستوري رمضان", client: "معك رونة", time: "12:00 م", status: "approved", lineColor: "#8B2FC9" },
    { id: "e18", platform: "snapchat", name: "عرض سناب", client: "صحة بلس", time: "7:00 م", status: "pending", lineColor: "#B8860B" },
  ],
  "2026-5-25": [
    { id: "e19", platform: "instagram", name: "ستوري رمضان — اليوم 1", client: "معك رونة", time: "12:00 م", status: "pending", lineColor: "#8B2FC9" },
    { id: "e20", platform: "google", name: "إعلان بحث — باستا الرياض", client: "معك رونة", time: "3:00 م", status: "active", lineColor: "#FF6B35" },
    { id: "e21", platform: "snapchat", name: "عروض نهاية الأسبوع", client: "نخبة صالون", time: "7:00 م", status: "approved", lineColor: "#B8860B" },
  ],
  "2026-5-26": [{ id: "e22", platform: "instagram", name: "حملة عيد الأضحى", client: "جميع", time: "10:00 ص", status: "setup", lineColor: "#1B4FFF" }],
  "2026-5-28": [{ id: "e23", platform: "instagram", name: "ريلز جديد", client: "معك رونة", time: "7:00 م", status: "approved", lineColor: "#8B2FC9" }],
  "2026-5-30": [{ id: "e24", platform: "instagram", name: "نهاية رمضان", client: "جميع", time: "طوال اليوم", status: "approved", lineColor: "#00A86B" }],
  "2026-5-31": [{ id: "e25", platform: "instagram", name: "حملة ختامية رمضان", client: "جميع", time: "12:00 م", status: "setup", lineColor: "#1B4FFF" }],
};

const SAUDI_OCCASIONS = [
  { date: "2026-5-25", name: "يوم الأسرة السعودية", rec: "محتوى عائلي" },
  { date: "2026-5-31", name: "نهاية موسم رمضان", rec: "حملة ختامية" },
  { date: "2026-6-5", name: "عيد الأضحى المبارك", rec: "ابدأ الإعداد الآن" },
];

const STATUS_COLORS = {
  approved: { dot: "bg-green-500", label: "معتمد" },
  pending: { dot: "bg-yellow-400", label: "قيد المراجعة" },
  active: { dot: "bg-green-500", label: "نشط" },
  setup: { dot: "bg-primary-500", label: "قيد الإعداد" },
};

const MONTHS = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
const DAYS = ["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"];

// ===== COMPONENT =====
export default function CampaignCalendarPage() {
  const [month, setMonth] = useState(4); // May
  const [year, setYear] = useState(2026);
  const [selectedDay, setSelectedDay] = useState<number | null>(25);
  const [clientFilter, setClientFilter] = useState("جميع العملاء");

  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  function changeMonth(dir: number) {
    let m = month + dir;
    let y = year;
    if (m > 11) { m = 0; y++; }
    if (m < 0) { m = 11; y--; }
    setMonth(m);
    setYear(y);
    setSelectedDay(null);
  }

  const selectedKey = selectedDay ? `${year}-${month + 1}-${selectedDay}` : null;
  const selectedEvents = selectedKey ? (EVENTS[selectedKey] || []) : [];
  const selectedDayName = selectedDay ? DAYS[new Date(year, month, selectedDay).getDay()] : null;

  // Build calendar cells
  const cells: Array<{ day: number; isCurrentMonth: boolean; isToday: boolean }> = [];
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: daysInPrev - i, isCurrentMonth: false, isToday: false });
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, isCurrentMonth: true, isToday: d === 25 && month === 4 && year === 2026 });
  }
  while (cells.length % 7 !== 0) cells.push({ day: cells.length - firstDay - daysInMonth + 1, isCurrentMonth: false, isToday: false });

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <TopNav alertCount={3} user={{ name: "عمر", email: "omar@markiq.sa", role: "admin" }} />
      <Breadcrumb items={[
        { label: "لوحة التحكم", href: "/dashboard" },
        { label: "التقويم" },
      ]} />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-gray-800">تقويم الحملات</div>
          <div className="text-[11px] text-gray-500 mt-0.5">{MONTHS[month]} {year} — جميع العملاء</div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" icon={<List size={11} />}>عرض قائمة</Button>
          <Button icon={<Plus size={11} />}>منشور جديد</Button>
        </div>
      </div>

      {/* Filter + Month Nav */}
      <div className="bg-white border-b border-gray-200 px-5 py-2 flex items-center gap-3 flex-wrap">
        <div className="flex gap-1.5">
          {["الشهر", "الأسبوع", "اليوم"].map((v) => (
            <button key={v} className={`px-3 py-1.5 rounded-full text-[11px] border transition-colors ${v === "الشهر" ? "bg-primary-500 text-white border-primary-500" : "border-gray-200 text-gray-500"}`}>{v}</button>
          ))}
        </div>
        <select value={clientFilter} onChange={(e) => setClientFilter(e.target.value)} className="text-[11px] px-2.5 py-1.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 focus:outline-none">
          {["جميع العملاء", "معك رونة", "صحة بلس", "نخبة صالون"].map((c) => <option key={c}>{c}</option>)}
        </select>
        <div className="mr-auto flex items-center gap-2">
          <button onClick={() => changeMonth(-1)} className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:border-primary-400">
            <ChevronRight size={14} />
          </button>
          <span className="text-xs font-medium text-gray-800 min-w-[80px] text-center">{MONTHS[month]} {year}</span>
          <button onClick={() => changeMonth(1)} className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:border-primary-400">
            <ChevronLeft size={14} />
          </button>
        </div>
      </div>

      <div className="p-4 max-w-[1200px] mx-auto space-y-4">

        {/* Legend */}
        <div className="flex gap-4 flex-wrap">
          {[
            { color: "bg-purple-500", label: "انستقرام" },
            { color: "bg-yellow-600", label: "سناب شات" },
            { color: "bg-orange-500", label: "قوقل" },
            { color: "bg-blue-600", label: "تيك توك" },
            { color: "bg-primary-500", label: "متعدد المنصات" },
            { color: "bg-green-500", label: "مناسبة سعودية" },
          ].map((l, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[10px] text-gray-500">
              <div className={`w-2.5 h-2.5 rounded-full ${l.color}`} />
              {l.label}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {/* Day Names */}
          <div className="grid grid-cols-7 border-b border-gray-200">
            {DAYS.map((d, i) => (
              <div key={d} className={`py-2 text-center text-[10px] font-medium bg-gray-50 ${i >= 5 ? "text-primary-500" : "text-gray-500"}`}>
                {d}
              </div>
            ))}
          </div>

          {/* Cells */}
          <div className="grid grid-cols-7" style={{ gridAutoRows: "90px" }}>
            {cells.map((cell, idx) => {
              if (!cell.isCurrentMonth) {
                return (
                  <div key={idx} className="border-l border-b border-gray-100 p-1.5 opacity-30">
                    <div className="text-[11px] text-gray-400">{cell.day}</div>
                  </div>
                );
              }

              const key = `${year}-${month + 1}-${cell.day}`;
              const dayEvents = EVENTS[key] || [];
              const isSelected = selectedDay === cell.day;
              const occasion = SAUDI_OCCASIONS.find((o) => o.date === `${year}-${month < 9 ? "0" : ""}${month + 1}-${cell.day < 10 ? "0" : ""}${cell.day}`);

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDay(cell.day)}
                  className={`border-l border-b border-gray-100 p-1.5 cursor-pointer overflow-hidden flex flex-col transition-colors ${
                    cell.isToday ? "bg-primary-light/50" :
                    isSelected ? "bg-primary-light outline outline-2 outline-primary-400 outline-offset-[-2px]" :
                    "hover:bg-gray-50"
                  }`}
                >
                  {/* Day number */}
                  <div className={`text-[11px] font-medium mb-1 flex-shrink-0 ${
                    cell.isToday
                      ? "w-5 h-5 bg-primary-500 text-white rounded-full flex items-center justify-center text-[10px]"
                      : "text-gray-700"
                  }`}>
                    {cell.day}
                  </div>

                  {/* Occasion dot */}
                  {occasion && (
                    <div className="text-[8px] text-green-600 bg-green-50 px-1 py-0.5 rounded mb-0.5 truncate flex-shrink-0">
                      🌟 {occasion.name}
                    </div>
                  )}

                  {/* Events */}
                  <div className="flex-1 overflow-hidden space-y-0.5">
                    {dayEvents.slice(0, 2).map((ev) => (
                      <div
                        key={ev.id}
                        className="flex items-center gap-1 text-[8.5px] truncate leading-tight"
                        style={{ color: ev.lineColor }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: ev.lineColor }} />
                        <span className="truncate">{ev.name}</span>
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-[8px] text-primary-500">+{dayEvents.length - 2} أخرى</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Schedule */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="text-xs font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Calendar size={14} className="text-primary-500" />
            {selectedDay && selectedDayName
              ? `${selectedDayName} ${selectedDay} ${MONTHS[month]} ${year}`
              : "اختر يوماً لعرض جدوله"
            }
          </div>

          {!selectedDay && (
            <div className="text-center py-8 text-gray-400 text-xs">
              اضغط على أي يوم في التقويم لعرض منشوراته
            </div>
          )}

          {selectedDay && selectedEvents.length === 0 && (
            <div className="text-center py-8">
              <Calendar size={28} className="mx-auto mb-2 text-gray-300" />
              <div className="text-xs text-gray-400 mb-3">لا توجد منشورات مجدولة لهذا اليوم</div>
              <Button icon={<Plus size={11} />} size="sm">إضافة منشور</Button>
            </div>
          )}

          {selectedDay && selectedEvents.length > 0 && (
            <div className="space-y-0">
              {selectedEvents.map((ev) => {
                const st = STATUS_COLORS[ev.status];
                return (
                  <div key={ev.id} className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0">
                    <div className="text-[10px] text-gray-400 w-14 flex-shrink-0">{ev.time}</div>
                    <div className="w-0.5 h-8 rounded-full flex-shrink-0" style={{ background: ev.lineColor }} />
                    <PlatformIcon platform={ev.platform} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-800 truncate">{ev.name} — {ev.client}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                        <span className="text-[10px] text-gray-400">{st.label}</span>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button className="w-6 h-6 rounded border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-400 hover:border-primary-400 text-[10px]">👁</button>
                      <button className="w-6 h-6 rounded border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-400 hover:border-primary-400 text-[10px]">✏️</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Saudi Occasions */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="text-xs font-semibold text-green-700 mb-3 flex items-center gap-2">
            🌟 المناسبات السعودية — مايو / يونيو 2026
          </div>
          <div className="space-y-0">
            {SAUDI_OCCASIONS.map((occ, i) => {
              const d = new Date(occ.date);
              return (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-green-100 last:border-0 text-xs">
                  <span className="text-green-700 font-medium w-16 flex-shrink-0">
                    {d.getDate()} {MONTHS[d.getMonth()]}
                  </span>
                  <span className="text-gray-700 flex-1">{occ.name}</span>
                  <span className="text-[10px] text-green-600 bg-white px-2 py-0.5 rounded-full border border-green-200 flex-shrink-0">
                    {occ.rec}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
