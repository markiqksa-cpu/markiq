# Markiq — منصة التسويق الذكي

## 🚀 خطوات الإطلاق

### 1. إعداد المشروع

```bash
# تثبيت المكتبات
npm install

# إنشاء ملف البيئة
cp .env.example .env.local
```

### 2. إعداد Supabase

1. أنشئ مشروعاً جديداً على [supabase.com](https://supabase.com)
2. انسخ `Project URL` و `anon key` و `service_role key`
3. شغّل ملف `docs/schema.sql` في Supabase SQL Editor
4. أضف المفاتيح في `.env.local`

### 3. إعداد المفاتيح

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
ANTHROPIC_API_KEY=sk-ant-YOUR_KEY
OPENAI_API_KEY=sk-YOUR_KEY
RUNWAY_API_KEY=rw-YOUR_KEY
```

### 4. تشغيل محلياً

```bash
npm run dev
# الموقع على http://localhost:3000
```

### 5. النشر على Vercel

```bash
# تثبيت Vercel CLI
npm i -g vercel

# النشر
vercel --prod
```

---

## 📁 هيكل المشروع

```
src/
├── app/
│   ├── (auth)/login/          # تسجيل الدخول
│   ├── (dashboard)/
│   │   ├── page.tsx           # Dashboard
│   │   ├── clients/           # قائمة + ملف + إضافة
│   │   ├── campaigns/         # الحملات + بناء + مراجعة
│   │   ├── calendar/          # التقويم
│   │   ├── ai/                # المساعد الذكي
│   │   ├── reports/           # التقارير
│   │   ├── alerts/            # التنبيهات
│   │   ├── budget/            # الميزانية
│   │   ├── team/              # الفريق
│   │   └── settings/          # الإعدادات
│   └── api/
│       └── ai/
│           ├── strategy/      # Claude → استراتيجية
│           ├── content/       # Claude → محتوى
│           └── chat/          # Claude → محادثة
├── components/
│   ├── layout/                # TopNav, Breadcrumb, PageHeader
│   └── ui/                    # Button, Card, Badge...
├── lib/
│   ├── supabase/              # Client + Server
│   ├── ai/                    # Claude, DALL-E, Runway
│   └── utils/                 # Saudi Calendar, Alerts
└── types/                     # TypeScript Types
```

---

## 🎨 Design System

| اللون | HEX | الاستخدام |
|-------|-----|-----------|
| Primary Blue | `#1B4FFF` | الأزرار، الـ Nav، النشط |
| Secondary Gold | `#FFB800` | اللوغو، التمييز |
| Success Green | `#00A86B` | النجاح، الاعتماد |
| Error Red | `#FF4444` | الخطأ، الرفض |
| Warning | `#B8860B` | التحذيرات |

---

## 🔧 APIs المستخدمة

| الخدمة | الغرض |
|--------|-------|
| Claude (Anthropic) | المحتوى + الاستراتيجية + الـ Chat |
| DALL-E 3 (OpenAI) | توليد الصور |
| Runway Gen-2 | توليد الفيديو |
| Supabase | قاعدة البيانات + Auth |
| Meta Ads API | انستقرام + فيسبوك |
| Google Ads API | قوقل |
| Snapchat Ads API | سناب شات |
| TikTok Ads API | تيك توك |
| Stripe | بطاقات العملاء |

---

## 📞 الدعم الفني

Omar — omar@markiq.sa
