// lib/utils/saudi-calendar.ts
// ============================================
// التقويم السعودي والمناسبات الوطنية
// ============================================

export interface SaudiOccasion {
  name: string;
  nameEn: string;
  date: string; // MM-DD
  type: "national" | "religious" | "commercial";
  recommendedContent: string;
  leadDays: number; // كم يوم قبل تبدأ الحملة
}

export const SAUDI_OCCASIONS_2026: SaudiOccasion[] = [
  {
    name: "اليوم الوطني السعودي",
    nameEn: "Saudi National Day",
    date: "09-23",
    type: "national",
    recommendedContent: "محتوى وطني يعكس الفخر والانتماء للمملكة",
    leadDays: 14,
  },
  {
    name: "يوم التأسيس",
    nameEn: "Saudi Founding Day",
    date: "02-22",
    type: "national",
    recommendedContent: "محتوى تاريخي يحتفي بتأسيس المملكة",
    leadDays: 14,
  },
  {
    name: "عيد الأضحى المبارك",
    nameEn: "Eid Al-Adha",
    date: "06-05",
    type: "religious",
    recommendedContent: "تهاني العيد، عروض موسمية، محتوى عائلي",
    leadDays: 21,
  },
  {
    name: "عيد الفطر المبارك",
    nameEn: "Eid Al-Fitr",
    date: "03-30",
    type: "religious",
    recommendedContent: "تهاني العيد، عروض ما بعد رمضان",
    leadDays: 14,
  },
  {
    name: "شهر رمضان المبارك",
    nameEn: "Ramadan",
    date: "03-01",
    type: "religious",
    recommendedContent: "محتوى رمضاني، عروض الإفطار والسحور، محتوى روحاني",
    leadDays: 21,
  },
  {
    name: "يوم الأسرة السعودية",
    nameEn: "Saudi Family Day",
    date: "05-25",
    type: "national",
    recommendedContent: "محتوى عائلي، عروض للعائلات، أنشطة العائلة",
    leadDays: 7,
  },
  {
    name: "موسم الرياض",
    nameEn: "Riyadh Season",
    date: "10-01",
    type: "commercial",
    recommendedContent: "محتوى ترفيهي، عروض الموسم، تجارب متميزة",
    leadDays: 14,
  },
  {
    name: "الجمعة البيضاء",
    nameEn: "White Friday",
    date: "11-27",
    type: "commercial",
    recommendedContent: "عروض وخصومات كبيرة، محتوى تسويقي مباشر",
    leadDays: 14,
  },
  {
    name: "اليوم العالمي للمرأة",
    nameEn: "International Women's Day",
    date: "03-08",
    type: "commercial",
    recommendedContent: "محتوى يحتفي بالمرأة السعودية (للأنشطة المناسبة)",
    leadDays: 7,
  },
  {
    name: "يوم الحب",
    nameEn: "Valentine's Day",
    date: "02-14",
    type: "commercial",
    recommendedContent: "عروض مميزة، محتوى رومانسي راقٍ",
    leadDays: 7,
  },
];

export function getUpcomingOccasions(
  days: number = 30
): (SaudiOccasion & { daysUntil: number })[] {
  const today = new Date();
  const currentYear = today.getFullYear();

  return SAUDI_OCCASIONS_2026
    .map((occasion) => {
      const [month, day] = occasion.date.split("-").map(Number);
      let occasionDate = new Date(currentYear, month - 1, day);

      // إذا مرت المناسبة هذا العام، نضيف سنة
      if (occasionDate < today) {
        occasionDate = new Date(currentYear + 1, month - 1, day);
      }

      const daysUntil = Math.ceil(
        (occasionDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      return { ...occasion, daysUntil };
    })
    .filter((o) => o.daysUntil <= days && o.daysUntil >= 0)
    .sort((a, b) => a.daysUntil - b.daysUntil);
}

export function getSaudiOccasionForDate(date: Date): SaudiOccasion | null {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const dateStr = `${month}-${day}`;

  return SAUDI_OCCASIONS_2026.find((o) => o.date === dateStr) || null;
}

// أوقات الصلاة التقريبية في الرياض (للتجنب عند النشر)
export function getPrayerTimeBlocks(): string[] {
  return [
    "04:30-05:00", // الفجر
    "12:15-12:45", // الظهر
    "15:30-16:00", // العصر
    "18:15-18:45", // المغرب
    "19:45-20:15", // العشاء
  ];
}

export function isGoodTimeToPost(hour: number, minute: number): boolean {
  const currentTime = hour * 60 + minute;
  const prayerBlocks = [
    [4 * 60 + 30, 5 * 60],
    [12 * 60 + 15, 12 * 60 + 45],
    [15 * 60 + 30, 16 * 60],
    [18 * 60 + 15, 18 * 60 + 45],
    [19 * 60 + 45, 20 * 60 + 15],
  ];

  return !prayerBlocks.some(
    ([start, end]) => currentTime >= start && currentTime <= end
  );
}


// lib/utils/alerts.ts
// ============================================
// نظام التنبيهات الذكي
// ============================================

export interface AlertConfig {
  budgetOverageThreshold: number;    // % — يُنبّه عند التجاوز (افتراضي: 100)
  budgetWarningThreshold: number;    // % — يُنبّه عند الاقتراب (افتراضي: 80)
  ctrWarningThreshold: number;       // CTR أدنى من هذا = تحذير (افتراضي: 0.5 × المتوسط)
  roiWarningThreshold: number;       // ROI أدنى من هذا = تحذير (افتراضي: 1.5)
  contractRenewalDays: number;       // أيام قبل انتهاء العقد (افتراضي: 7)
  occasionLeadDays: number;          // أيام قبل المناسبة (افتراضي: 14)
}

export const DEFAULT_ALERT_CONFIG: AlertConfig = {
  budgetOverageThreshold: 100,
  budgetWarningThreshold: 80,
  ctrWarningThreshold: 1.2,
  roiWarningThreshold: 1.5,
  contractRenewalDays: 7,
  occasionLeadDays: 14,
};

export function calculateBudgetStatus(
  spent: number,
  limit: number
): { status: "ok" | "warning" | "exceeded"; percentage: number } {
  const percentage = (spent / limit) * 100;

  if (percentage >= DEFAULT_ALERT_CONFIG.budgetOverageThreshold) {
    return { status: "exceeded", percentage };
  }
  if (percentage >= DEFAULT_ALERT_CONFIG.budgetWarningThreshold) {
    return { status: "warning", percentage };
  }
  return { status: "ok", percentage };
}

export function calculateROI(
  revenue: number,
  spend: number
): number {
  if (spend === 0) return 0;
  return revenue / spend;
}

export function calculateCPO(
  spend: number,
  orders: number
): number {
  if (orders === 0) return 0;
  return spend / orders;
}
