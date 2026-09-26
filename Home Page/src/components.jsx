import React, { useEffect, useRef } from "react";
import { useI18n } from "./i18n";
import { ArrowRight, X } from "lucide-react";
export function Asset({ name, src, alt = "", className = "", ...props }) {
  return (
    <img
      src={src || "/assets/" + name + ".webp"}
      alt={alt}
      className={"asset " + className}
      decoding="async"
      {...props}
    />
  );
}
export function AssetButton({ name, label, onClick, className = "" }) {
  const { t } = useI18n();
  const labels = {
    "marketplace-cta": "Explore Marketplace",
    "journal-hero-cta": "Start Free Journal",
    "journal-cta": "Start Journaling Free",
    "affiliate-cta": "Join Affiliate Program",
    "request-cta": "Submit a Request",
    "education-cta": "Explore Education",
    "profile-cta": "View Profile",
    "learning-cta": "Start Learning Today",
  };
  const variant = ["affiliate-cta", "journal-hero-cta"].includes(name)
    ? "terracotta"
    : ["profile-cta", "education-cta"].includes(name)
      ? "outline"
      : "forest";
  return (
    <button
      className={"image-button text-cta " + variant + " " + className}
      onClick={onClick}
      aria-label={t(label)}
    >
      <span>{t(labels[name] || label)}</span>
      <ArrowRight size={19} aria-hidden="true" />
    </button>
  );
}
export function More({ children, onClick }) {
  const { t } = useI18n();
  return (
    <button className="more" onClick={onClick}>
      {typeof children === "string" ? t(children) : children}
      <ArrowRight size={21} />
    </button>
  );
}
export function Modal({ title, children, onClose }) {
  const { t } = useI18n();
  const ref = useRef();
  useEffect(() => {
    const previous = document.activeElement;
    ref.current.showModal();
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = old;
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-labelledby="dialog-title"
    >
      <button
        className="close"
        onClick={onClose}
        aria-label={t("Close dialog")}
      >
        <X />
      </button>
      <h2 id="dialog-title">{t(title)}</h2>
      {children}
      <button className="primary" onClick={onClose}>
        {t("Close")}
      </button>
    </dialog>
  );
}
export function Rating({ rating, count }) {
  return (
    <span className="rating">
      <Asset name="star" />
      {rating} <span>({count})</span>
    </span>
  );
}
