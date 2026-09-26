import React, { createContext, useContext, useEffect, useState } from "react";
const dict = {
  "Explore Marketplace": "ورود به بازارچه",
  "Start Free Journal": "شروع ژورنال رایگان",
  "Start Journaling Free": "شروع ژورنال رایگان",
  "Join Affiliate Program": "پیوستن به همکاری در فروش",
  "Submit a Request": "ثبت درخواست",
  "Explore Education": "مشاهدهٔ آموزش‌ها",
  "View Profile": "مشاهدهٔ پروفایل",
  "Start Learning Today": "شروع یادگیری",
  Close: "بستن",
  "Close dialog": "بستن پنجره",
  "View All": "مشاهدهٔ همه",
  Marketplace: "بازارچه",
  Indicators: "اندیکاتورها",
  Experts: "اکسپرت‌ها",
  Scripts: "اسکریپت‌ها",
  Signals: "سیگنال‌ها",
  Education: "آموزش",
  Courses: "دوره‌ها",
  "Top Educators": "مدرسان برتر",
  "Become an Educator": "آموزش‌دهنده شوید",
  "Trading Journal": "ژورنال معاملاتی",
  Journal: "ژورنال",
  Analytics: "تحلیل‌ها",
  Performance: "عملکرد",
  Community: "انجمن",
  "For Developers": "برای توسعه‌دهندگان",
  "Affiliate Program": "همکاری در فروش",
  "Custom Requests": "درخواست‌های اختصاصی",
  Documentation: "مستندات",
  "API Access": "دسترسی API",
  Support: "پشتیبانی",
  "Help Center": "مرکز راهنما",
  "Contact Us": "تماس با ما",
  "Terms of Service": "شرایط استفاده",
  "Privacy Policy": "حریم خصوصی",
  "Follow Us": "ما را دنبال کنید",
  "Log In": "ورود",
  "Sign Up": "ثبت‌نام",
  "Learn more": "بیشتر بدانید",
  TradeTube: "تریدتیوب",
  "Trading Tools": "ابزارهای معاملاتی",
  "No content has been published yet.": "هنوز محتوایی منتشر نشده است.",
  "This service is not currently displayed on the homepage.":
    "این سرویس در حال حاضر در صفحهٔ اصلی نمایش داده نمی‌شود.",
  "An official social profile URL has not been supplied yet.":
    "نشانی رسمی این شبکهٔ اجتماعی هنوز تعیین نشده است.",
  "Your cart is empty.": "سبد شما خالی است.",
  "Demo cart — checkout and payments are not connected.":
    "سبد آزمایشی — پرداخت و ثبت سفارش هنوز فعال نیست.",
  Total: "مجموع",
  "Skip to content": "رفتن به محتوا",
  "Loading your trading space…": "در حال بارگذاری فضای معاملاتی شما…",
  Retry: "تلاش دوباره",
  "Main navigation": "منوی اصلی",
  "Search products": "جست‌وجوی محصولات",
  "Toggle navigation": "باز و بسته‌کردن منو",
  "Switch language": "تغییر زبان",
  "TEST DEMO · Services and figures shown are illustrative.":
    "نسخهٔ آزمایشی · سرویس‌ها هنوز در حال تکمیل هستند.",
  "Manage homepage": "مدیریت صفحهٔ اصلی",
  active: "فعال",
  "coming-soon": "به‌زودی",
  maintenance: "در حال نگهداری",
  "read-only": "فقط خواندنی",
  archived: "بایگانی",
  "This module is currently read-only.": "این بخش در حال حاضر فقط خواندنی است.",
};
const C = createContext(null);
export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() =>
    localStorage.getItem("gor-language") === "fa" ? "fa" : "en",
  );
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "fa" ? "rtl" : "ltr";
    localStorage.setItem("gor-language", lang);
  }, [lang]);
  const t = (en, fa) => (lang === "fa" ? fa || dict[en] || en : en);
  return <C.Provider value={{ lang, setLang, t }}>{children}</C.Provider>;
}
export const useI18n = () => useContext(C);
