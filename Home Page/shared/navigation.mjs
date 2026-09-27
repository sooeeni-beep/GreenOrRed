export const navigation = [
  {
    id: "marketplace",
    en: "Marketplace",
    fa: "بازارچه",
    items: [
      ["/marketplace/indicators", "Indicators", "اندیکاتورها"],
      [
        "/marketplace/experts",
        "Experts & Strategies",
        "اکسپرت‌ها و استراتژی‌ها",
      ],
      ["/marketplace/scripts", "Scripts & Utilities", "اسکریپت‌ها و ابزارها"],
      ["/marketplace/signals", "Trading Signals", "سیگنال‌های معاملاتی"],
    ],
  },
  {
    id: "education",
    en: "Education",
    fa: "آموزش",
    items: [
      ["/education/courses", "Courses", "دوره‌ها"],
      ["/education/educators", "Top Educators", "مدرسان برتر"],
      ["/education/teach", "Become an Educator", "آموزش‌دهنده شوید"],
    ],
  },
  {
    id: "journal",
    en: "Trading Journal",
    fa: "ژورنال معاملاتی",
    items: [
      ["/journal", "Journal", "ژورنال"],
      ["/journal/analytics", "Analytics", "تحلیل‌ها"],
      ["/journal/performance", "Performance", "عملکرد"],
    ],
  },
  {
    id: "developers",
    en: "For Developers",
    fa: "برای توسعه‌دهندگان",
    items: [
      ["/developers/affiliate", "Affiliate Program", "همکاری در فروش"],
      ["/developers/requests", "Custom Requests", "درخواست‌های اختصاصی"],
      ["/developers/documentation", "Documentation", "مستندات"],
      ["/developers/api", "API Access", "دسترسی API"],
    ],
  },
];
export const destination = (path) =>
  navigation
    .flatMap((g) => g.items)
    .find((x) => x[0] === path.replace(/\/$/, ""));
