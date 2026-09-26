import React, { useState, useEffect } from "react";
import { Maximize2, ArrowRight, Play, ArrowDownLeft } from "lucide-react";
import { Asset, Modal } from "./components";
import { useI18n } from "./i18n";
import { heroDefaults, selectSlot } from "../shared/media.mjs";
export function MediaPresentation({ item, expanded = false }) {
  const { t, lang } = useI18n();
  return (
    <div
      className={
        "media-presentation mode-" + item.mode + (expanded ? " enlarged" : "")
      }
    >
      {item.mode === "video" && item.media ? (
        <video
          key={item.media}
          src={item.media}
          poster={item.poster || undefined}
          controls={expanded}
          muted={!expanded}
          autoPlay={expanded}
          playsInline
          preload="metadata"
        />
      ) : item.mode === "image" && item.media ? (
        <img src={item.media} alt={t(item.title, item.titleFa)} />
      ) : (
        <div className="media-intro">
          <span className="media-brand">
            G<span>/R</span>
          </span>
          <h2>
            {item.mode === "market"
              ? t("Market watch", "دیده‌بان بازار")
              : t(item.title, item.titleFa)}
          </h2>
          <p>
            {item.mode === "market"
              ? t(
                  "Market updates will appear when a verified data source is connected.",
                  "اطلاعات بازار پس از اتصال منبع معتبر نمایش داده می‌شود.",
                )
              : t(item.description, item.descriptionFa)}
          </p>
        </div>
      )}
      {item.sponsored && (
        <span className="ad-label">{t("Sponsored", "تبلیغ")}</span>
      )}
      {expanded && (
        <div className="media-detail">
          <h3>{t(item.title, item.titleFa)}</h3>
          <p>{t(item.description, item.descriptionFa)}</p>
          {item.liveAt && (
            <p className="live-date">
              {t("Scheduled live session:", "زمان برنامهٔ زنده:")}{" "}
              {new Intl.DateTimeFormat(lang === "fa" ? "fa-IR" : "en-US", {
                dateStyle: "long",
                timeStyle: "short",
              }).format(new Date(item.liveAt))}{" "}
              <small>
                ({Intl.DateTimeFormat().resolvedOptions().timeZone})
              </small>
            </p>
          )}
          {item.url && (
            <a className="primary" href={item.url}>
              {t(item.cta || "View profile", item.ctaFa || "مشاهدهٔ پروفایل")}
              <ArrowRight size={17} />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
export default function HeroMedia({ hero = heroDefaults }) {
  const { t } = useI18n();
  const [now, setNow] = useState(Date.now()),
    [zoom, setZoom] = useState(null);
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 15000);
    return () => clearInterval(timer);
  }, []);
  return (
    <>
      <div className="hero-devices">
        <Asset name="hero-decoration" className="hero-decoration" />
        <div className="hero-callout">
          {t("Your trading journey matters", "مسیر معاملاتی تو اهمیت دارد")}
          <ArrowDownLeft />
        </div>
        <div className="hero-callout bottom">
          {t("Trade. Learn. Grow together.", "معامله، یادگیری، رشد با هم")}
        </div>
        <Asset
          name="hero-shell"
          alt={t(
            "GreenOrRed on laptop and mobile",
            "گرین‌اوررد روی لپ‌تاپ و موبایل",
          )}
          className="hero-shell"
        />
        {["laptop", "phone"].map((slot) => {
          const item = selectSlot(hero, slot, now);
          return (
            <div className={"device-media " + slot + "-media"} key={slot}>
              <MediaPresentation item={item} />
              <button
                className="media-enlarge"
                onClick={() => setZoom(slot)}
                aria-label={t(
                  "Enlarge " + slot + " screen",
                  slot === "laptop"
                    ? "بزرگ‌نمایی نمایشگر لپ‌تاپ"
                    : "بزرگ‌نمایی نمایشگر موبایل",
                )}
              >
                <Maximize2 size={16} />
              </button>
              {item.mode === "video" && (
                <span className="media-play-hint">
                  <Play size={24} />
                </span>
              )}
            </div>
          );
        })}
      </div>
      {zoom && (
        <Modal
          title={t("Hero screen", "نمایشگر معرفی")}
          onClose={() => setZoom(null)}
        >
          <MediaPresentation item={selectSlot(hero, zoom, now)} expanded />
        </Modal>
      )}
    </>
  );
}
