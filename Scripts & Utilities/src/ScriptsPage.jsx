import ViewMore from "../../Home Page/src/ViewMore";
import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  Star,
  ArrowRight,
  Search,
  Heart,
  LayoutGrid,
  List,
  SlidersHorizontal,
  X,
  Layers,
  Package,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Asset, Modal } from "../../Home Page/src/components";
import { useI18n } from "../../Home Page/src/i18n";
import { IndicatorHeader, IndicatorFooter } from "./Chrome";
import { platforms, categories, selectProducts } from "../shared/catalog.mjs";
import "../../Indicator Page/src/indicator.css";
import "./scripts.css";
const Img = ({ name, alt = "", ...props }) => (
  <img
    src={"/assets/scr-" + name + ".webp"}
    alt={alt}
    decoding="async"
    {...props}
  />
);
const benefits = [];
const promises = [
 ["efficiency","Boost Efficiency","افزایش بهره‌وری","Save time & reduce manual work","صرفه‌جویی در زمان و کاهش کار دستی"],
 ["automate","Automate Tasks","خودکارسازی کارها","Let tools do the work","انجام کارها با ابزارهای خودکار"],
 ["accuracy","Improve Accuracy","افزایش دقت","Minimize human error","کاهش خطای انسانی"],
 ["compatible","Compatible Platforms","پلتفرم‌های سازگار","MT4 / MT5 / cTrader / TradingView","متاتریدر / سی‌تریدر / تریدینگ‌ویو"],
 ["creators","Created by Experts","ساختهٔ متخصصان","Tools from developers","ابزارهای توسعه‌دهندگان"]
];
export default function ScriptsPage() {
  const { t, lang } = useI18n();
  const [products, setProducts] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  const [query, setQuery] = useState(""),
    [platform, setPlatform] = useState([]),
    [category, setCategory] = useState([]),
    [maxPrice, setMaxPrice] = useState(null),
    [sort, setSort] = useState("newest"),
    [layout, setLayout] = useState("grid"),
    [filtersOpen, setFiltersOpen] = useState(false),
    [page, setPage] = useState(1),
    [favorites, setFavorites] = useState([]),
    [favoriteOnly, setFavoriteOnly] = useState(false),
    [cart, setCart] = useState([]),
    [modal, setModal] = useState(null),
    [toast, setToast] = useState("");
  const load = () => {
    setLoading(true);
    setError("");
    fetch("/api/scripts")
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw Error();
        setProducts(d.config.products);
      })
      .catch(() =>
        setError(
          t(
            "Unable to load scripts. Please retry.",
            "بارگذاری اسکریپت‌ها ممکن نشد. دوباره تلاش کنید.",
          ),
        ),
      )
      .finally(() => setLoading(false));
  };
  useEffect(load, []);
  useEffect(() => {
    document.title = t(
      "Scripts & Utilities — GreenOrRed",
      "اسکریپت‌های معاملاتی — گرین‌اوررد",
    );
  }, [lang]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(
    () => setPage(1),
    [query, platform, category, maxPrice, sort, favoriteOnly],
  );
  const title = (p) => t(p.title, p.titleFa);
  const desc = (p) => t(p.description, p.descriptionFa);
  const money = (n) =>
    new Intl.NumberFormat(lang === "fa" ? "fa-IR" : "en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(n);
  const num = (n) =>
    new Intl.NumberFormat(lang === "fa" ? "fa-IR" : "en-US").format(n);
  const upper = Math.max(
    500,
    ...products.map((p) => Math.ceil(p.price / 50) * 50),
  );
  const found = useMemo(
    () =>
      selectProducts(products, {
        query,
        platform,
        category,
        maxPrice: maxPrice ?? Infinity,
        sort,
      }).filter((p) => !favoriteOnly || favorites.includes(p.id)),
    [
      products,
      query,
      platform,
      category,
      maxPrice,
      sort,
      favoriteOnly,
      favorites,
    ],
  );
  const batchStart = useRef(null);
  const visible = found.slice(0, page * 8);
  useEffect(() => {
    if (batchStart.current === null) return;
    document.getElementById(`script-${batchStart.current}`)?.scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start'});
    batchStart.current = null;
  }, [page]);
  const more = () => {
    batchStart.current = found[visible.length]?.id ?? null;
    setPage(p => p + 1);
  };
  const toggle = (value, setter, id) =>
    setter(value.includes(id) ? value.filter((x) => x !== id) : [...value, id]);
  const clear = () => {
    setQuery("");
    setPlatform([]);
    setCategory([]);
    setMaxPrice(null);
    setFavoriteOnly(false);
  };
  const open = (name) => setModal({ kind: "info", title: name });
  const add = (p) => {
    if (p.access === 'signal-provider') { open(t('Available only after verified signal-provider eligibility. Downloads are not connected yet.', 'دسترسی پس از تأیید صلاحیت ارائه‌دهندهٔ سیگنال؛ دانلود هنوز متصل نشده است.')); return; }
    if (!cart.includes(p.id)) {
      setCart([...cart, p.id]);
      setToast(t("Added to preview cart", "به سبد آزمایشی اضافه شد"));
    } else setModal({ kind: "cart" });
  };
  const cartProducts = products.filter((p) => cart.includes(p.id));
  const filterCount =
    platform.length +
    category.length +
    (maxPrice !== null ? 1 : 0) +
    (favoriteOnly ? 1 : 0);
  const FilterBody = () => (
    <>
      <div className="ind-filter-heading">
        <h2>{t("Filter Products", "فیلتر محصولات")}</h2>
        {filterCount > 0 && (
          <button onClick={clear}>{t("Reset", "پاک‌کردن")}</button>
        )}
      </div>
      <div className="ind-search">
        <input
          aria-label={t("Search scripts", "جست‌وجوی اسکریپت‌ها")}
          placeholder={t("Search scripts…", "جست‌وجوی اسکریپت‌ها…")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Search size={17} />
      </div>
      <fieldset>
        <legend>{t("Platform", "پلتفرم")}</legend>
        <label>
          <input
            type="checkbox"
            checked={!platform.length}
            onChange={() => setPlatform([])}
          />
          <span>{t("All Platforms", "همهٔ پلتفرم‌ها")}</span>
          <small>{num(products.length)}</small>
        </label>
        {platforms.map(([id, en, fa]) => (
          <label key={id}>
            <input
              type="checkbox"
              checked={platform.includes(id)}
              onChange={() => toggle(platform, setPlatform, id)}
            />
            <span>{t(en, fa)}</span>
            <small>
              {num(products.filter((p) => p.platforms.includes(id)).length)}
            </small>
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>{t("Category", "دسته‌بندی")}</legend>
        {categories.map(([id, en, fa]) => (
          <label key={id}>
            <input
              type="checkbox"
              checked={category.includes(id)}
              onChange={() => toggle(category, setCategory, id)}
            />
            <span>{t(en, fa)}</span>
            <small>
              {num(products.filter((p) => p.category === id).length)}
            </small>
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>{t("Price Range", "محدودهٔ قیمت")}</legend>
        <input
          className="ind-range"
          aria-label={t("Maximum price in USD", "حداکثر قیمت به دلار")}
          type="range"
          min="0"
          max={upper}
          step="1"
          value={maxPrice ?? upper}
          onChange={(e) => setMaxPrice(+e.target.value)}
        />
        <div className="ind-price-labels">
          <span>{money(0)}</span>
          <output>
            {maxPrice === null ? t("Any price", "هر قیمت") : money(maxPrice)}
          </output>
        </div>
      </fieldset>
      <fieldset>
        <legend>{t("Rating", "امتیاز")}</legend>
        <p className="ind-filter-note">
          {t(
            "Rating filters will be available with verified customer reviews.",
            "فیلتر امتیاز پس از ثبت دیدگاه‌های معتبر خریداران فعال می‌شود.",
          )}
        </p>
      </fieldset>
      <label className="ind-favorite-filter">
        <input
          type="checkbox"
          checked={favoriteOnly}
          onChange={(e) => setFavoriteOnly(e.target.checked)}
        />
        {t("Favorites in this session", "علاقه‌مندی‌های این نشست")}
      </label>
    </>
  );
  return (
    <div className="indicator-page scripts-page">
      <a href="#script-main" className="skip-link">
        {t("Skip to content")}
      </a>
      <IndicatorHeader
        query={query}
        setQuery={setQuery}
        onSearch={() =>
          document
            .getElementById("script-catalog")
            .scrollIntoView({ behavior: "smooth" })
        }
        cartCount={cart.length}
        onCart={() => setModal({ kind: "cart" })}
        open={open}
      />
      <main className="page ind-main" id="script-main">
        <div className="ind-breadcrumb">
          <a href="/">{t("Home", "خانه")}</a>
          <ChevronRight size={14} />
          <span>{t("Scripts & Utilities", "اسکریپت‌ها")}</span>
        </div>
        <section className="ind-hero" aria-labelledby="ind-title">
          <div className="ind-hero-copy">
            <h1 id="ind-title">
              {t("Scripts &", "اسکریپت‌ها و")} <em>{t("Utilities", "ابزارها")}</em>
            </h1>
            <h2>
              {t(
                "Enhance Your Trading Experience.",
                "تجربهٔ معاملاتی خود را بهبود دهید.",
              )}
            </h2>
            <p>
              {t(
                "Save time, automate tasks and get more from your trading platform with scripts and utilities for MetaTrader, cTrader and TradingView.",
                "با اسکریپت‌ها و ابزارهای معاملاتی در زمان صرفه‌جویی کنید، کارها را خودکار کنید و از پلتفرم خود بیشتر بهره ببرید.",
              )}
            </p>
            <div className="ind-promises">
              {promises.map(([id, en, fa, sub, subFa]) => (
                <div key={id}>
                  <Img name={id} />
                  <span>
                    <strong>{t(en, fa)}</strong>
                    <small>{t(sub, subFa)}</small>
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="ind-hero-art">
            <Img
              name="hero"
              alt={t(
                "Trading tools, charts and script code",
                "تصویر ابزارهای معاملاتی، نمودار و کد اسکریپت",
              )}
              width="1100"
              height="760"
              fetchPriority="high"
            />
            <Img
              name="handwriting"
              className="ind-handwriting"
              alt="Small Scripts. Big Impact!"
              lang="en"
            />
          </div>
          <div className="ind-benefits" hidden>
            {benefits.map(([id, en, fa]) => (
              <div key={id}>
                <Img name={id} />
                <span>{t(en, fa)}</span>
              </div>
            ))}
          </div>
        </section>
        <nav
          className="ind-platforms"
          aria-label={t("Filter by platform", "فیلتر بر اساس پلتفرم")}
        >
          <button
            className={!platform.length ? "active" : ""}
            aria-pressed={!platform.length}
            onClick={() => setPlatform([])}
          >
            <Layers />
            <span>{t("All Platforms", "همهٔ پلتفرم‌ها")}</span>
          </button>
          {platforms.map(([id, en, fa]) => (
            <button
              key={id}
              className={
                platform.length === 1 && platform[0] === id ? "active" : ""
              }
              aria-pressed={platform.length === 1 && platform[0] === id}
              onClick={() => setPlatform([id])}
            >
              <Img name={id} />
              <span>
                <strong>{t(en, fa)}</strong>
                <small>{t("Scripts & Utilities", "اسکریپت‌ها")}</small>
              </span>
            </button>
          ))}
        </nav>
        <section id="script-catalog" className="ind-catalog">
          <aside className="ind-filters">{FilterBody()}</aside>
          <div className="ind-results">
            <div className="ind-toolbar">
              <h2>
                {loading
                  ? t("Loading scripts…", "در حال بارگذاری…")
                  : t(
                      `${num(found.length)} Scripts & Utilities Found`,
                      `${num(found.length)} اسکریپت پیدا شد`,
                    )}
              </h2>
              <button
                className="ind-mobile-filter"
                onClick={() => setFiltersOpen(true)}
              >
                <SlidersHorizontal size={16} />
                {t("Filters", "فیلترها")}
                {filterCount ? ` (${num(filterCount)})` : ""}
              </button>
              <select
                aria-label={t("Sort products", "مرتب‌سازی محصولات")}
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="newest">
                  {t("Sort by: Newest", "مرتب‌سازی: جدیدترین")}
                </option>
                <option value="price-low">
                  {t("Price: Low to high", "قیمت: کم به زیاد")}
                </option>
                <option value="price-high">
                  {t("Price: High to low", "قیمت: زیاد به کم")}
                </option>
                <option value="name">{t("Name: A–Z", "نام محصول")}</option>
              </select>
              <div className="ind-layout-toggle">
                <button
                  aria-label={t("Grid view", "نمای شبکه‌ای")}
                  aria-pressed={layout === "grid"}
                  onClick={() => setLayout("grid")}
                >
                  <LayoutGrid size={18} />
                </button>
                <button
                  aria-label={t("List view", "نمای فهرستی")}
                  aria-pressed={layout === "list"}
                  onClick={() => setLayout("list")}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
            {(filterCount > 0 || query) && (
              <div className="ind-active-filters">
                {platform.map((id) => (
                  <button
                    key={id}
                    onClick={() => toggle(platform, setPlatform, id)}
                  >
                    {t(...platforms.find((p) => p[0] === id).slice(1))}
                    <X size={12} />
                  </button>
                ))}
                {category.map((id) => (
                  <button
                    key={id}
                    onClick={() => toggle(category, setCategory, id)}
                  >
                    {t(...categories.find((p) => p[0] === id).slice(1))}
                    <X size={12} />
                  </button>
                ))}
                <button onClick={clear}>
                  {t("Clear all", "پاک‌کردن همه")}
                </button>
              </div>
            )}
            {error ? (
              <div className="ind-empty" role="alert">
                <p>{error}</p>
                <button className="ind-button" onClick={load}>
                  {t("Retry")}
                </button>
              </div>
            ) : loading ? (
              <div className="ind-empty" aria-live="polite">
                {t("Loading your catalog…", "در حال بارگذاری فروشگاه…")}
              </div>
            ) : !found.length ? (
              <div className="ind-empty">
                <Package size={42} strokeWidth={1.2} />
                <h3>
                  {products.length
                    ? t(
                        "No matching scripts",
                        "اسکریپتی مطابق فیلترها پیدا نشد",
                      )
                    : t(
                        "Your script collection starts here",
                        "فروشگاه اسکریپت شما از اینجا آغاز می‌شود",
                      )}
                </h3>
                <p>
                  {products.length
                    ? t(
                        "Try another platform or clear your filters.",
                        "پلتفرم دیگری انتخاب کنید یا فیلترها را پاک کنید.",
                      )
                    : t(
                        "Published scripts will appear here. Add your first product through Manage scripts.",
                        "اسکریپت‌های منتشرشده در این بخش نمایش داده می‌شوند. اولین محصول را از مدیریت اسکریپت‌ها اضافه کنید.",
                      )}
                </p>
                {products.length ? (
                  <button className="ind-button outline" onClick={clear}>
                    {t("Clear filters", "پاک‌کردن فیلترها")}
                  </button>
                ) : (
                  <a
                    className="ind-button outline"
                    href="/scripts-preview/manage"
                  >
                    {t("Manage scripts", "مدیریت اسکریپت‌ها")}
                    <ArrowRight size={16} />
                  </a>
                )}
              </div>
            ) : (
              <div
                className={
                  "ind-product-grid " + (layout === "list" ? "as-list" : "")
                }
              >
                {visible.map((p) => (
                  <article className="ind-product" id={`script-${p.id}`} key={p.id}>
                    <div className="ind-product-image">
                      {p.badge && p.badge !== 'none' && <span className={`ind-badge ${p.badge}`}>{t(...({bestseller:['Bestseller','پرفروش'],new:['New','جدید'],popular:['Popular','محبوب']}[p.badge]))}</span>}
                      <button
                        className="ind-image-open"
                        onClick={() =>
                          setModal({ kind: "product", product: p })
                        }
                        aria-label={t("View details: ", "جزئیات: ") + title(p)}
                      >
                        <img
                          src={p.image}
                          alt={title(p)}
                          loading="lazy"
                          width="640"
                          height="360"
                        />
                      </button>
                      <button
                        className={
                          "ind-heart " +
                          (favorites.includes(p.id) ? "selected" : "")
                        }
                        aria-label={t("Favorite: ", "علاقه‌مندی: ") + title(p)}
                        aria-pressed={favorites.includes(p.id)}
                        onClick={() => toggle(favorites, setFavorites, p.id)}
                      >
                        <Heart size={20} />
                      </button>
                    </div>
                    <div className="ind-product-body">
                      <div className="ind-product-platforms">
                        {platforms.map(([id]) => id).filter(id => p.platforms.includes(id)).map((id) => (
                          <Img
                            key={id}
                            name={id}
                            alt={t(
                              ...platforms.find((x) => x[0] === id).slice(1),
                            )}
                            title={platforms.find((x) => x[0] === id)[1]}
                          />
                        ))}
                      </div>
                      <h3>{title(p)}</h3>
                      <p>{desc(p)}</p>
                      {lang === "fa" && (!p.titleFa || !p.descriptionFa) && (
                        <small className="ind-translation-note">
                          ترجمهٔ کامل این محصول هنوز ثبت نشده است؛ متن اصلی
                          نمایش داده می‌شود.
                        </small>
                      )}
                      <div className="ind-rating" aria-label={t('No reviews yet', 'هنوز امتیازی ثبت نشده')}>
                        {[1,2,3,4,5].map(n => <Star key={n} size={14} aria-hidden="true" />)}
                        <small>{t('No reviews yet','بدون امتیاز')}</small>
                      </div>
                      {p.access === 'signal-provider' && <small className="ind-access">{t('Signal providers only','ویژهٔ ارائه‌دهندگان سیگنال')}</small>}
                      <div className="ind-product-meta">
                        <small>{p.creator}</small>
                        <strong>
                          {p.price === 0 ? t("Free", "رایگان") : money(p.price)}
                        </strong>
                      </div>
                      <div className="ind-product-actions">
                        <button
                          className="ind-button outline"
                          onClick={() =>
                            setModal({ kind: "product", product: p })
                          }
                        >
                          {t("View Details", "جزئیات")}
                        </button>
                        <button className="ind-button" onClick={() => add(p)}>
                          {p.access === 'signal-provider' ? t('Restricted access','دسترسی ویژه') : cart.includes(p.id)
                            ? t("In Cart", "در سبد")
                            : t("Add to Cart", "افزودن به سبد")}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
            {visible.length < found.length && <ViewMore onClick={more}>{t('View More','نمایش بیشتر')}</ViewMore>}

          </div>
        </section>
        <section className="scripts-custom">
          <Img name="custom-icon" className="scripts-custom-icon"/>
          <div><h2>{t("Need a Custom Script or Utility?","اسکریپت یا ابزار اختصاصی نیاز دارید؟")}</h2><p>{t("Tell us what you need. We’ll find the right creator for you.","نیازتان را بگویید تا سازندهٔ مناسب را پیدا کنید.")}</p></div>
          <div className="scripts-steps">{[["1","Submit your request","ثبت درخواست","Describe your idea or need","شرح ایده یا نیاز"],["2","Get offers","دریافت پیشنهاد","From our creator community","از جامعهٔ سازندگان"],["3","Receive & use","دریافت و استفاده","Get your script and start trading","دریافت ابزار و شروع معامله"]].map(([n,en,fa,sub,subFa])=><div key={n}><Img name={"step-"+n}/><span><strong>{t(en,fa)}</strong><small>{t(sub,subFa)}</small></span></div>)}</div>
          <button className="ind-button" onClick={()=>open(t("Request a Custom Script","درخواست اسکریپت اختصاصی"))}>{t("Request a Custom Script","درخواست اسکریپت اختصاصی")}<ArrowRight size={17}/></button>
        </section>
      </main>
      <IndicatorFooter open={open} />
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
      {filtersOpen && (
        <Modal
          title={t("Filter Products", "فیلتر محصولات")}
          onClose={() => setFiltersOpen(false)}
        >
          <div className="ind-filter-dialog">
            {FilterBody()}
            <button
              className="ind-button"
              onClick={() => setFiltersOpen(false)}
            >
              {t(
                `Show ${num(found.length)} scripts`,
                `نمایش ${num(found.length)} اسکریپت`,
              )}
            </button>
          </div>
        </Modal>
      )}
      {modal && (
        <Modal
          title={
            modal.kind === "product"
              ? title(modal.product)
              : modal.kind === "cart"
                ? t("Your preview cart", "سبد آزمایشی شما")
                : modal.title
          }
          onClose={() => setModal(null)}
        >
          {modal.kind === "product" ? (
            <div className="ind-details">
              <img src={modal.product.image} alt={title(modal.product)} />
              <p>{desc(modal.product)}</p>
              <dl>
                <dt>{t("Creator", "سازنده")}</dt>
                <dd>{modal.product.creator || "—"}</dd>
                <dt>{t("Platforms", "پلتفرم‌ها")}</dt>
                <dd>
                  {modal.product.platforms
                    .map((id) =>
                      t(...platforms.find((x) => x[0] === id).slice(1)),
                    )
                    .join(" · ")}
                </dd>
                <dt>{t("Price", "قیمت")}</dt>
                <dd>{modal.product.price === 0 ? t('Free','رایگان') : money(modal.product.price)}</dd>
              </dl>
              <button className="ind-button" onClick={() => add(modal.product)}>
                {t("Add to Cart", "افزودن به سبد")}
              </button>
              <small>
                {t(
                  "Preview only. Payment, licenses and downloads are not connected.",
                  "صرفاً پیش‌نمایش؛ پرداخت، مجوز و دانلود هنوز متصل نیستند.",
                )}
              </small>
            </div>
          ) : modal.kind === "cart" ? (
            <div className="ind-cart">
              <p>
                {t(
                  "Preview cart — no order or payment is submitted. Items are kept for this session only.",
                  "سبد آزمایشی؛ سفارش یا پرداختی انجام نمی‌شود. موارد فقط در این نشست نگه داشته می‌شوند.",
                )}
              </p>
              {cartProducts.length ? (
                cartProducts.map((p) => (
                  <div className="ind-cart-row" key={p.id}>
                    <span>{title(p)}</span>
                    <strong>{money(p.price)}</strong>
                    <button
                      onClick={() => setCart(cart.filter((id) => id !== p.id))}
                      aria-label={t("Remove ", "حذف ") + title(p)}
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))
              ) : (
                <p>{t("Your cart is empty.", "سبد شما خالی است.")}</p>
              )}
              {cartProducts.length > 0 && (
                <p>
                  <strong>
                    {t("Total", "مجموع")}:{" "}
                    {money(cartProducts.reduce((s, p) => s + p.price, 0))}
                  </strong>
                </p>
              )}
            </div>
          ) : (
            <p>
              {t(
                "This service is not connected in the script preview. No request or account has been submitted.",
                "این سرویس در پیش‌نمایش اسکریپت‌ها هنوز متصل نیست؛ درخواست یا حسابی ثبت نشده است.",
              )}
            </p>
          )}
        </Modal>
      )}
    </div>
  );
}
