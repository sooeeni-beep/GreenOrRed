import React, { useState } from "react";
import { ArrowRight, Play } from "lucide-react";
import { Asset, AssetButton, More, Rating } from "./components";
export const products = [
  {
    name: "SuperTrend Pro",
    creator: "TradeTech",
    price: 49,
    rating: "4.9",
    count: 320,
    badge: "bestseller",
    category: "Indicators",
  },
  {
    name: "Gold Master EA",
    creator: "AlgoTrader",
    price: 79,
    rating: "4.8",
    count: 210,
    badge: "popular",
    category: "Experts & Strategies",
  },
  {
    name: "Breakout Strategy",
    creator: "Hydricators",
    price: 39,
    rating: "4.7",
    count: 158,
    badge: "new",
    category: "Strategies",
  },
  {
    name: "Support & Resistance",
    creator: "ChartTools",
    price: 59,
    rating: "4.6",
    count: 120,
    category: "Indicators",
  },
];
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
      "Professional indicators to analyze markets with precision.",
    ],
    [
      "experts",
      "Experts & Strategies",
      "Automated trading systems with verified AI and strategy results.",
    ],
    [
      "scripts",
      "Scripts & Utilities",
      "Powerful scripts and utilities to simplify your trading.",
    ],
    [
      "signals",
      "Trading Signals",
      "Real-time trading signals from top traders and verified providers.",
    ],
  ];
  return (
    <section className="tools">
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
        {cards.map(([id, title, desc]) => (
          <button className="tool-card" onClick={() => open(title)} key={id}>
            <Asset
              name={id + "-chart"}
              className="tool-preview"
              alt={title + " interface preview"}
            />
            <div className="tool-description">
              <Asset name={id + "-icon"} className="tool-icon" />
              <div>
                <h3>{title}</h3>
                <p>{desc}</p>
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
  return (
    <section>
      <SectionTitle
        title={t(
          "Build Your Tools. Grow Your Business.",
          "ابزارت را بساز. کسب‌وکارت را رشد بده.",
        )}
        description={t(
          "Create. Collaborate. Earn. Be part of something bigger.",
          "بسازید، همکاری کنید و درآمد داشته باشید.",
        )}
        action={t("See All Opportunities", "همهٔ فرصت‌ها")}
        onAction={() => open("Developer opportunities")}
      />
      <div className="business-grid">
        {module.blocks.includes("affiliate") && (
          <article className="business-card affiliate">
            <Asset name="affiliate-icon" className="business-icon" />
            <div className="business-copy">
              <h3>Affiliate Program</h3>
              <p>You trade, we connect. Earn by sharing great tools.</p>
              <ul>
                {[
                  "High commission rates",
                  "Real-time reviewing",
                  "Real-time tracking",
                  "Grow together",
                ].map((x) => (
                  <li key={x}>
                    <Asset name="affiliate-check" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            <div className="business-art">
              <Asset name="affiliate-chart" />
              <AssetButton
                name="affiliate-cta"
                label="Join Affiliate Program"
                onClick={() => open("Affiliate Program")}
              />
            </div>
          </article>
        )}
        {module.blocks.includes("requests") && (
          <article className="business-card requests">
            <Asset name="request-paper" className="business-icon" />
            <div className="business-copy">
              <h3>Custom Requests</h3>
              <p>Need a specific indicator or EA? Submit your request.</p>
              <ul>
                {[
                  "Get it built by our team or the community",
                  "Competitive offers from verified developers",
                  "Track progress and communicate easily",
                ].map((x) => (
                  <li key={x}>
                    <Asset name="request-check" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            <div className="business-art">
              <Asset name="request-monitor" />
              <AssetButton
                name="request-cta"
                label="Submit a Request"
                onClick={() => open("Custom Requests")}
              />
            </div>
          </article>
        )}
      </div>
      {module.blocks.length === 0 && (
        <p className="empty">No opportunities are currently displayed.</p>
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
            <h3>Education</h3>
            <p>
              Learn from professional traders and industry experts. Live or
              on-demand courses, webinars, and practical trading education for
              all levels.
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
            <h3>Top Educators</h3>
            <More onClick={() => open("Educators")}>View All</More>
          </div>
          <div className="educator-grid">
            {[
              ["alex", "Alex T.", "4.9", 200, "125"],
              ["sara", "Sara K.", "4.8", 300, "980"],
              ["david", "David M.", "4.7", 120, "450"],
            ].map(([id, name, rating, count, students]) => (
              <article className="educator-card" key={id}>
                <div className="educator-info">
                  <Asset name={id} alt={name} className="avatar" />
                  <div>
                    <h4>{name}</h4>
                    <Rating {...{ rating, count }} />
                    <small>{students} Students</small>
                  </div>
                </div>
                <AssetButton
                  name="profile-cta"
                  label={"View " + name + " profile"}
                  onClick={() => open(name + " — educator profile")}
                />
              </article>
            ))}
          </div>
        </div>
        <div className="education-banner">
          <Asset
            name="education-banner"
            alt="Invest in Your Knowledge. Trade in Your Future. Books and a plant."
          />
          <AssetButton
            name="learning-cta"
            label="Start Learning Today"
            onClick={() => open("Learning centre")}
          />
        </div>
      </div>
    </section>
  );
}
const videos = [
  [
    "EURUSD Analysis: Key Levels and What’s Next?",
    "MarketMind",
    "10K views · 2 days ago",
  ],
  [
    "Live Trading Session Q&A + Live Trades",
    "TradersWay",
    "2.6K views · 3 days ago",
  ],
  [
    "My Simple Trading Strategy (Full Guide)",
    "ChartPros",
    "25K views · 5 days ago",
  ],
  [
    "Risk Management Every Trader Needs",
    "AlgoFamous",
    "8.1K views · 1 week ago",
  ],
  [
    "Trading Psychology Mindset for Success",
    "MindfulTrader",
    "12K views · 1 week ago",
  ],
];
export function Videos({ open, t }) {
  return (
    <section>
      <SectionTitle
        title="TradeTube"
        description="Watch. Learn. Share. Go Live."
        action={t("View All Videos", "همهٔ ویدئوها")}
        onAction={() => open("TradeTube")}
      />
      <div className="video-grid">
        {videos.map(([title, name, meta], i) => (
          <button
            className="video-card"
            key={title}
            onClick={() =>
              open(
                title,
                "This is a thumbnail from the supplied design. A playable video has not been provided yet.",
              )
            }
          >
            <div className="video-thumb">
              <Asset name={"video-" + (i + 1)} alt={title} />
              {i === 1 && <Asset name="live" className="live-badge" />}
            </div>
            <h3>{title}</h3>
            <div className="creator">
              <Asset
                name={i === 0 ? "marketmind" : "creator-" + i}
                className="avatar"
              />
              <div>
                {name}
                <small>{meta}</small>
              </div>
            </div>
          </button>
        ))}
      </div>
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
            <Asset name="free-badge" className="free-badge" />
          </p>
          <div className="journal-features">
            {[
              [
                "insights",
                "AI-Powered Insights",
                "Get personalized insights from your trades.",
              ],
              [
                "analytics",
                "Performance Analytics",
                "Discover your strengths and weaknesses.",
              ],
              [
                "goals",
                "Set & Achieve Goals",
                "Build better habits and track your progress.",
              ],
            ].map(([id, title, desc]) => (
              <div key={id}>
                <Asset name={id} />
                <div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
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
        <Asset
          name="journal-devices"
          className="journal-device"
          alt="Trading journal dashboard on a tablet and phone"
        />
        <div className="leaderboard">
          <div className="sub-heading">
            <h3>
              Top Journal Traders <span>(Last 30 Days)</span>
            </h3>
            <More onClick={() => open("Journal leaderboard")}>View All</More>
          </div>
          {[
            "ShadowTrader",
            "PriceActionPro",
            "ChartMaster",
            "AlgoNomad",
            "PipHunter",
          ].map((name, i) => (
            <div className="leader" key={name}>
              <b>{i + 1}</b>
              <Asset name={"leader-" + (i + 1)} className="avatar" />
              <strong>{name}</strong>
              <svg className="sparkline" viewBox="0 0 76 24" aria-hidden="true">
                <path
                  d={
                    [
                      "M1 21L8 19L14 20L22 15L28 16L33 11L39 13L46 8L53 9L59 5L66 6L75 1",
                      "M1 23L9 19L16 19L24 17L31 18L38 13L46 14L52 9L60 10L66 5L75 2",
                    ][i % 2]
                  }
                />
              </svg>
              <span
                className="return"
                style={{ backgroundImage: "url(/assets/return-badge.webp)" }}
              >
                +{["42.8", "37.6", "33.1", "28.9", "26.4"][i]}%
              </span>
            </div>
          ))}
          <span className="demo-data">
            {t("Illustrative demo data", "داده‌های نمایشی")}
          </span>
        </div>
      </div>
    </section>
  );
}
export function Products({ module, open, addToCart, query, t }) {
  const [tab, setTab] = useState("Top Rated");
  let list = [...products];
  if (tab === "Best Sellers") list.sort((a, b) => b.count - a.count);
  if (tab === "New Arrivals")
    list.sort((a, b) => (b.badge === "new") - (a.badge === "new"));
  if (query)
    list = list.filter((p) =>
      (p.name + " " + p.creator + " " + p.category)
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
        <div className="tabs" role="tablist" aria-label="Product sorting">
          {["Top Rated", "Best Sellers", "New Arrivals"].map((x) => (
            <button
              role="tab"
              aria-selected={tab === x}
              key={x}
              onClick={() => setTab(x)}
            >
              {x}
            </button>
          ))}
        </div>
        <More onClick={() => open("Marketplace")}>
          {t("View All Products", "همهٔ محصولات")}
        </More>
      </div>
      {query && (
        <p className="search-result">
          {list.length} results for “{query}”
        </p>
      )}
      <div className="product-grid">
        {list.map((p) => (
          <article className="product-card" key={p.name}>
            <button
              className="product-art"
              onClick={() => open(p.name)}
              aria-label={"View " + p.name}
            >
              <Asset name="product-thumb" alt={p.name + " chart preview"} />
              {p.badge && <Asset name={p.badge} className="product-badge" />}
            </button>
            <div>
              <button className="product-title" onClick={() => open(p.name)}>
                {p.name}
              </button>
              <p>by {p.creator}</p>
              <div className="product-meta">
                <strong>${p.price}</strong>
                <Rating rating={p.rating} count={p.count} />
              </div>
            </div>
            <button
              className="cart-add"
              aria-label={"Add " + p.name + " to demo cart"}
              onClick={() => addToCart(p)}
            >
              <Asset name="cart" />
            </button>
          </article>
        ))}
      </div>
      {list.length === 0 && (
        <p className="empty">
          No products match your search. Try “strategy” or “indicator”.
        </p>
      )}
    </section>
  );
}
export function ModuleContent(props) {
  const { module, open, t } = props;
  if (module.status === "coming-soon" || module.status === "maintenance")
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
  const Component = map[module.type];
  const readonly = module.status === "read-only";
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
            <button
              className="primary"
              onClick={() => {
                if (module.url && module.status === "active")
                  location.assign(module.url);
                else open(module.title);
              }}
            >
              {module.cta}
              <ArrowRight size={18} />
            </button>
          )}
        </section>
      )}
    </>
  );
}
