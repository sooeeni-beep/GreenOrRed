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
import { ExpertHeader, ExpertFooter } from "./Chrome";
import { platforms, strategyTypes, selectProducts } from "../shared/catalog.mjs";
import "../../Indicator Page/src/indicator.css";
import "./expert.css";
const Img = ({ name, alt = "", ...props }) => (
  <img
    src={"/assets/exp-" + name + ".webp"}
    alt={alt}
    decoding="async"
    {...props}
  />
);
const promises = [
  ["verified","Verified Performance","عملکرد تأییدشده","Real trading results","نتایج واقعی معاملات"],
  ["safe","Safe & Secure","امن و مطمئن","Checked for malware","بررسی امنیت فایل"],
  ["updates","Lifetime Updates","به‌روزرسانی مادام‌العمر","Stay up to date","همیشه به‌روز"],
  ["trusted","Trusted by Traders","مورد اعتماد معامله‌گران","A global community","جامعهٔ جهانی"],
];
const platformLabels = {
  mt4:["EAs","اکسپرت‌ها"], mt5:["EAs","اکسپرت‌ها"], ctrader:["cBots","سی‌بات‌ها"],
  tradingview:["Strategies","استراتژی‌ها"], ninjatrader:["Strategies","استراتژی‌ها"],
};
export default function ExpertPage() {
  const { t, lang } = useI18n();
  const [products, setProducts] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  const [query, setQuery] = useState(""),
    [platform, setPlatform] = useState([]),
    [strategyType, setStrategyType] = useState([]),
    [maxPrice, setMaxPrice] = useState(null),
    [sort, setSort] = useState("newest"),
    [layout, setLayout] = useState("grid"),
    [filtersOpen, setFiltersOpen] = useState(false),
    [page, setPage] = useState(1),
    [favorites, setFavorites] = useState([]),
    [verifiedOnly, setVerifiedOnly] = useState(false),
    [cart, setCart] = useState([]),
    [modal, setModal] = useState(null),
    [toast, setToast] = useState("");
  const load = () => {
    setLoading(true);
    setError("");
    fetch("/api/experts")
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw Error();
        setProducts(d.config.products);
      })
      .catch(() =>
        setError(
          t(
            "Unable to load expert advisors and strategies. Please retry.",
            "بارگذاری اکسپرت‌ها و استراتژی‌ها ممکن نشد. دوباره تلاش کنید.",
          ),
        ),
      )
      .finally(() => setLoading(false));
  };
  useEffect(load, []);
  useEffect(() => {
    document.title = t(
      "Expert Advisors & Strategies — GreenOrRed",
      "اکسپرت‌ها و استراتژی‌ها — گرین‌اوررد",
    );
  }, [lang]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(
    () => setPage(1),
    [query, platform, strategyType, maxPrice, sort, verifiedOnly],
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
        strategyType,
        maxPrice: maxPrice ?? Infinity,
        verifiedOnly,
        sort,
      }).filter((p) => !verifiedOnly || p.verifiedResults),
    [
      products,
      query,
      platform,
      strategyType,
      maxPrice,
      sort,
      verifiedOnly,
      favorites,
    ],
  );
  const batchStart = useRef(null);
  const visible = found.slice(0, page * 12);
  useEffect(() => {
    if (batchStart.current === null) return;
    document.getElementById(`expert-${batchStart.current}`)?.scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start'});
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
    setStrategyType([]);
    setMaxPrice(null);
    setVerifiedOnly(false);
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
    strategyType.length +
    (maxPrice !== null ? 1 : 0) +
    (verifiedOnly ? 1 : 0);
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
          aria-label={t("Search EAs or strategies", "جست‌وجوی اکسپرت و استراتژی")}
          placeholder={t("Search EAs or strategies…", "جست‌وجوی اکسپرت و استراتژی…")}
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
        <legend>{t("Strategy Type", "نوع استراتژی")}</legend>
        {strategyTypes.map(([id, en, fa]) => (
          <label key={id}>
            <input
              type="checkbox"
              checked={strategyType.includes(id)}
              onChange={() => toggle(strategyType, setStrategyType, id)}
            />
            <span>{t(en, fa)}</span>
            <small>
              {num(products.filter((p) => p.strategyType === id).length)}
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
          checked={verifiedOnly}
          onChange={(e) => setVerifiedOnly(e.target.checked)}
        />
        {t("Verified Results Only", "فقط نتایج تأییدشده")}
      </label>
    </>
  );
  return (
    <div className="indicator-page expert-page">
      <a href="#indicator-main" className="skip-link">
        {t("Skip to content")}
      </a>
      <ExpertHeader
        query={query}
        setQuery={setQuery}
        onSearch={() =>
          document
            .getElementById("indicator-catalog")
            .scrollIntoView({ behavior: "smooth" })
        }
        cartCount={cart.length}
        onCart={() => setModal({ kind: "cart" })}
        open={open}
      />
      <main className="page ind-main" id="indicator-main">
        <div className="ind-breadcrumb">
          <a href="/">{t("Home", "خانه")}</a>
          <ChevronRight size={14} />
          <span>{t("Indicators", "اندیکاتورها")}</span>
        </div>
        <section className="ind-hero exp-hero" aria-labelledby="ind-title">
          <div className="ind-hero-copy">
            <h1 id="ind-title">{t("Expert Advisors &","اکسپرت‌ها و")} <em>{t("Strategies","استراتژی‌ها")}</em></h1>
            <h2>{t("Automate. Backtest. Trade Smarter.","خودکارسازی. بک‌تست. معاملهٔ هوشمندتر.")}</h2>
            <p>{t(
              "Discover professional Expert Advisors and ready-to-use strategies for MetaTrader 4, MetaTrader 5, cTrader, TradingView and NinjaTrader. Built by experts and presented with the product’s own verified data when supplied.",
              "اکسپرت‌های حرفه‌ای و استراتژی‌های آماده برای متاتریدر ۴، متاتریدر ۵، سی‌تریدر، تریدینگ‌ویو و نینجاتریدر را پیدا کنید. داده‌های تأییدشده فقط زمانی نمایش داده می‌شوند که برای همان محصول ثبت شده باشند."
            )}</p>
            <div className="ind-promises">{promises.map(([id,en,fa,sub,subFa])=>(
              <div key={id}><Img name={id}/><span><strong>{t(en,fa)}</strong><small>{t(sub,subFa)}</small></span></div>
            ))}</div>
          </div>
          <div className="ind-hero-art exp-hero-art">
            <Img name="hero" alt={t("Trading automation workspace with a robot assistant","محیط معاملات خودکار با دستیار رباتیک")} width="1000" height="760" fetchPriority="high"/>
            <Img name="handwrite-1" className="exp-handwrite-one" alt="Let Strategies Work for You!" lang="en"/>
            <Img name="handwrite-2" className="exp-handwrite-two" alt="Same Market. More Opportunities." lang="en"/>
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
                <small>{t(...platformLabels[id])}</small>
              </span>
            </button>
          ))}
        </nav>
        <section id="expert-catalog" className="ind-catalog">
          <aside className="ind-filters">{FilterBody()}</aside>
          <div className="ind-results">
            <div className="ind-toolbar">
              <h2>
                {loading
                  ? t("Loading expert advisors & strategies…", "در حال بارگذاری…")
                  : t(
                      `${num(found.length)} Expert Advisors & Strategies`,
                      `${num(found.length)} اکسپرت و استراتژی`,
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
                {strategyType.map((id) => (
                  <button
                    key={id}
                    onClick={() => toggle(strategyType, setStrategyType, id)}
                  >
                    {t(...strategyTypes.find((p) => p[0] === id).slice(1))}
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
                        "No matching expert advisors or strategies",
                        "اکسپرت یا استراتژی مطابق فیلترها پیدا نشد",
                      )
                    : t(
                        "Your expert & strategy collection starts here",
                        "فروشگاه اکسپرت و استراتژی شما از اینجا آغاز می‌شود",
                      )}
                </h3>
                <p>
                  {products.length
                    ? t(
                        "Try another platform or clear your filters.",
                        "پلتفرم دیگری انتخاب کنید یا فیلترها را پاک کنید.",
                      )
                    : t(
                        "Published expert advisors and strategies will appear here. Add your first product through Manage.",
                        "اکسپرت‌ها و استراتژی‌های منتشرشده در این بخش نمایش داده می‌شوند. اولین محصول را از بخش مدیریت اضافه کنید.",
                      )}
                </p>
                {products.length ? (
                  <button className="ind-button outline" onClick={clear}>
                    {t("Clear filters", "پاک‌کردن فیلترها")}
                  </button>
                ) : (
                  <a
                    className="ind-button outline"
                    href="/expert-preview/manage"
                  >
                    {t("Manage experts & strategies", "مدیریت اکسپرت و استراتژی")}
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
                  <article className="ind-product" id={`expert-${p.id}`} key={p.id}>
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
                      {(p.profitFactor != null || p.winRate != null || p.maxDrawdown != null) && (
                        <dl className="exp-performance">
                          {p.profitFactor != null && <><dt>{t("Profit Factor","ضریب سود")}</dt><dd>{p.profitFactor.toFixed(2)}</dd></>}
                          {p.winRate != null && <><dt>{t("Win Rate","نرخ برد")}</dt><dd>{num(p.winRate)}%</dd></>}
                          {p.maxDrawdown != null && <><dt>{t("Max Drawdown","حداکثر افت")}</dt><dd>{num(p.maxDrawdown)}%</dd></>}
                        </dl>
                      )}
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
            {visible.length < found.length && <div className="ind-pagination"><button className="ind-button" onClick={more}>{t('View more','نمایش بیشتر')}</button></div>}

          </div>
        </section>
        <section className="ind-custom exp-custom">
          <Img name="custom-paper" className="asset" />
          <div><h2>{t("Can’t find the right strategy?","استراتژی مناسب را پیدا نکردید؟")}</h2>
          <p>{t("Request a custom Expert Advisor tailored to your trading style.","یک اکسپرت اختصاصی متناسب با سبک معاملاتی خود درخواست کنید.")}</p></div>
          <button className="ind-button" onClick={()=>open(t("Request Custom EA","درخواست اکسپرت اختصاصی"))}>{t("Request Custom EA","درخواست اکسپرت اختصاصی")}<ArrowRight size={17}/></button>
          <div className="ind-custom-features">{[
            ["custom-gear","Built by Experts","ساخته‌شده توسط متخصصان","Custom development","توسعهٔ اختصاصی"],
            ["custom-fast","Fast Delivery","تحویل سریع","Get a quote","دریافت برآورد"],
            ["custom-secure","Secure & Private","امن و خصوصی","Your ideas are safe","ایده‌های شما محفوظ است"],
          ].map(([id,en,fa,sub,subFa])=><div key={id}><Img name={id}/><span><strong>{t(en,fa)}</strong><small>{t(sub,subFa)}</small></span></div>)}</div>
        </section>
      </main>
      <ExpertFooter open={open} />
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
                `Show ${num(found.length)} indicators`,
                `نمایش ${num(found.length)} اندیکاتور`,
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
                <dt>{t("Strategy Type","نوع استراتژی")}</dt>
                <dd>{t(...strategyTypes.find((x)=>x[0]===modal.product.strategyType).slice(1))}</dd>
                <dt>{t("Verified Results","نتایج تأییدشده")}</dt>
                <dd>{modal.product.verifiedResults ? t("Yes","بله") : t("Not supplied","ثبت نشده")}</dd>
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
                "This service is not connected in the expert & strategy preview. No request or account has been submitted.",
                "این سرویس در پیش‌نمایش اکسپرت و استراتژی هنوز متصل نیست؛ درخواست یا حسابی ثبت نشده است.",
              )}
            </p>
          )}
        </Modal>
      )}
    </div>
  );
}
