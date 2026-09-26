import React, { useState } from "react";
import { useI18n } from "./i18n";
export function Field({
  en,
  fa,
  value,
  onChange,
  area = false,
  type = "text",
  children,
  ...props
}) {
  const { t } = useI18n();
  return (
    <label className="studio-field">
      <span>{t(en, fa)}</span>
      {children ||
        (area ? (
          <textarea
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            {...props}
          />
        ) : (
          <input
            type={type}
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            {...props}
          />
        ))}
    </label>
  );
}
export function Choice({ en, fa, value, onChange, options }) {
  const { t } = useI18n();
  return (
    <Field en={en} fa={fa}>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map(([id, en, fa]) => (
          <option value={id} key={id}>
            {t(en, fa)}
          </option>
        ))}
      </select>
    </Field>
  );
}
export function Toggle({ en, fa, checked, onChange }) {
  const { t } = useI18n();
  return (
    <label className="studio-toggle">
      <span>{t(en, fa)}</span>
      <input
        type="checkbox"
        checked={!!checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}
export function BilingualFields({ value, onChange, description = true }) {
  return (
    <div className="form-grid">
      <Field
        en="Title · English / original"
        fa="عنوان انگلیسی / اصلی"
        value={value.title}
        onChange={(v) => onChange("title", v)}
      />
      <Field
        en="Title · Persian"
        fa="عنوان فارسی"
        dir="rtl"
        value={value.titleFa}
        onChange={(v) => onChange("titleFa", v)}
      />
      {description && (
        <>
          <Field
            en="Description · original"
            fa="توضیحات اصلی"
            area
            value={value.description}
            onChange={(v) => onChange("description", v)}
          />
          <Field
            en="Description · Persian"
            fa="توضیحات فارسی"
            area
            dir="rtl"
            value={value.descriptionFa}
            onChange={(v) => onChange("descriptionFa", v)}
          />
        </>
      )}
    </div>
  );
}
const builtins = [
  ["/assets/education-banner.webp", "Education banner", "بنر آموزش"],
  ["/assets/affiliate-chart.webp", "Affiliate chart", "نمودار همکاری"],
  [
    "/assets/request-monitor.webp",
    "Custom request graphic",
    "گرافیک درخواست اختصاصی",
  ],
  ["/assets/traders-card.webp", "Traders icon", "آیکون معامله‌گران"],
  ["/assets/educators-card.webp", "Educators icon", "آیکون آموزش‌دهندگان"],
  ["/assets/brand.webp", "Brand logo", "لوگو"],
];
export function UploadField({
  en = "Media",
  fa = "رسانه",
  value,
  onChange,
  library = [],
  onUploaded,
  video = false,
}) {
  const { t } = useI18n(),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setBusy(true);
    try {
      const r = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "content-type": file.type || "application/octet-stream" },
        body: file,
      });
      const data = await r.json();
      if (!r.ok) throw Error(data.error);
      onUploaded?.({ ...data, name: file.name });
      onChange(data.url);
    } catch (e) {
      setError(
        t(
          "Upload failed. Use PNG/JPEG/WebP up to 10 MB or MP4/WebM up to 50 MB; retry if storage is unavailable.",
          "بارگذاری ناموفق بود. تصویر PNG/JPEG/WebP تا ۱۰ مگابایت یا ویدئوی MP4/WebM تا ۵۰ مگابایت انتخاب کنید؛ در صورت قطع ذخیره‌سازی دوباره تلاش کنید.",
        ),
      );
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  };
  const choices = [
    ...(video ? [] : builtins),
    ...library
      .filter((x) => x.type.startsWith(video ? "video/" : "image/"))
      .map((x) => [x.url, x.name, x.name]),
  ];
  return (
    <div className="upload-field">
      <Field en={en} fa={fa}>
        <select value={value || ""} onChange={(e) => onChange(e.target.value)}>
          <option value="">{t("No file selected", "فایلی انتخاب نشده")}</option>
          {value && !choices.some((x) => x[0] === value) && (
            <option value={value}>{t("Current file", "فایل فعلی")}</option>
          )}
          {choices.map(([url, en, fa], i) => (
            <option key={url + i} value={url}>
              {t(en, fa)}
            </option>
          ))}
        </select>
      </Field>
      <label className={"upload-button " + (busy ? "busy" : "")}>
        <input
          type="file"
          disabled={busy}
          accept={
            video ? "video/mp4,video/webm" : "image/png,image/jpeg,image/webp"
          }
          onChange={upload}
        />
        {busy
          ? t("Uploading…", "در حال بارگذاری…")
          : t("Upload file", "بارگذاری فایل")}
      </label>
      {value && <small className="asset-reference">{value}</small>}
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
    </div>
  );
}
export const newid = () =>
  Array.from(crypto.getRandomValues(new Uint8Array(16)), (n) =>
    n.toString(16).padStart(2, "0"),
  ).join("");
