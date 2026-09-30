import React, { useState } from "react";
import { Search, Globe, ChevronDown, Menu, X, ArrowRight } from "lucide-react";
import { Asset } from "../../Home Page/src/components";
import { useI18n } from "../../Home Page/src/i18n";
import { navigate } from "../../Home Page/src/navigation";
import { navigation } from "../../Home Page/shared/navigation.mjs";
export function IndicatorHeader({
  query,
  setQuery,
  onSearch,
  cartCount = 0,
  onCart,
  open,
}) {
  const { t, lang, setLang } = useI18n();
  const [menu, setMenu] = useState(false),
    [active, setActive] = useState(null);
  return (
    <header className="site-header">
      <div className="header-inner">
        <a
          href="/"
          className="brand"
          aria-label={t("Home", "خانه")}
        >
          <Asset name="brand" alt="GreenOrRed" />
        </a>
        <nav
          className={menu ? "nav open" : "nav"}
          aria-label={t("Main navigation")}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setActive(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.currentTarget.querySelector('[aria-expanded="true"]')?.focus();
              setActive(null);
            }
          }}
        >
          {navigation.map((g) => (
            <div className="nav-group" key={g.id}>
              <button
                aria-expanded={active === g.id}
                aria-controls={"ind-nav-" + g.id}
                onClick={() => setActive(active === g.id ? null : g.id)}
              >
                {t(g.en, g.fa)}
                <ChevronDown size={12} />
              </button>
              <div
                className="nav-dropdown"
                id={"ind-nav-" + g.id}
                hidden={active !== g.id}
              >
                {g.items.map(([href, en, fa]) => (
                  <a
                    key={href}
                    href={href === "/marketplace/scripts" ? "#script-catalog" : href}
                    onClick={(e) => {
                      setMenu(false);
                      setActive(null);

                    }}
                  >
                    {t(en, fa)}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </nav>
        <form
          className="header-search"
          onSubmit={(e) => {
            e.preventDefault();
            onSearch();
          }}
        >
          <button aria-label={t("Search products")}>
            <Search size={18} />
          </button>
          <input
            aria-label={t("Search products")}
            placeholder={t("Search scripts…", "جست‌وجوی اسکریپت‌ها…")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>
        <button
          className="header-cart"
          onClick={onCart}
          aria-label={t("Open cart", "بازکردن سبد")}
        >
          <Asset name="cart" />
          <span>{cartCount}</span>
        </button>
        <button className="login" onClick={() => open(t("Log In"))}>
          {t("Log In")}
        </button>
        <button className="signup" onClick={() => open(t("Sign Up"))}>
          {t("Sign Up")}
        </button>
        <button
          className="language"
          onClick={() => setLang(lang === "en" ? "fa" : "en")}
          aria-label={t("Switch language")}
        >
          <Globe size={14} />
          {lang === "en" ? "EN" : "FA"}
          <ChevronDown size={10} />
        </button>
        <button
          className="mobile-menu"
          onClick={() => setMenu(!menu)}
          aria-label={t("Toggle navigation")}
          aria-expanded={menu}
        >
          {menu ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}

export function IndicatorFooter({ open }) {
  const { t } = useI18n();
  return (
    <footer className="site-footer page">
      <div className="footer-brand">
        <Asset name="brand" alt="GreenOrRed" />
        <small>
          {t(
            "© 2026 GreenOrRed. All rights reserved.",
            "© ۲۰۲۶ گرین‌اوررد. تمامی حقوق محفوظ است.",
          )}
        </small>
      </div>
      {[
        ["Marketplace", "Scripts & Utilities", "Experts", "Scripts", "Signals"],
        ["Education", "Courses", "Top Educators", "Become an Educator"],
        ["Trading Journal", "Journal", "Analytics", "Performance", "Community"],
        [
          "For Developers",
          "Affiliate Program",
          "Custom Requests",
          "Documentation",
          "API Access",
        ],
        [
          "Support",
          "Help Center",
          "Contact Us",
          "Terms of Service",
          "Privacy Policy",
        ],
      ].map(([title, ...links]) => (
        <div className="footer-column" key={title}>
          <h3>{t(title)}</h3>
          {links.map((link) => (
            <button key={link} onClick={() => ["Scripts & Utilities","Scripts","Experts"].includes(link) ? navigate(link === "Experts" ? "/marketplace/experts" : "/marketplace/scripts") : link === "Indicators" ? navigate("/marketplace/indicators") : open(link)}>
              {t(link, link === "Scripts & Utilities" ? "اسکریپت‌ها و ابزارها" : undefined)}
            </button>
          ))}
        </div>
      ))}
      <div className="footer-follow">
        <h3>{t("Follow Us")}</h3>
        <div className="socials">
          {["x", "youtube", "discord", "telegram"].map((id) => (
            <button
              key={id}
              onClick={() =>
                open(
                  id,
                  "An official social profile URL has not been supplied yet.",
                )
              }
              aria-label={id}
            >
              <Asset name={"social-" + id} />
            </button>
          ))}
        </div>
        <Asset
          name="footer-tagline"
          alt="Trade Smarter. Grow together."
          lang="en"
        />
      </div>
      <div className="footer-test">
        <span>
          {t(
            "INDICATOR PREVIEW · Checkout is not connected.",
            "پیش‌نمایش اسکریپت‌ها · پرداخت هنوز متصل نیست.",
          )}
        </span>
        <a href="/scripts-preview/manage">
          {t("Manage scripts", "مدیریت اسکریپت‌ها")}
          <ArrowRight size={14} />
        </a>
      </div>
    </footer>
  );
}
