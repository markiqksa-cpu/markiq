"use client";

import { useState, useRef, useEffect } from "react";
import {
  Brain, Send, Trash2, ChevronDown, BarChart2, Building2, Megaphone,
  PenTool, Lightbulb, DollarSign, TrendingUp, Calendar,
  CheckCircle, RefreshCw, CalendarCheck
} from "lucide-react";
import TopNav from "@/components/layout/TopNav";
import Breadcrumb from "@/components/layout/Breadcrumb";

// ===== TYPES =====
interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: string;
  cards?: Card[];
  actions?: Action[];
}

interface Card {
  label: string;
  icon: string;
  text: string;
}

interface Action {
  label: string;
  type: "primary" | "outline" | "green";
  followUp: string;
}

// ===== QUICK CHIPS =====
const QUICK_CHIPS = [
  { label: "حلل أداء هذا الأسبوع", icon: <BarChart2 size={11} />, text: "حلل أداء معك رونة هذا الأسبوع" },
  { label: "اكتب كابشن انستقرام", icon: <PenTool size={11} />, text: "اكتب كابشن لانستقرام عن الباستا الكريمية بلهجة سعودية وفيه عرض توصيل مجاني" },
  { label: "استراتيجية رمضان", icon: <Lightbulb size={11} />, text: "اقترح استراتيجية تسويقية لشهر رمضان لمعك رونة" },
  { label: "توزيع الميزانية", icon: <DollarSign size={11} />, text: "كيف أوزع ميزانية 8000 ريال على المنصات؟" },
  { label: "لماذا انخفض CTR", icon: <TrendingUp size={11} />, text: "لماذا انخفض CTR على سناب شات؟" },
  { label: "جدول النشر", icon: <Calendar size={11} />, text: "خطط جدول نشر لأسبوع كامل لمعك رونة" },
];

// ===== RESPONSE LIBRARY =====
function getAIResponse(text: string): Omit<Message, "id" | "role" | "timestamp"> {
  const t = text.toLowerCase();

  if (t.includes("كابشن") || t.includes("caption")) return {
    content: "",
    cards: [
      { label: "الكابشن المقترح", icon: "⭐", text: "🍝 جديد في معك رونة — الباستا الكريمية وصلت!\n\nطبق غني وكريمي، يتوصّل لك طازج وساخن على بابك 🔥\nوهالأسبوع؟ التوصيل مجاني على أول طلب!\n\nاطلب الحين من هنقرستيشن وجاهز 🛵\n\n#معك_رونة #باستا_كريمية #توصيل_مجاني #باستا_الرياض" },
      { label: "أفضل وقت للنشر", icon: "🕐", text: "الجمعة 12:00 م أو السبت 7:00 م — أعلى تفاعل لجمهورك" },
    ],
    actions: [
      { label: "✓ استخدم هذا الكابشن", type: "primary", followUp: "تم اعتماد الكابشن وحفظه في مكتبة المحتوى" },
      { label: "نسخة أخرى", type: "outline", followUp: "اكتب لي نسخة مختلفة من الكابشن" },
      { label: "جدوله للنشر", type: "green", followUp: "جدول هذا الكابشن للنشر يوم الجمعة 12:00 م" },
    ],
  };

  if (t.includes("ctr") || t.includes("انخفض")) return {
    content: "بناءً على بيانات حملات معك رونة، أرى 3 أسباب محتملة:",
    cards: [
      { label: "السبب الأول — الإبداعية قديمة", icon: "🖼️", text: "الإعلان يعمل 18 يوماً بدون تغيير — الجمهور شاف الإعلان أكثر من مرة وتوقف عن النقر" },
      { label: "السبب الثاني — الاستهداف واسع", icon: "🎯", text: "الاستهداف يغطي الرياض كاملة — تضييقه على النزهة والعليا سيرفع CTR بشكل ملحوظ" },
      { label: "السبب الثالث — وقت النشر", icon: "🕐", text: "الإعلان يعمل 24/7 — ركّزه في أوقات الذروة 12-2 م و7-11 م" },
    ],
    actions: [
      { label: "غيّر الإبداعية", type: "primary", followUp: "اقترح إبداعية جديدة لسناب شات" },
      { label: "ضيّق الاستهداف", type: "outline", followUp: "كيف أضيق الاستهداف على سناب شات؟" },
      { label: "عدّل أوقات النشر", type: "outline", followUp: "ما أفضل أوقات النشر على سناب شات؟" },
    ],
  };

  if (t.includes("أداء") || t.includes("تحليل") || t.includes("حلل")) return {
    content: "ملخص أداء معك رونة هذا الأسبوع:",
    cards: [
      { label: "الإيجابيات", icon: "📈", text: "✓ قوقل يحقق 4.2x ROI — أفضل أداء\n✓ انستقرام تجاوز هدف الطلبات بـ 24%\n✓ 1,840 طلب جديد هذا الشهر" },
      { label: "نقاط التحسين", icon: "⚠️", text: "• سناب شات CTR منخفض 1.2% (المتوسط 2.6%)\n• ميزانية قوقل تجاوزت الحد 300 ر.س\n• تيك توك جديد — يحتاج بيانات" },
    ],
    actions: [
      { label: "تفاصيل كاملة", type: "primary", followUp: "أعطني تقرير الأداء الكامل لهذا الشهر" },
      { label: "توصيات التحسين", type: "outline", followUp: "ما توصياتك لتحسين الأداء الأسبوع القادم؟" },
    ],
  };

  if (t.includes("ميزانية") || t.includes("توزيع")) return {
    content: "بناءً على أداء منصاتك الحالي، إليك التوزيع الأمثل لـ 8,000 ريال:",
    cards: [
      { label: "التوزيع المقترح", icon: "📊", text: "🔵 قوقل — 3,200 ر.س (40%) — أعلى ROI 4.2x\n🟣 انستقرام — 2,400 ر.س (30%) — أداء ممتاز\n🟡 سناب شات — 1,600 ر.س (20%) — يحتاج مراجعة\n🔷 تيك توك — 800 ر.س (10%) — جديد، اختبر" },
      { label: "التوقع", icon: "🎯", text: "هذا التوزيع يتوقع 2,100-2,400 طلب شهرياً بعائد 3.5-4x" },
    ],
    actions: [
      { label: "تطبيق التوزيع", type: "primary", followUp: "قم بتطبيق التوزيع المقترح على الحملات" },
      { label: "تعديل يدوي", type: "outline", followUp: "أريد تعديل التوزيع يدوياً" },
    ],
  };

  if (t.includes("رمضان") || t.includes("استراتيجية")) return {
    content: "إليك خطة تسويقية متكاملة لشهر رمضان لمعك رونة:",
    cards: [
      { label: "الفكرة المحورية", icon: "💡", text: "سُفرة رمضان مع معك رونة — ربط الباستا بلحظات الإفطار العائلية" },
      { label: "جدول المحتوى", icon: "📅", text: "• قبل الإفطار (4-5 م): منشورات تشهي\n• بعد الإفطار (8-10 م): عروض وخصومات\n• السحور (12-2 ص): محتوى خفيف وعروض ليلية" },
      { label: "المنصات الأولى", icon: "📱", text: "سناب شات + انستقرام للمحتوى، قوقل للبحث المباشر" },
    ],
    actions: [
      { label: "اعتماد الاستراتيجية", type: "primary", followUp: "احفظ استراتيجية رمضان وابدأ تنفيذها" },
      { label: "تفاصيل أكثر", type: "outline", followUp: "أعطني تفاصيل أكثر عن استراتيجية رمضان" },
      { label: "جدول المحتوى", type: "green", followUp: "اصنع جدول نشر كامل لرمضان" },
    ],
  };

  if (t.includes("جدول") || t.includes("نشر")) return {
    content: "جدول نشر مقترح لمعك رونة — أسبوع كامل:",
    cards: [
      { label: "الأحد", icon: "📅", text: "12:00 م — انستقرام: صورة طبق اليوم\n8:00 م — سناب شات: ستوري عرض" },
      { label: "الثلاثاء + الأربعاء", icon: "📅", text: "1:00 م — تيك توك: فيديو تحضير\n9:00 م — انستقرام: ريلز" },
      { label: "الجمعة + السبت", icon: "📅", text: "11:00 ص — سناب شات: عرض نهاية الأسبوع\n2:00 م — انستقرام: بوست\n9:00 م — جميع المنصات: عرض خاص" },
    ],
    actions: [
      { label: "تطبيق الجدول", type: "primary", followUp: "قم بجدولة هذه المنشورات تلقائياً في التقويم" },
      { label: "تعديل الجدول", type: "outline", followUp: "أريد تعديل أوقات الجدول" },
    ],
  };

  // Default
  return {
    content: `بناءً على سؤالك، إليك تحليلي لبيانات معك رونة:\n\nالحملات الحالية تسير بشكل جيد مع إمكانية تحسين في سناب شات وتيك توك. هل تريد تفاصيل أكثر عن جانب معين؟`,
    actions: [
      { label: "تفاصيل الأداء", type: "primary", followUp: "حلل أداء معك رونة هذا الأسبوع" },
      { label: "توصيات", type: "outline", followUp: "ما توصياتك لتحسين الأداء؟" },
    ],
  };
}

function now(): string {
  return new Date().toLocaleTimeString("ar-SA", { hour: "2-digit", minute: "2-digit" });
}

// ===== COMPONENT =====
export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "ai",
      content: "مرحباً عمر 👋 أنا مساعدك الذكي لمنصة Markiq.\n\nأقدر أساعدك في تحليل الأداء، كتابة المحتوى، تحسين الحملات، أو أي سؤال تسويقي.",
      timestamp: "9:00 ص",
      cards: [
        { label: "ما يستحق انتباهك الآن", icon: "⚠️", text: "• ميزانية قوقل تجاوزت الحد بـ 300 ر.س\n• CTR سناب شات منخفض — يحتاج مراجعة\n• 3 منشورات تنتظر موافقتك" },
      ],
      actions: [
        { label: "معالجة تجاوز الميزانية", type: "primary", followUp: "ما الإجراء الموصى به لتجاوز ميزانية قوقل؟" },
        { label: "مراجعة المنشورات", type: "outline", followUp: "راجع المنشورات التي تنتظر الموافقة" },
      ],
    }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  async function sendMessage(text: string) {
    if (!text.trim() || typing) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
      timestamp: now(),
    };
    setMessages((p) => [...p, userMsg]);
    setInput("");
    setTyping(true);

    await new Promise((r) => setTimeout(r, 1400 + Math.random() * 600));

    const resp = getAIResponse(text);
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "ai",
      timestamp: now(),
      ...resp,
    };
    setMessages((p) => [...p, aiMsg]);
    setTyping(false);
  }

  function clearChat() {
    setMessages([]);
    setTyping(false);
  }

  const actionStyles: Record<string, string> = {
    primary: "bg-primary-500 text-white border-none hover:bg-primary-600",
    outline: "bg-white text-gray-600 border border-gray-200 hover:border-primary-500 hover:text-primary-500",
    green: "bg-green-50 text-green-600 border border-green-200 hover:bg-green-100",
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" dir="rtl">
      <TopNav
        currentClient={{ id: "1", name: "معك رونة" }}
        alertCount={3}
        user={{ name: "عمر", email: "omar@markiq.sa", role: "admin" }}
      />
      <Breadcrumb items={[
        { label: "لوحة التحكم", href: "/dashboard" },
        { label: "المساعد الذكي" },
      ]} />

      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-4 py-3 gap-3" style={{ height: "calc(100vh - 110px)" }}>

        {/* Header */}
        <div className="flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <Brain size={16} className="text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-800">Markiq AI</div>
              <div className="text-[10px] text-gray-500">مساعد تسويقي — معك رونة</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-primary-light border border-blue-200 rounded-full px-3 py-1.5 text-xs text-primary-500 cursor-pointer">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              معك رونة
              <ChevronDown size={11} />
            </div>
            <button
              onClick={clearChat}
              className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Quick Chips */}
        <div className="flex gap-2 overflow-x-auto flex-shrink-0 pb-1">
          {QUICK_CHIPS.map((chip, i) => (
            <button
              key={i}
              onClick={() => sendMessage(chip.text)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-[11px] text-gray-600 whitespace-nowrap flex-shrink-0 hover:border-primary-500 hover:text-primary-500 transition-colors"
            >
              <span className="text-primary-400">{chip.icon}</span>
              {chip.label}
            </button>
          ))}
        </div>

        {/* Chat Area */}
        <div ref={chatRef} className="flex-1 overflow-y-auto space-y-4 min-h-0">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              {/* Avatar */}
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                msg.role === "ai" ? "bg-primary-500 text-white" : "bg-yellow-400 text-primary-500"
              }`}>
                {msg.role === "ai" ? <Brain size={14} /> : "ع"}
              </div>

              {/* Bubble */}
              <div className={`max-w-[85%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-2`}>
                {/* Main bubble */}
                {(msg.content || (msg.cards && msg.cards.length === 0)) && msg.content && (
                  <div className={`px-3 py-2.5 rounded-xl text-xs leading-relaxed whitespace-pre-line ${
                    msg.role === "user"
                      ? "bg-primary-light border border-blue-200 text-gray-800 rounded-tr-sm"
                      : "bg-white border border-gray-200 text-gray-800 rounded-tl-sm"
                  }`}>
                    {msg.content}
                  </div>
                )}

                {/* Cards */}
                {msg.cards && msg.cards.length > 0 && (
                  <div className="bg-white border border-gray-200 rounded-xl rounded-tl-sm overflow-hidden w-full">
                    {msg.content && (
                      <div className="px-3 py-2.5 text-xs text-gray-700 leading-relaxed border-b border-gray-100">
                        {msg.content}
                      </div>
                    )}
                    {msg.cards.map((card, ci) => (
                      <div key={ci} className="px-3 py-2.5 border-b border-gray-50 last:border-0">
                        <div className="flex items-center gap-1.5 text-[10px] font-medium text-gray-500 mb-1.5">
                          <span>{card.icon}</span>
                          {card.label}
                        </div>
                        <div className="text-[11.5px] text-gray-700 leading-relaxed whitespace-pre-line">
                          {card.text}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions */}
                {msg.actions && msg.actions.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {msg.actions.map((action, ai) => (
                      <button
                        key={ai}
                        onClick={() => sendMessage(action.followUp)}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${actionStyles[action.type]}`}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}

                <div className="text-[9px] text-gray-400 px-1">{msg.timestamp}</div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {typing && (
            <div className="flex gap-2">
              <div className="w-7 h-7 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                <Brain size={14} className="text-white" />
              </div>
              <div className="bg-white border border-gray-200 rounded-xl rounded-tl-sm px-3 py-2.5 flex items-center gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-1.5 h-1.5 bg-primary-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Context Tools */}
        <div className="flex gap-2 flex-shrink-0">
          {[
            { icon: <Building2 size={11} />, label: "معك رونة" },
            { icon: <Megaphone size={11} />, label: "حملة رمضان" },
            { icon: <BarChart2 size={11} />, label: "بيانات الأداء" },
            { icon: <CalendarCheck size={11} />, label: "التقويم" },
          ].map((tool, i) => (
            <button key={i} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-gray-200 rounded-full text-[10px] text-gray-500 hover:border-primary-400 hover:text-primary-500 transition-colors">
              {tool.icon} {tool.label}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2 flex-shrink-0">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
            placeholder="اسألني عن الأداء، المحتوى، الاستراتيجية..."
            rows={1}
            className="flex-1 px-3 py-2.5 border border-gray-200 rounded-xl text-xs bg-white focus:outline-none focus:border-primary-500 resize-none leading-relaxed"
            style={{ minHeight: "40px", maxHeight: "100px" }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || typing}
            className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center hover:bg-primary-600 transition-colors disabled:opacity-50 flex-shrink-0"
          >
            <Send size={16} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

