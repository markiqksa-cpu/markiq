"use client";

import { useState } from "react";
import {
  Settings, Plug, Bell, Palette, CreditCard, Shield,
  AlertTriangle, Edit, RefreshCw, Plug2, CheckCircle, Save
} from "lucide-react";
import TopNav from "@/components/layout/TopNav";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { Button, Toggle, Card } from "@/components/ui";

// ===== TYPES =====
interface NavItem { id: string; label: string; icon: React.ReactNode; danger?: boolean }
interface ApiKey { name: string; platform: string; key: string; status: "active" | "inactive" | "error"; icon: string }

// ===== SIDE NAV =====
const NAV_ITEMS: NavItem[] = [
  { id: "general", label: "عام", icon: <Settings size={14} /> },
  { id: "integrations", label: "التكاملات", icon: <Plug size={14} /> },
  { id: "notifications", label: "التنبيهات", icon: <Bell size={14} /> },
  { id: "branding", label: "الهوية البصرية", icon: <Palette size={14} /> },
  { id: "billing", label: "الفواتير", icon: <CreditCard size={14} /> },
  { id: "security", label: "الأمان", icon: <Shield size={14} /> },
  { id: "danger", label: "منطقة الخطر", icon: <AlertTriangle size={14} />, danger: true },
];

// ===== API KEYS =====
const API_KEYS: ApiKey[] = [
  { name: "Claude API — Anthropic", platform: "AI", key: "sk-ant-••••••••••••XXXX", status: "active", icon: "🧠" },
  { name: "DALL-E 3 — OpenAI", platform: "AI", key: "sk-••••••••••XXXX", status: "active", icon: "🎨" },
  { name: "Runway Gen-2", platform: "Video", key: "rw-••••••••XXXX", status: "active", icon: "🎬" },
  { name: "Google Ads API", platform: "Ads", key: "غير مرتبط", status: "inactive", icon: "🔍" },
  { name: "Meta Ads API", platform: "Ads", key: "EAA••••••••XXXX", status: "error", icon: "📘" },
  { name: "Snapchat Ads API", platform: "Ads", key: "غير مرتبط", status: "inactive", icon: "👻" },
  { name: "TikTok Ads API", platform: "Ads", key: "غير مرتبط", status: "inactive", icon: "🎵" },
];

const STATUS_CONFIG = {
  active: { label: "متصل", bg: "bg-green-50", text: "text-green-600", border: "border-green-200" },
  inactive: { label: "غير مرتبط", bg: "bg-gray-100", text: "text-gray-500", border: "border-gray-200" },
  error: { label: "خطأ في المصادقة", bg: "bg-red-50", text: "text-red-500", border: "border-red-200" },
};

// ===== NOTIFICATIONS =====
const NOTIFICATIONS = [
  { id: "budget_exceeded", label: "تنبيه تجاوز الميزانية", desc: "تنبيه فوري عند تجاوز حد الميزانية لأي منصة", enabled: true },
  { id: "performance_drop", label: "تنبيه انخفاض الأداء", desc: "تنبيه عند انخفاض CTR أو ROI عن المتوسط", enabled: true },
  { id: "content_pending", label: "تنبيه المحتوى للمراجعة", desc: "إشعار عند وجود محتوى ينتظر الاعتماد", enabled: true },
  { id: "contract_renewal", label: "تنبيه تجديد العقود", desc: "تذكير قبل 7 أيام من انتهاء عقد أي عميل", enabled: true },
  { id: "weekly_report", label: "تقرير أسبوعي تلقائي", desc: "إرسال ملخص أداء أسبوعي لكل عميل", enabled: false },
  { id: "saudi_occasions", label: "تنبيهات المناسبات السعودية", desc: "تذكير بالمناسبات الوطنية قبل 2 أسبوع", enabled: true },
  { id: "goal_reached", label: "تنبيه تحقيق الهدف", desc: "إشعار عند تجاوز أي حملة لأهدافها", enabled: true },
];

// ===== COMPONENT =====
export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("general");
  const [saved, setSaved] = useState(false);
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const [form, setForm] = useState({
    platformName: "Markiq", email: "info@markiq.sa",
    phone: "+966 5X XXX XXXX", city: "الرياض، المملكة العربية السعودية",
    language: "العربية", timezone: "توقيت الرياض (GMT+3)",
    currency: "ريال سعودي (ر.س)", dateFormat: "DD/MM/YYYY",
    primaryColor: "#1B4FFF", secondaryColor: "#FFB800",
    font: "Inter / Arial",
    twofa: true, autoLogout: true, auditLog: true,
    vatNumber: "3XXXXXXXXXX3", taxId: "XXXXXXXXXX", billingEmail: "billing@markiq.sa",
  });

  function update(key: string, val: unknown) {
    setForm((p) => ({ ...p, [key]: val }));
  }

  function toggleNotif(id: string) {
    setNotifs((p) => p.map((n) => n.id === id ? { ...n, enabled: !n.enabled } : n));
  }

  async function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const labelCls = "block text-[11px] text-gray-500 mb-1";
  const inputCls = "w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-primary-500 bg-gray-50";
  const selectCls = inputCls;
  const grid2 = "grid grid-cols-2 gap-3";

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <TopNav alertCount={3} user={{ name: "عمر", email: "omar@markiq.sa", role: "admin" }} />
      <Breadcrumb items={[
        { label: "لوحة التحكم", href: "/dashboard" },
        { label: "الإعدادات" },
      ]} />

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-gray-800">الإعدادات</div>
          <div className="text-[11px] text-gray-500 mt-0.5">إدارة النظام والتكاملات</div>
        </div>
        <Button
          icon={saved ? <CheckCircle size={12} /> : <Save size={12} />}
          onClick={handleSave}
          className={saved ? "bg-green-500 border-none" : ""}
        >
          {saved ? "تم الحفظ" : "حفظ التغييرات"}
        </Button>
      </div>

      <div className="flex max-w-[1100px] mx-auto">
        {/* Side Nav */}
        <div className="w-48 flex-shrink-0 bg-white border-l border-gray-200 min-h-[calc(100vh-110px)] py-3">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs border-r-2 transition-colors text-right ${
                activeSection === item.id
                  ? "bg-primary-light text-primary-500 border-primary-500 font-medium"
                  : item.danger
                  ? "text-red-400 border-transparent hover:bg-red-50"
                  : "text-gray-500 border-transparent hover:bg-gray-50"
              }`}
            >
              <span className={activeSection === item.id ? "text-primary-500" : item.danger ? "text-red-400" : "text-gray-400"}>
                {item.icon}
              </span>
              <span className={item.danger ? "text-red-400" : ""}>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-5 space-y-4">

          {/* ===== GENERAL ===== */}
          {activeSection === "general" && (
            <>
              <Card>
                <div className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Settings size={13} className="text-primary-500" /> معلومات الشركة
                </div>
                <div className={grid2}>
                  <div><label className={labelCls}>اسم المنصة</label><input className={inputCls} value={form.platformName} onChange={(e) => update("platformName", e.target.value)} /></div>
                  <div><label className={labelCls}>البريد الإلكتروني</label><input className={inputCls} value={form.email} onChange={(e) => update("email", e.target.value)} dir="ltr" /></div>
                  <div><label className={labelCls}>رقم الجوال</label><input className={inputCls} value={form.phone} onChange={(e) => update("phone", e.target.value)} /></div>
                  <div><label className={labelCls}>المدينة</label><input className={inputCls} value={form.city} onChange={(e) => update("city", e.target.value)} /></div>
                </div>
              </Card>
              <Card>
                <div className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Settings size={13} className="text-primary-500" /> إعدادات اللغة والمنطقة
                </div>
                <div className={grid2}>
                  <div><label className={labelCls}>اللغة الافتراضية</label><select className={selectCls} value={form.language} onChange={(e) => update("language", e.target.value)}><option>العربية</option><option>English</option></select></div>
                  <div><label className={labelCls}>المنطقة الزمنية</label><select className={selectCls} value={form.timezone} onChange={(e) => update("timezone", e.target.value)}><option>توقيت الرياض (GMT+3)</option><option>UTC</option></select></div>
                  <div><label className={labelCls}>العملة</label><select className={selectCls} value={form.currency} onChange={(e) => update("currency", e.target.value)}><option>ريال سعودي (ر.س)</option><option>USD</option></select></div>
                  <div><label className={labelCls}>تنسيق التاريخ</label><select className={selectCls} value={form.dateFormat} onChange={(e) => update("dateFormat", e.target.value)}><option>DD/MM/YYYY</option><option>MM/DD/YYYY</option><option>YYYY-MM-DD</option></select></div>
                </div>
              </Card>
            </>
          )}

          {/* ===== INTEGRATIONS ===== */}
          {activeSection === "integrations" && (
            <Card>
              <div className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Plug size={13} className="text-primary-500" /> مفاتيح API
              </div>
              <div className="space-y-0">
                {API_KEYS.map((api, i) => {
                  const st = STATUS_CONFIG[api.status];
                  return (
                    <div key={i} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-base flex-shrink-0">
                        {api.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-gray-800">{api.name}</div>
                        <div className="text-[10px] text-gray-400 font-mono mt-0.5">{api.key}</div>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${st.bg} ${st.text} ${st.border}`}>
                        {st.label}
                      </span>
                      {api.status === "active" && (
                        <div className="flex gap-1">
                          <button className="w-6 h-6 rounded border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-400 hover:border-primary-400 text-[10px]">
                            <Edit size={11} />
                          </button>
                          <button className="w-6 h-6 rounded border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-400 hover:border-primary-400">
                            <RefreshCw size={11} />
                          </button>
                        </div>
                      )}
                      {api.status === "inactive" && (
                        <button className="flex items-center gap-1 px-2 py-1 bg-primary-light text-primary-500 border border-blue-200 rounded-lg text-[10px] hover:bg-blue-100 transition-colors">
                          <Plug2 size={10} /> ربط
                        </button>
                      )}
                      {api.status === "error" && (
                        <button className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-500 border border-red-200 rounded-lg text-[10px] hover:bg-red-100 transition-colors">
                          <RefreshCw size={10} /> إعادة الربط
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* ===== NOTIFICATIONS ===== */}
          {activeSection === "notifications" && (
            <Card>
              <div className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Bell size={13} className="text-primary-500" /> إعدادات التنبيهات
              </div>
              <div className="space-y-0">
                {notifs.map((n) => (
                  <div key={n.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div className="flex-1 min-w-0 ml-4">
                      <div className="text-xs font-medium text-gray-800">{n.label}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{n.desc}</div>
                    </div>
                    <Toggle checked={n.enabled} onChange={() => toggleNotif(n.id)} />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* ===== BRANDING ===== */}
          {activeSection === "branding" && (
            <Card>
              <div className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Palette size={13} className="text-primary-500" /> هوية Markiq البصرية
              </div>
              <div className={grid2}>
                <div>
                  <label className={labelCls}>اللون الرئيسي</label>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={form.primaryColor} onChange={(e) => update("primaryColor", e.target.value)} className="w-9 h-9 rounded-lg border border-gray-200 p-0.5 cursor-pointer" />
                    <input className={inputCls} value={form.primaryColor} onChange={(e) => update("primaryColor", e.target.value)} dir="ltr" />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>اللون الثانوي</label>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={form.secondaryColor} onChange={(e) => update("secondaryColor", e.target.value)} className="w-9 h-9 rounded-lg border border-gray-200 p-0.5 cursor-pointer" />
                    <input className={inputCls} value={form.secondaryColor} onChange={(e) => update("secondaryColor", e.target.value)} dir="ltr" />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>الخط المستخدم</label>
                  <select className={selectCls} value={form.font} onChange={(e) => update("font", e.target.value)}>
                    <option>Inter / Arial</option><option>Cairo</option><option>Tajawal</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>اسم المنصة في التقارير</label>
                  <input className={inputCls} value={form.platformName} onChange={(e) => update("platformName", e.target.value)} />
                </div>
              </div>
              {/* Preview */}
              <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-[10px] text-gray-400 mb-2">معاينة مباشرة</div>
                <div className="h-8 rounded-lg flex items-center px-3 gap-2" style={{ backgroundColor: form.primaryColor }}>
                  <div className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: form.secondaryColor, color: form.primaryColor }}>M</div>
                  <span className="text-white text-xs font-medium">{form.platformName}</span>
                </div>
              </div>
            </Card>
          )}

          {/* ===== BILLING ===== */}
          {activeSection === "billing" && (
            <Card>
              <div className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <CreditCard size={13} className="text-primary-500" /> معلومات الفواتير
              </div>
              <div className={grid2}>
                <div><label className={labelCls}>الاسم على البطاقة</label><input className={inputCls} defaultValue="Omar Al-Markiq" /></div>
                <div><label className={labelCls}>رقم السجل التجاري</label><input className={inputCls} value={form.taxId} onChange={(e) => update("taxId", e.target.value)} /></div>
                <div><label className={labelCls}>البريد للفواتير</label><input className={inputCls} value={form.billingEmail} onChange={(e) => update("billingEmail", e.target.value)} dir="ltr" /></div>
                <div><label className={labelCls}>رقم ضريبة القيمة المضافة</label><input className={inputCls} value={form.vatNumber} onChange={(e) => update("vatNumber", e.target.value)} /></div>
              </div>
            </Card>
          )}

          {/* ===== SECURITY ===== */}
          {activeSection === "security" && (
            <Card>
              <div className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Shield size={13} className="text-primary-500" /> إعدادات الأمان
              </div>
              {[
                { key: "twofa", label: "المصادقة الثنائية (2FA)", desc: "حماية إضافية لحسابات الفريق" },
                { key: "autoLogout", label: "تسجيل الخروج التلقائي", desc: "بعد 30 دقيقة من عدم النشاط" },
                { key: "auditLog", label: "سجل دخول الفريق", desc: "تتبع جميع جلسات تسجيل الدخول" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="ml-4">
                    <div className="text-xs font-medium text-gray-800">{item.label}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{item.desc}</div>
                  </div>
                  <Toggle
                    checked={form[item.key as keyof typeof form] as boolean}
                    onChange={(v) => update(item.key, v)}
                  />
                </div>
              ))}
            </Card>
          )}

          {/* ===== DANGER ===== */}
          {activeSection === "danger" && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-red-500 mb-4">
                <AlertTriangle size={15} /> منطقة الخطر
              </div>
              {[
                { label: "حذف جميع البيانات", desc: "حذف نهائي لجميع بيانات العملاء والحملات — لا يمكن التراجع", btnLabel: "حذف الكل", btnClass: "bg-red-50 text-red-500 border border-red-200 hover:bg-red-100" },
                { label: "إعادة تعيين النظام", desc: "إعادة ضبط المنصة لإعدادات المصنع", btnLabel: "إعادة التعيين", btnClass: "bg-red-50 text-red-500 border border-red-200 hover:bg-red-100" },
                { label: "تصدير جميع البيانات", desc: "تنزيل نسخة كاملة من بيانات المنصة", btnLabel: "تصدير", btnClass: "bg-white text-gray-600 border border-gray-200 hover:border-gray-300" },
              ].map((item, i) => (
                <div key={i} className={`flex items-center justify-between py-3 ${i < 2 ? "border-b border-red-100" : ""}`}>
                  <div>
                    <div className="text-xs font-medium text-gray-800">{item.label}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">{item.desc}</div>
                  </div>
                  <button className={`px-3 py-1.5 rounded-lg text-[11px] transition-colors flex-shrink-0 ${item.btnClass}`}>
                    {item.btnLabel}
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
