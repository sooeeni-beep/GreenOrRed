import React from "react";
import { useI18n } from "./i18n";
import {
  Field,
  Choice,
  UploadField,
  BilingualFields,
  newid,
} from "./StudioFields";
export default function ContentEditor({ items, update, library, onUploaded }) {
  const { t } = useI18n();
  const add = (kind) =>
    update([
      ...items,
      {
        id: newid(),
        kind,
        status: "draft",
        title: "",
        titleFa: "",
        description: "",
        descriptionFa: "",
        originalLanguage: "en",
        creator: "",
        image: "",
        video: "",
        url: "",
        price: 0,
        currency: "USD",
        category: "",
        createdAt: new Date().toISOString(),
      },
    ]);
  const edit = (id, key, value) =>
    update(items.map((x) => (x.id === id ? { ...x, [key]: value } : x)));
  return (
    <section className="studio-panel">
      <div className="sub-heading">
        <h2>{t("Published content", "محتوای قابل انتشار")}</h2>
        <div className="editor-actions">
          <button className="primary" onClick={() => add("product")}>
            {t("Add product", "افزودن محصول")}
          </button>
          <button className="primary" onClick={() => add("video")}>
            {t("Add video", "افزودن ویدئو")}
          </button>
        </div>
      </div>
      <p>
        {t(
          "Use real content you own or manage. Reference thumbnails and invented ratings are not published. These records can later be supplied by the marketplace and TradeTube services.",
          "محتوای واقعی تحت مدیریت خود را وارد کنید. تصویرهای فیک مرجع و امتیازهای ساختگی منتشر نمی‌شوند. در آینده این رکوردها از سرویس بازارچه و تریدتیوب دریافت خواهند شد.",
        )}
      </p>
      <p className="editor-note">
        {t(
          "Original text is always preserved. Enter a reviewed Persian translation below. Automatic translation is not connected yet; missing translations are clearly labelled on the homepage.",
          "متن اصلی همیشه حفظ می‌شود. ترجمهٔ فارسی بازبینی‌شده را وارد کنید. ترجمهٔ خودکار هنوز متصل نیست و نبود ترجمه در صفحهٔ اصلی مشخص می‌شود.",
        )}
      </p>
      {items.length === 0 && (
        <p className="empty">{t("No content has been published yet.")}</p>
      )}
      {items.map((item) => (
        <article className="studio-card" key={item.id}>
          <h3>
            {item.kind === "product"
              ? t("Product", "محصول")
              : t("Video", "ویدئو")}
          </h3>
          <div className="form-grid">
            <Choice
              en="Publication"
              fa="انتشار"
              value={item.status}
              onChange={(v) => edit(item.id, "status", v)}
              options={[
                ["draft", "Draft", "پیش‌نویس"],
                ["published", "Published", "منتشرشده"],
              ]}
            />
            <Field
              en="Original language code"
              fa="کد زبان اصلی"
              value={item.originalLanguage}
              onChange={(v) => edit(item.id, "originalLanguage", v)}
              placeholder="en / fa / de"
            />
          </div>
          <BilingualFields
            value={item}
            onChange={(k, v) => edit(item.id, k, v)}
          />
          <UploadField
            en="Cover image"
            fa="تصویر کاور"
            value={item.image}
            onChange={(v) => edit(item.id, "image", v)}
            {...{ library, onUploaded }}
          />
          {item.kind === "video" && (
            <UploadField
              en="Video file"
              fa="فایل ویدئو"
              video
              value={item.video}
              onChange={(v) => edit(item.id, "video", v)}
              {...{ library, onUploaded }}
            />
          )}
          <div className="form-grid">
            <Field
              en="Creator name"
              fa="نام سازنده"
              value={item.creator}
              onChange={(v) => edit(item.id, "creator", v)}
            />
            <Field
              en="Destination path"
              fa="مسیر صفحهٔ جزئیات"
              value={item.url}
              onChange={(v) => edit(item.id, "url", v)}
              placeholder="/products/example"
            />
            {item.kind === "product" && (
              <>
                <Field
                  en="Price"
                  fa="قیمت"
                  type="number"
                  min="0"
                  value={item.price}
                  onChange={(v) => edit(item.id, "price", Number(v))}
                />
                <Choice
                  en="Currency"
                  fa="واحد پول"
                  value={item.currency}
                  onChange={(v) => edit(item.id, "currency", v)}
                  options={[
                    ["USD", "US dollar", "دلار آمریکا"],
                    ["EUR", "Euro", "یورو"],
                    ["IRR", "Iranian rial", "ریال ایران"],
                  ]}
                />
              </>
            )}
          </div>
          <button
            className="danger subtle"
            onClick={() => update(items.filter((x) => x.id !== item.id))}
          >
            {t("Remove from draft", "حذف از پیش‌نویس")}
          </button>
        </article>
      ))}
    </section>
  );
}
