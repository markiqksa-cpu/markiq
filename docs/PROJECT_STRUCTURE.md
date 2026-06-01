# Markiq — Project Structure

```
markiq/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── (auth)/
│   │   │   └── login/page.tsx      # شاشة تسجيل الدخول
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx          # Layout مع Top Nav
│   │   │   ├── page.tsx            # Dashboard
│   │   │   ├── clients/
│   │   │   │   ├── page.tsx        # قائمة العملاء
│   │   │   │   ├── new/page.tsx    # إضافة عميل
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx    # Client Profile
│   │   │   │       └── strategy/page.tsx  # توليد الاستراتيجية
│   │   │   ├── campaigns/
│   │   │   │   ├── page.tsx        # قائمة الحملات
│   │   │   │   ├── new/page.tsx    # Campaign Builder
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx    # تفاصيل الحملة
│   │   │   │       └── review/page.tsx    # Content Review
│   │   │   ├── calendar/page.tsx   # Campaign Calendar
│   │   │   ├── ai/page.tsx         # AI Assistant
│   │   │   ├── reports/page.tsx    # Performance Reports
│   │   │   ├── alerts/page.tsx     # Alerts Center
│   │   │   ├── team/page.tsx       # Team Management
│   │   │   └── settings/page.tsx   # Settings
│   │   └── api/
│   │       ├── auth/               # Auth endpoints
│   │       ├── clients/            # Client CRUD
│   │       ├── campaigns/          # Campaign CRUD
│   │       ├── content/            # Content CRUD
│   │       ├── ai/
│   │       │   ├── strategy/       # Claude → Strategy
│   │       │   ├── content/        # Claude → Content
│   │       │   ├── image/          # DALL-E → Image
│   │       │   └── video/          # Runway → Video
│   │       ├── budget/             # Budget management
│   │       └── alerts/             # Alerts system
│   ├── components/
│   │   ├── layout/
│   │   │   ├── TopNav.tsx          # Top Navigation (موحد)
│   │   │   ├── Breadcrumb.tsx      # Breadcrumb
│   │   │   └── PageHeader.tsx      # Page Header
│   │   ├── ui/                     # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Toggle.tsx
│   │   │   └── Chart.tsx
│   │   ├── clients/
│   │   │   ├── ClientCard.tsx
│   │   │   ├── ClientForm.tsx
│   │   │   └── NeighborhoodSelector.tsx
│   │   ├── campaigns/
│   │   │   ├── CampaignWizard.tsx
│   │   │   ├── PlatformSelector.tsx
│   │   │   ├── BudgetDistribution.tsx
│   │   │   └── ContentReviewCard.tsx
│   │   └── ai/
│   │       ├── AIChat.tsx
│   │       ├── StrategyGenerator.tsx
│   │       └── ContentGenerator.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts           # Supabase client
│   │   │   └── server.ts           # Server-side client
│   │   ├── ai/
│   │   │   ├── claude.ts           # Claude API wrapper
│   │   │   ├── dalle.ts            # DALL-E API wrapper
│   │   │   └── runway.ts           # Runway API wrapper
│   │   ├── ads/
│   │   │   ├── meta.ts             # Meta Ads API
│   │   │   ├── google.ts           # Google Ads API
│   │   │   ├── snapchat.ts         # Snapchat Ads API
│   │   │   └── tiktok.ts           # TikTok Ads API
│   │   └── utils/
│   │       ├── alerts.ts           # Alert logic
│   │       ├── budget.ts           # Budget calculations
│   │       └── saudi-calendar.ts   # Saudi occasions
│   ├── hooks/
│   │   ├── useClients.ts
│   │   ├── useCampaigns.ts
│   │   ├── useAlerts.ts
│   │   └── useAI.ts
│   └── types/
│       ├── client.ts               # Client types
│       ├── campaign.ts             # Campaign types
│       ├── content.ts              # Content types
│       └── user.ts                 # User types
├── public/
│   └── markiq-logo.svg
├── .env.local                      # Environment variables
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```
