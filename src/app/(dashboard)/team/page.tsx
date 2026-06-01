"use client";

import { useState } from "react";
import {
  Users, Wifi, ListChecks, Building2,
  UserPlus, Download, X, Check, Edit, MoreVertical
} from "lucide-react";
import TopNav from "@/components/layout/TopNav";
import Breadcrumb from "@/components/layout/Breadcrumb";
import PageHeader from "@/components/layout/PageHeader";
import { Button, Card, CardHeader, KpiCard, Badge } from "@/components/ui";

// ===== TYPES =====
interface TeamMember {
  id: string; name: string; email: string;
  role: string; roleKey: string;
  clients: string; tasks: number;
  status: "online" | "away" | "offline";
  color: string; initials: string;
}

interface LogEntry { member: string; action: string; time: string; color: string; initials: string }

// ===== MOCK DATA =====
const TEAM: TeamMember[] = [
  { id: "1", name: "عمر", email: "omar@markiq.sa", role: "مدير عام", roleKey: "admin", clients: "جميع العملاء", tasks: 0, status: "online", color: "bg-primary-light text-primary-500", initials: "ع" },
  { id: "2", name: "سارة الأحمد", email: "sara@markiq.sa", role: "مدير حملات", roleKey: "campaign_manager", clients: "4 عملاء", tasks: 7, status: "online", color: "bg-purple-50 text-purple-600", initials: "سا" },
  { id: "3", name: "محمد الحربي", email: "mohammed@markiq.sa", role: "متخصص محتوى", roleKey: "content_specialist", clients: "5 عملاء", tasks: 6, status: "online", color: "bg-green-50 text-green-600", initials: "مح" },
  { id: "4", name: "نورة العتيبي", email: "noura@markiq.sa", role: "محلل بيانات", roleKey: "data_analyst", clients: "3 عملاء", tasks: 3, status: "away", color: "bg-yellow-50 text-yellow-700", initials: "نو" },
  { id: "5", name: "خالد الشمري", email: "khalid@markiq.sa", role: "متخصص إعلانات", roleKey: "ads_specialist", clients: "2 عملاء", tasks: 2, status: "offline", color: "bg-pink-50 text-pink-600", initials: "خا" },
];

const PERMISSIONS = [
  ["عرض جميع العملاء", [true, true, "partial", "partial", "partial"]],
  ["إنشاء حملة جديدة", [true, true, false, false, true]],
  ["اعتماد المحتوى", [true, true, false, false, false]],
  ["إدارة الميزانية", [true, "partial", false, true, "partial"]],
  ["عرض التقارير", [true, true, "partial", true, "partial"]],
  ["إدارة الفريق", [true, false, false, false, false]],
  ["الوصول للإعدادات", [true, false, false, false, false]],
  ["نشر المحتوى مباشرة", [true, true, "partial", false, true]],
];

const ROLE_HEADERS = ["مدير عام", "مدير حملات", "متخصص محتوى", "محلل بيانات", "متخصص إعلانات"];

const LOG: LogEntry[] = [
  { member: "سارة الأحمد", action: "اعتمدت محتوى ستوري رمضان لـ معك رونة", time: "منذ 15 دقيقة", color: "bg-purple-50 text-purple-600", initials: "سا" },
  { member: "محمد الحربي", action: "أضاف 3 منشورات جديدة لحملة صحة بلس", time: "منذ ساعة", color: "bg-green-50 text-green-600", initials: "مح" },
  { member: "نورة العتيبي", action: "أعدّت تقرير الأداء الأسبوعي لـ برق ستور", time: "منذ 3 ساعات", color: "bg-yellow-50 text-yellow-700", initials: "نو" },
  { member: "خالد الشمري", action: "أطلق حملة إعلانات قوقل لـ معك رونة", time: "أمس، 2:30 م", color: "bg-pink-50 text-pink-600", initials: "خا" },
];

const STATUS_CONFIG = {
  online: { label: "متصل", dot: "bg-green-500", text: "text-green-600" },
  away: { label: "بعيد", dot: "bg-yellow-400", text: "text-yellow-700" },
  offline: { label: "غير متصل", dot: "bg-gray-300", text: "text-gray-400" },
};

// ===== COMPONENT =====
export default function TeamManagementPage() {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("");
  const [inviteSent, setInviteSent] = useState(false);

  async function handleInvite() {
    if (!inviteEmail || !inviteRole) return;
    setInviteSent(true);
    setTimeout(() => { setInviteSent(false); setInviteEmail(""); setInviteRole(""); }, 3000);
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <TopNav alertCount={3} user={{ name: "عمر", email: "omar@markiq.sa", role: "admin" }} />
      <Breadcrumb items={[
        { label: "لوحة التحكم", href: "/dashboard" },
        { label: "إدارة الفريق" },
      ]} />
      <PageHeader
        title="إدارة الفريق"
        subtitle={`${TEAM.length} أعضاء — ${TEAM.filter((m) => m.status === "online").length} متصلون الآن`}
        actions={
          <>
            <Button variant="outline" icon={<Download size={11} />}>تصدير</Button>
            <Button icon={<UserPlus size={11} />}>دعوة عضو</Button>
          </>
        }
      />

      <div className="p-4 max-w-[1200px] mx-auto space-y-4">

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          <KpiCard value={TEAM.length} label="إجمالي الفريق" icon={<Users size={13} />} iconColor="text-primary-500" iconBg="bg-primary-light" />
          <KpiCard value={TEAM.filter((m) => m.status === "online").length} label="متصل الآن" icon={<Wifi size={13} />} iconColor="text-green-600" iconBg="bg-green-50" />
          <KpiCard value={18} label="مهمة نشطة" icon={<ListChecks size={13} />} iconColor="text-yellow-700" iconBg="bg-yellow-50" />
          <KpiCard value={12} label="عميل موزّع" icon={<Building2 size={13} />} iconColor="text-purple-600" iconBg="bg-purple-50" />
        </div>

        {/* Team Table */}
        <Card>
          <CardHeader title="أعضاء الفريق" icon={<Users size={14} />} />
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100">
                  {["العضو", "الدور", "العملاء", "المهام", "الحالة", ""].map((h, i) => (
                    <th key={i} className="text-right py-2 px-3 text-[10px] text-gray-400 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TEAM.map((member) => {
                  const st = STATUS_CONFIG[member.status];
                  return (
                    <tr key={member.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${member.color}`}>
                            {member.initials}
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">{member.name}</div>
                            <div className="text-[10px] text-gray-400">{member.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <Badge variant={member.roleKey === "admin" ? "blue" : member.roleKey === "campaign_manager" ? "purple" : member.roleKey === "content_specialist" ? "green" : member.roleKey === "data_analyst" ? "gold" : "gray"}>
                          {member.role}
                        </Badge>
                      </td>
                      <td className="py-2.5 px-3 text-gray-600">{member.clients}</td>
                      <td className="py-2.5 px-3 text-gray-600">{member.tasks > 0 ? `${member.tasks} مهام` : "—"}</td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-2 h-2 rounded-full ${st.dot}`} />
                          <span className={`text-[10px] ${st.text}`}>{st.label}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        {member.roleKey !== "admin" && (
                          <div className="flex gap-1">
                            <button className="w-6 h-6 rounded border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-400 hover:border-primary-400 hover:text-primary-500">
                              <Edit size={11} />
                            </button>
                            <button className="w-6 h-6 rounded border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-400 hover:border-gray-300">
                              <MoreVertical size={11} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Permissions Matrix */}
        <Card>
          <CardHeader title="مصفوفة الصلاحيات" icon={<ListChecks size={14} />} />
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-right py-2 px-3 text-[10px] text-gray-400 font-medium min-w-[160px]">الصلاحية</th>
                  {ROLE_HEADERS.map((h) => (
                    <th key={h} className="text-center py-2 px-2 text-[10px] text-gray-400 font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PERMISSIONS.map(([perm, vals], ri) => (
                  <tr key={ri} className={`border-b border-gray-50 ${ri % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}>
                    <td className="py-2 px-3 text-gray-700 font-medium">{perm as string}</td>
                    {(vals as (boolean | string)[]).map((val, ci) => (
                      <td key={ci} className="py-2 px-2 text-center">
                        {val === true && <span className="text-green-500 text-base">✓</span>}
                        {val === false && <span className="text-gray-300 text-sm">—</span>}
                        {val === "partial" && <span className="text-yellow-500 text-sm">◐</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex gap-4 mt-3 pt-3 border-t border-gray-100">
              {[
                { sym: "✓", label: "صلاحية كاملة", color: "text-green-500" },
                { sym: "◐", label: "صلاحية جزئية", color: "text-yellow-500" },
                { sym: "—", label: "لا صلاحية", color: "text-gray-300" },
              ].map((l, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[10px] text-gray-500">
                  <span className={l.color}>{l.sym}</span> {l.label}
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          {/* Activity Log */}
          <Card>
            <CardHeader title="سجل نشاط الفريق" icon={<ListChecks size={14} />} />
            {LOG.map((entry, i) => (
              <div key={i} className="flex gap-2.5 py-2 border-b border-gray-100 last:border-0">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold flex-shrink-0 ${entry.color}`}>
                  {entry.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11.5px] text-gray-700 leading-snug">
                    <span className="font-medium text-primary-500">{entry.member}</span> {entry.action}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{entry.time}</div>
                </div>
              </div>
            ))}
          </Card>

          {/* Invite Card */}
          <Card className="bg-primary-light border-blue-200">
            <div className="text-xs font-semibold text-primary-500 mb-3 flex items-center gap-2">
              <UserPlus size={13} /> دعوة عضو جديد
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] text-blue-600 mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="example@markiq.sa"
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg text-xs bg-white focus:outline-none focus:border-primary-500"
                  dir="ltr"
                />
              </div>
              <div>
                <label className="block text-[11px] text-blue-600 mb-1">الدور</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-3 py-2 border border-blue-200 rounded-lg text-xs bg-white focus:outline-none focus:border-primary-500"
                >
                  <option value="">اختر الدور...</option>
                  <option>مدير حملات</option>
                  <option>متخصص محتوى</option>
                  <option>محلل بيانات</option>
                  <option>متخصص إعلانات</option>
                </select>
              </div>
              <button
                onClick={handleInvite}
                disabled={!inviteEmail || !inviteRole}
                className={`w-full py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-2 ${
                  inviteSent
                    ? "bg-green-500 text-white"
                    : "bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50"
                }`}
              >
                {inviteSent ? <><Check size={13} /> تم إرسال الدعوة</> : <><UserPlus size={13} /> إرسال الدعوة</>}
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
