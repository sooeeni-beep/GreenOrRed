import React, { useEffect, useState } from "react";
import {
  Search,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  Globe,
  ShoppingCart,
} from "lucide-react";
import { Asset, AssetButton, More, Modal } from "./components";
import { ModuleContent } from "./sections";
import { visibleModules, toggleModule } from "../shared/config.mjs";
import Admin from "./Admin";
import HeroMedia from "./HeroMedia";
import { I18nProvider, useI18n } from "./i18n";
export default function App() {
  return (
    <I18nProvider>
      {location.pathname.startsWith("/admin") ? <Admin /> : <Home />}
    </I18nProvider>
  );
}
function Home() {
  const [config, setConfig] = useState(null),
    [error, setError] = useState(""),
    [active, setActive] = useState(null),
    [menu, setMenu] = useState(false),
    [query, setQuery] = useState(""),
    [search, setSearch] = useState(""),
    [modal, setModal] = useState(null),
    [cart, setCart] = useState([]),
    [toast, setToast] = useState("");
  const { t, lang, setLang } = useI18n();
  const load = () => {
    setError("");
    fetch("/api/home")
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw Error(d.error);
        setConfig(d.config);
      })
      .catch((e) => setError(e.message));
  };
  useEffect(load, []);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 3200);
    return () => clearTimeout(timer);
  }, [toast]);
  const modules = config ? visibleModules(config) : [],
    cards = modules.filter((m) => m.display === "expandable"),
    fixed = modules.filter((m) => m.display === "permanent");
  const current = cards.find((m) => m.id === active);
  const open = (title, description) =>
    setModal({
      title: t(title),
      description:
        (description ? t(description) : null) ||
        t(
          "This destination is part of the next development stage. The homepage is ready; this service is not connected yet.",
          "این مقصد در مرحلهٔ بعدی توسعه ساخته می‌شود. صفحهٔ هوم آماده است، اما این سرویس هنوز متصل نشده است.",
        ),
    });
  const showModule = (type) => {
    const m = modules.find((m) => m.type === type);
    setMenu(false);
    if (!m) {
      open(type, "This service is not currently displayed on the homepage.");
      return;
    }
    if (m.display === "expandable") {
      setActive(m.id);
      setTimeout(
        () =>
          document
            .getElementById("module-panel")
            ?.scrollIntoView({ behavior: "smooth", block: "nearest" }),
        50,
      );
    } else
      document.getElementById(m.type)?.scrollIntoView({ behavior: "smooth" });
  };
  const addToCart = (p) => {
    setCart((c) => [...c, p]);
    setToast(
      t(p.name + " added to demo cart", p.name + " به سبد نمایشی اضافه شد"),
    );
  };
  const submitSearch = (e) => {
    e.preventDefault();
    setQuery(search.trim());
    showModule("products");
  };
  return (
    <>
      <a href="#main" className="skip-link">
        {t("Skip to content")}
      </a>
      <header className="site-header">
        <div className="header-inner">
          <a href="/" className="brand">
            <Asset name="brand" alt="GreenOrRed homepage" />
          </a>
          <nav
            className={menu ? "nav open" : "nav"}
            aria-label={t("Main navigation")}
          >
            <button onClick={() => showModule("traders")}>
              {t("Marketplace", "بازارچه")}
              <ChevronDown size={12} />
            </button>
            <button onClick={() => showModule("educators")}>
              {t("Education", "آموزش")}
              <ChevronDown size={12} />
            </button>
            <button onClick={() => showModule("journal")}>
              {t("Trading Journal", "ژورنال معاملاتی")}
            </button>
            <button onClick={() => showModule("developers")}>
              {t("For Developers", "توسعه‌دهندگان")}
            </button>
          </nav>
          <form className="header-search" onSubmit={submitSearch}>
            <button aria-label={t("Search products")}>
              <Search size={18} />
            </button>
            <input
              aria-label={t("Search products")}
              placeholder={t(
                "Search products, educators, tools…",
                "جست‌وجوی محصولات و ابزارها…",
              )}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
          <button
            className="header-cart"
            onClick={() =>
              setModal({ title: t("Your demo cart", "سبد نمایشی"), cart: true })
            }
            aria-label={t(
              "Open demo cart, " + cart.length + " items",
              "بازکردن سبد نمایشی با " + cart.length + " کالا",
            )}
          >
            <Asset name="cart" />
            <span>{cart.length}</span>
          </button>
          <button className="login" onClick={() => open("Log In")}>
            {t("Log In", "ورود")}
          </button>
          <button className="signup" onClick={() => open("Sign Up")}>
            {t("Sign Up", "ثبت‌نام")}
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
      <main id="main" className="page">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">
              {t(
                "ALL TOOLS YOU NEED FOR A BETTER TRADING JOURNEY",
                "تمام ابزارهای لازم برای مسیر معاملاتی بهتر",
              )}
            </p>
            <h1>
              {t("Trade Smarter.", "هوشمندانه معامله کن.")}
              <br />
              {t("Learn Faster.", "سریع‌تر یاد بگیر.")}
              <br />
              <span>{t("Grow Together.", "با هم رشد کنیم.")}</span>
            </h1>
            <p className="hero-description">
              {t(
                "GreenOrRed is the all-in-one platform for traders, built with real indicators, expert advisors, courses, custom tools, signals, keep your trading journal, and request custom tools — built by traders, for traders.",
                "گرین‌اوررد، پلتفرم یکپارچهٔ معامله‌گران؛ اندیکاتورها، ابزارهای تخصصی، دوره‌ها، سیگنال‌ها و ژورنال معاملاتی — ساختهٔ معامله‌گران برای معامله‌گران.",
              )}
            </p>
            <div className="hero-actions">
              <AssetButton
                name="marketplace-cta"
                label="Explore Marketplace"
                onClick={() => showModule("traders")}
              />
              <AssetButton
                name="journal-hero-cta"
                label="Start Free Journal"
                onClick={() => showModule("journal")}
              />
              <button className="watch" onClick={() => showModule("videos")}>
                <Asset name="play" />
                {t("Watch Video", "تماشای ویدئو")}
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <HeroMedia hero={config?.hero} />
            <div className="platforms">
              <span>{t("Supported Platforms", "پلتفرم‌های پشتیبانی‌شده")}</span>
              <div>
                {[
                  ["mt4", "MetaTrader 4"],
                  ["mt5", "MetaTrader 5"],
                  ["ctrader", "cTrader"],
                  ["tradingview", "TradingView"],
                  ["ninjatrader", "NinjaTrader"],
                ].map(([id, title]) => (
                  <Asset key={id} name={id} alt={title} />
                ))}
              </div>
            </div>
          </div>
          <div className="hero-stats">
            {[
              ["members", "Community", "انجمن معامله‌گران"],
              ["products", "Trading tools", "ابزارهای معاملاتی"],
              ["educators", "Education", "آموزش"],
              ["satisfaction", "Built for traders", "برای معامله‌گران"],
            ].map(([id, en, fa]) => (
              <div key={id}>
                <Asset name={id} />
                <span>
                  <strong>{t(en, fa)}</strong>
                </span>
              </div>
            ))}
          </div>
        </section>
        {error ? (
          <div className="error" role="alert">
            {t(
              "Could not load the homepage. Please try again.",
              "بارگذاری صفحه ممکن نشد. دوباره تلاش کنید.",
            )}
            <button onClick={load}>{t("Retry")}</button>
          </div>
        ) : !config ? (
          <div className="loading" role="status">
            {t("Loading your trading space…")}
          </div>
        ) : (
          <>
            <section className="path-section" aria-labelledby="path-title">
              <h2 id="path-title">
                {t("What Brings You Here?", "چه چیزی شما را به اینجا آورده؟")}
              </h2>
              <p>
                {t(
                  "Choose your path and explore what matters to you.",
                  "مسیر خود را انتخاب کنید و بخش موردنیازتان را ببینید.",
                )}
              </p>
              <div className="path-grid">
                {cards.map((m) => (
                  <button
                    key={m.id}
                    id={"card-" + m.id}
                    className={
                      "path-card " +
                      m.theme +
                      (active === m.id ? " active" : "")
                    }
                    onClick={() => setActive(toggleModule(active, m.id))}
                    aria-expanded={active === m.id}
                    aria-controls="module-panel"
                  >
                    <Asset
                      name={
                        [
                          "traders",
                          "developers",
                          "educators",
                          "videos",
                        ].includes(m.type)
                          ? m.type + "-card"
                          : "traders-card"
                      }
                      src={m.cardIcon || undefined}
                      className="path-icon"
                    />
                    <span>
                      <strong>{t(m.title, m.titleFa)}</strong>
                      <small>{t(m.description, m.descriptionFa)}</small>
                      {m.status !== "active" && <em>{t(m.status)}</em>}
                    </span>
                    <Asset
                      name={
                        [
                          "traders",
                          "developers",
                          "educators",
                          "videos",
                        ].includes(m.type)
                          ? m.type + "-arrow"
                          : "traders-arrow"
                      }
                      className="path-arrow"
                    />
                  </button>
                ))}
              </div>
              {cards.length === 0 && (
                <p className="empty">
                  {t(
                    "More services are on their way.",
                    "سرویس‌های بیشتری در راه هستند.",
                  )}
                </p>
              )}
            </section>
            <div
              id="module-panel"
              role="region"
              aria-labelledby={current ? "card-" + current.id : undefined}
              hidden={!current}
            >
              {current && (
                <div className="expanded-content" key={current.id}>
                  <div className="panel-toolbar">
                    <span>{t(current.title, current.titleFa)}</span>
                    <button
                      onClick={() => {
                        document.getElementById("card-" + active)?.focus();
                        setActive(null);
                      }}
                    >
                      <X size={16} />
                      {t("Close section", "بستن بخش")}
                    </button>
                  </div>
                  <ModuleContent
                    module={current}
                    open={open}
                    t={t}
                    addToCart={addToCart}
                    content={config.content}
                    query={query}
                  />
                </div>
              )}
            </div>
            {fixed.map((m) => (
              <div className="permanent-block" key={m.id}>
                <ModuleContent
                  module={m}
                  open={open}
                  t={t}
                  addToCart={addToCart}
                  content={config.content}
                  query={query}
                />
              </div>
            ))}
          </>
        )}
      </main>
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
          ["Marketplace", "Indicators", "Experts", "Scripts", "Signals"],
          ["Education", "Courses", "Top Educators", "Become an Educator"],
          [
            "Trading Journal",
            "Journal",
            "Analytics",
            "Performance",
            "Community",
          ],
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
              <button key={link} onClick={() => open(link)}>
                {t(link)}
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
          <p className="footer-tagline">
            {t(
              "Trade Smarter. Grow together.",
              "هوشمندانه معامله کن. با هم رشد کنیم.",
            )}
          </p>
        </div>
        <div className="footer-test">
          <span>
            {t(
              "TEST DEMO · Services and figures shown are illustrative.",
              "دموی آزمایشی · خدمات و اعداد نمایشی هستند.",
            )}
          </span>
          <a href="/admin">
            {t("Manage homepage", "مدیریت صفحهٔ هوم")}
            <ArrowRight size={14} />
          </a>
        </div>
      </footer>
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
      {modal && (
        <Modal title={modal.title} onClose={() => setModal(null)}>
          {modal.cart ? (
            <>
              <p className="muted">
                {t("Demo cart — checkout and payments are not connected.")}
              </p>
              {cart.length === 0 ? (
                <p>{t("Your cart is empty.")}</p>
              ) : (
                <>
                  <ul className="cart-list">
                    {cart.map((p, i) => (
                      <li key={i}>
                        <span>{p.name}</span>
                        <strong>
                          {new Intl.NumberFormat(
                            lang === "fa" ? "fa-IR" : "en-US",
                            { style: "currency", currency: p.currency },
                          ).format(p.price)}
                        </strong>
                        <button
                          onClick={() =>
                            setCart((c) => c.filter((_, j) => j !== i))
                          }
                          aria-label={t("Remove " + p.name, "حذف " + p.name)}
                        >
                          <X size={16} />
                        </button>
                      </li>
                    ))}
                  </ul>
                  <p className="cart-total">
                    {t("Total")}{" "}
                    <b>
                      {[...new Set(cart.map((p) => p.currency))]
                        .map((currency) =>
                          new Intl.NumberFormat(
                            lang === "fa" ? "fa-IR" : "en-US",
                            { style: "currency", currency },
                          ).format(
                            cart
                              .filter((p) => p.currency === currency)
                              .reduce((sum, p) => sum + p.price, 0),
                          ),
                        )
                        .join(" + ")}
                    </b>
                  </p>
                </>
              )}
            </>
          ) : (
            <p>{t(modal.description)}</p>
          )}
        </Modal>
      )}
    </>
  );
}
