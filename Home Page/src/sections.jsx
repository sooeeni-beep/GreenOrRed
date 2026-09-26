import React, { useState } from "react";
import { ArrowRight, Play } from "lucide-react";
import { Asset, AssetButton, More, Modal } from "./components";
import { Blocks } from "./Blocks";
import { useI18n } from "./i18n";
import { localizedContent } from "../shared/media.mjs";
export function SectionTitle({ title, description, action, onAction }) {
  return (
    <div className="section-heading">
      <div>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {action && <More onClick={onAction}>{action}</More>}
    </div>
  );
}
export function Tools({ open, t }) {
  const cards = [
    [
      "indicators",
      "Indicators",
      "اندیکاتورها",
      "Professional indicators to analyze markets with precision.",
      "اندیکاتورهای تخصصی برای تحلیل دقیق بازارها.",
    ],
    [
      "experts",
      "Experts & Strategies",
      "اکسپرت‌ها و استراتژی‌ها",
      "Automated trading systems and strategy tools.",
      "سیستم‌های معاملاتی خودکار و ابزارهای استراتژی.",
    ],
    [
      "scripts",
      "Scripts & Utilities",
      "اسکریپت‌ها و ابزارهای کاربردی",
      "Powerful scripts and utilities to simplify your trading.",
      "ابزارهایی برای ساده‌ترکردن معاملات شما.",
    ],
    [
      "signals",
      "Trading Signals",
      "سیگنال‌های معاملاتی",
      "Trading signals from creators and providers.",
      "سیگنال‌های معاملاتی ارائه‌دهندگان و سازندگان.",
    ],
  ];
  return (
    <section>
      <SectionTitle
        title={t("Trading Tools", "ابزارهای معاملاتی")}
        description={t(
          "Everything you need for a smarter trading experience.",
          "هر آنچه برای تجربهٔ معاملاتی هوشمندتر نیاز دارید.",
        )}
        action={t("View All Tools", "همهٔ ابزارها")}
        onAction={() => open("Marketplace")}
      />
      <div className="tool-grid">
        {cards.map(([id, title, fa, desc, descFa]) => (
          <button
            className="tool-card"
            onClick={() => open(t(title, fa))}
            key={id}
          >
            <Asset
              name={id + "-chart"}
              className="tool-preview"
              alt={t(
                "Illustrative interface preview",
                "تصویر نمونهٔ رابط کاربری",
              )}
            />
            <div className="tool-description">
              <Asset name={id + "-icon"} className="tool-icon" />
              <div>
                <h3>{t(title, fa)}</h3>
                <p>{t(desc, descFa)}</p>
              </div>
              <Asset name="tool-arrow" className="tiny-arrow" />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
export function Developers({ module, open, t }) {
  const lists = {
    affiliate: [
      ["High commission rates", "نرخ همکاری مناسب"],
      ["Track referrals", "پیگیری معرفی‌ها"],
      ["Track earnings", "پیگیری درآمد"],
      ["Grow together", "رشد همراه یکدیگر"],
    ],
    requests: [
      [
        "Get it built by our team or the community",
        "ساخت توسط تیم ما یا توسعه‌دهندگان",
      ],
      ["Compare offers from developers", "مقایسهٔ پیشنهادهای توسعه‌دهندگان"],
      ["Track progress and communicate easily", "پیگیری پیشرفت و ارتباط آسان"],
    ],
  };
  return (
    <section>
      <SectionTitle
        title={t(
          "Build Your Tools. Grow Your Business.",
          "ابزارت را بساز. کسب‌وکارت را رشد بده.",
        )}
        description={t(
          "Create. Collaborate. Earn.",
          "بسازید، همکاری کنید و درآمد داشته باشید.",
        )}
        action={t("See All Opportunities", "همهٔ فرصت‌ها")}
        onAction={() =>
          open(t("Developer opportunities", "فرصت‌های توسعه‌دهندگان"))
        }
      />
      <div className="business-grid">
        {["affiliate", "requests"]
          .filter((id) => module.blocks.includes(id))
          .map((id) => (
            <article
              className={
                "business-card " +
                (id === "affiliate" ? "affiliate" : "requests")
              }
              key={id}
            >
              <Asset
                name={id === "affiliate" ? "affiliate-icon" : "request-paper"}
                className="business-icon"
              />
              <div className="business-copy">
                <h3>
                  {t(
                    id === "affiliate"
                      ? "Affiliate Program"
                      : "Custom Requests",
                  )}
                </h3>
                <p>
                  {id === "affiliate"
                    ? t(
                        "You trade, we connect. Earn by sharing great tools.",
                        "با معرفی ابزارهای کاربردی درآمد کسب کنید.",
                      )
                    : t(
                        "Need a specific indicator or EA? Submit your request.",
                        "اندیکاتور یا اکسپرت اختصاصی می‌خواهید؟ درخواست دهید.",
                      )}
                </p>
                <ul>
                  {lists[id].map(([en, fa]) => (
                    <li key={en}>
                      <Asset
                        name={
                          id === "affiliate"
                            ? "affiliate-check"
                            : "request-check"
                        }
                      />
                      {t(en, fa)}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="business-art">
                <Asset
                  name={
                    id === "affiliate" ? "affiliate-chart" : "request-monitor"
                  }
                />
                <AssetButton
                  name={id === "affiliate" ? "affiliate-cta" : "request-cta"}
                  label={
                    id === "affiliate"
                      ? "Join Affiliate Program"
                      : "Submit a Request"
                  }
                  onClick={() =>
                    open(
                      id === "affiliate"
                        ? "Affiliate Program"
                        : "Custom Requests",
                    )
                  }
                />
              </div>
            </article>
          ))}
      </div>
      {module.blocks.length === 0 && (
        <p className="empty">
          {t(
            "No opportunities are currently displayed.",
            "در حال حاضر فرصتی برای نمایش وجود ندارد.",
          )}
        </p>
      )}
    </section>
  );
}
export function Education({ open, t }) {
  return (
    <section>
      <SectionTitle
        title={t(
          "Learn from Expert Traders",
          "از معامله‌گران حرفه‌ای بیاموزید",
        )}
        description={t(
          "Gain knowledge. Improve your skills. Trade with confidence.",
          "دانش کسب کنید، مهارت بسازید و با اطمینان معامله کنید.",
        )}
      />
      <div className="education-layout">
        <article className="education-panel">
          <Asset name="education-cap" />
          <div>
            <h3>{t("Education")}</h3>
            <p>
              {t(
                "Learn from professional traders and industry experts. Courses, webinars and practical trading education for all levels.",
                "از معامله‌گران و متخصصان حرفه‌ای یاد بگیرید؛ دوره‌ها، وبینارها و آموزش عملی برای تمام سطوح.",
              )}
            </p>
            <AssetButton
              name="education-cta"
              label="Explore Education"
              onClick={() => open("Education")}
            />
          </div>
        </article>
        <div className="educators">
          <div className="sub-heading">
            <h3>{t("Top Educators")}</h3>
          </div>
          <p className="empty">
            {t(
              "Educator profiles will appear after they are published.",
              "پروفایل مدرسان پس از انتشار در این بخش نمایش داده می‌شود.",
            )}
          </p>
        </div>
        <div className="education-banner localized-banner">
          <h3>
            {t(
              "Invest in your knowledge. Trade in your future.",
              "روی دانشت سرمایه‌گذاری کن؛ آینده‌ات را بساز.",
            )}
          </h3>
          <div className="book-art">
            <Asset
              name="education-banner"
              alt={t("Books and a plant", "کتاب‌ها و گیاه")}
            />
          </div>
          <AssetButton
            name="learning-cta"
            label="Start Learning Today"
            onClick={() => open("Education")}
          />
        </div>
      </div>
    </section>
  );
}
function ContentCopy({ item }) {
  const { lang, t } = useI18n();
  const [original, setOriginal] = useState(false);
  const title = localizedContent(item, "title", lang),
    desc = localizedContent(item, "description", lang);
  return (
    <div className="content-copy">
      <h3>{original ? item.title : title.text}</h3>
      {(original ? item.description : desc.text) && (
        <p>{original ? item.description : desc.text}</p>
      )}
      {(title.missing || desc.missing) && (
        <small className="translation-note">
          {t(
            "Translation is not ready; original text is shown.",
            "ترجمه هنوز آماده نیست؛ متن اصلی نمایش داده می‌شود.",
          )}
        </small>
      )}
      {lang !== item.originalLanguage && !title.missing && (
        <button
          className="original-toggle"
          onClick={() => setOriginal(!original)}
        >
          {original
            ? t("Show translation", "نمایش ترجمه")
            : t("Show original", "نمایش متن اصلی")}
        </button>
      )}
    </div>
  );
}
export function Videos({ content = [], open, t }) {
  const [video, setVideo] = useState(null);
  const list = content.filter((c) => c.kind === "video");
  return (
    <section>
      <SectionTitle
        title={t("TradeTube")}
        description={t(
          "Watch. Learn. Share. Go Live.",
          "ببینید، یاد بگیرید، به اشتراک بگذارید و زنده پخش کنید.",
        )}
      />
      {!list.length ? (
        <p className="empty catalog-empty">
          {t(
            "No videos have been published yet.",
            "هنوز ویدئویی منتشر نشده است.",
          )}
        </p>
      ) : (
        <div className="video-grid real-videos">
          {list.map((v) => (
            <article className="video-card" key={v.id}>
              <button
                className="video-thumb"
                onClick={() =>
                  v.video
                    ? setVideo(v)
                    : v.url
                      ? location.assign(v.url)
                      : open(t(v.title, v.titleFa))
                }
              >
                <img src={v.image} alt={t(v.title, v.titleFa)} />
                <Play size={26} />
              </button>
              <ContentCopy item={v} />
              <div className="creator">{v.creator}</div>
            </article>
          ))}
        </div>
      )}
      {video && (
        <Modal
          title={t(video.title, video.titleFa)}
          onClose={() => setVideo(null)}
        >
          <video
            src={video.video}
            poster={video.image}
            controls
            autoPlay
            playsInline
            className="expanded-video"
          />
        </Modal>
      )}
    </section>
  );
}
export function Journal({ module, open, t }) {
  return (
    <section className="journal-section" id="journal">
      <div className="journal-layout">
        <div className="journal-copy">
          <h2>{t(module.title, module.titleFa)}</h2>
          <p>
            {t(module.description, module.descriptionFa)}{" "}
            <span className="free-label">{t("100% Free", "۱۰۰٪ رایگان")}</span>
          </p>
          <div className="journal-features">
            {[
              [
                "insights",
                "AI-Powered Insights",
                "بینش‌های هوشمند",
                "Understand your trading patterns.",
                "الگوهای معاملاتی خود را بشناسید.",
              ],
              [
                "analytics",
                "Performance Analytics",
                "تحلیل عملکرد",
                "Discover your strengths and weaknesses.",
                "نقاط قوت و ضعف خود را کشف کنید.",
              ],
              [
                "goals",
                "Set & Achieve Goals",
                "تعیین هدف و پیگیری آن",
                "Build better habits and track your progress.",
                "عادت‌های بهتر بسازید و پیشرفتتان را دنبال کنید.",
              ],
            ].map(([id, en, fa, desc, descFa]) => (
              <div key={id}>
                <Asset name={id} />
                <div>
                  <h3>{t(en, fa)}</h3>
                  <p>{t(desc, descFa)}</p>
                </div>
              </div>
            ))}
          </div>
          <AssetButton
            name="journal-cta"
            label="Start Journaling Free"
            onClick={() => open("Trading Journal")}
          />
        </div>
        <figure className="journal-figure">
          <Asset
            name="journal-devices"
            className="journal-device"
            alt={t(
              "Illustrative journal interface",
              "تصویر نمونهٔ رابط ژورنال",
            )}
          />
          <figcaption>
            {t(
              "Interface preview — not live account data",
              "نمونهٔ رابط کاربری — دادهٔ حساب واقعی نیست",
            )}
          </figcaption>
        </figure>
        <div className="leaderboard">
          <h3>{t("Top Journal Traders", "معامله‌گران برتر ژورنال")}</h3>
          <p className="empty">
            {t(
              "Rankings will appear when verified journal data is available.",
              "رتبه‌بندی پس از در دسترس بودن دادهٔ معتبر ژورنال نمایش داده می‌شود.",
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
export function Products({ module, content = [], open, addToCart, query, t }) {
  const { lang } = useI18n();
  const [tab, setTab] = useState("newest");
  let list = content.filter((c) => c.kind === "product");
  list = [...list].sort((a, b) =>
    tab === "price"
      ? a.currency.localeCompare(b.currency) || a.price - b.price
      : b.createdAt.localeCompare(a.createdAt),
  );
  if (query)
    list = list.filter((p) =>
      (p.title + " " + p.titleFa + " " + p.creator + " " + p.category)
        .toLowerCase()
        .includes(query.toLowerCase()),
    );
  return (
    <section className="products-section" id="products">
      <div className="products-heading">
        <SectionTitle
          title={t(module.title, module.titleFa)}
          description={t(module.description, module.descriptionFa)}
        />
        <div
          className="tabs"
          role="tablist"
          aria-label={t("Product sorting", "مرتب‌سازی محصولات")}
        >
          {[
            ["newest", "Newest", "جدیدترین"],
            ["price", "Price by currency", "قیمت به تفکیک ارز"],
          ].map(([id, en, fa]) => (
            <button
              role="tab"
              aria-selected={tab === id}
              key={id}
              onClick={() => setTab(id)}
            >
              {t(en, fa)}
            </button>
          ))}
        </div>
      </div>
      {query && (
        <p className="search-result">
          {t("Search results for", "نتایج جست‌وجوی")} «{query}»
        </p>
      )}
      {!list.length ? (
        <p className="empty catalog-empty">
          {t(
            query
              ? "No products match your search."
              : "No products have been published yet.",
            query
              ? "محصولی مطابق جست‌وجوی شما وجود ندارد."
              : "هنوز محصولی منتشر نشده است.",
          )}
        </p>
      ) : (
        <div className="product-grid">
          {list.map((p) => (
            <article className="product-card real-product" key={p.id}>
              <button
                className="product-art"
                onClick={() =>
                  p.url ? location.assign(p.url) : open(t(p.title, p.titleFa))
                }
              >
                <img src={p.image} alt={t(p.title, p.titleFa)} />
              </button>
              <div>
                <ContentCopy item={p} />
                <p>
                  {t("By", "سازنده:")} {p.creator}
                </p>
                <strong className="real-price">
                  {new Intl.NumberFormat(lang === "fa" ? "fa-IR" : "en-US", {
                    style: "currency",
                    currency: p.currency,
                  }).format(p.price)}
                </strong>
              </div>
              <button
                className="cart-add"
                aria-label={t("Add to demo cart", "افزودن به سبد آزمایشی")}
                onClick={() => addToCart({ ...p, name: t(p.title, p.titleFa) })}
              >
                <Asset name="cart" />
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
export function ModuleContent(props) {
  const { module, open, t } = props;
  if (["coming-soon", "maintenance"].includes(module.status))
    return (
      <div className="module-notice">
        <h2>{t(module.title, module.titleFa)}</h2>
        <p>
          {module.status === "coming-soon"
            ? t(
                "Coming soon. This service is being prepared.",
                "به‌زودی؛ این سرویس در حال آماده‌سازی است.",
              )
            : t(
                "This service is temporarily under maintenance.",
                "این سرویس موقتاً در حال نگهداری است.",
              )}
        </p>
      </div>
    );
  const map = {
    traders: Tools,
    developers: Developers,
    educators: Education,
    videos: Videos,
    journal: Journal,
    products: Products,
  };
  const Component = map[module.type],
    readonly = module.status === "read-only";
  const navigate = (b) =>
    readonly
      ? open(module.title, "This module is currently read-only.")
      : b.url
        ? location.assign(b.url)
        : open(t(b.title, b.titleFa));
  return (
    <>
      {readonly && (
        <p className="status-note">
          {t("Read-only preview", "نمایش فقط خواندنی")}
        </p>
      )}
      {Component ? (
        <Component
          {...props}
          open={
            readonly
              ? () => open(module.title, "This module is currently read-only.")
              : open
          }
          addToCart={
            readonly
              ? () => open(module.title, "This module is currently read-only.")
              : props.addToCart
          }
        />
      ) : (
        <section className="custom-block">
          <h2>{t(module.title, module.titleFa)}</h2>
          <p>{t(module.description, module.descriptionFa)}</p>
          {module.cta && (
            <button className="primary" onClick={() => navigate(module)}>
              {t(module.cta, module.ctaFa)}
              <ArrowRight size={18} />
            </button>
          )}
        </section>
      )}
      {module.contentBlocks?.length > 0 && (
        <Blocks module={module} onNavigate={navigate} />
      )}
    </>
  );
}
