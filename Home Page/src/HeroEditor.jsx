import React from "react";
import { useI18n } from "./i18n";
import {
  Field,
  Choice,
  UploadField,
  BilingualFields,
  newid,
} from "./StudioFields";
import { MediaPresentation } from "./HeroMedia";
import { heroDefaults } from "../shared/media.mjs";
function localInput(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return new Date(d - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}
function isoInput(v) {
  return v ? new Date(v).toISOString() : "";
}
function MediaFields({ item, update, library, onUploaded }) {
  return (
    <>
      <Choice
        en="Display"
        fa="نوع نمایش"
        value={item.mode}
        onChange={(v) => update("mode", v)}
        options={[
          ["intro", "Website introduction", "معرفی سایت"],
          ["image", "Image / banner", "تصویر / بنر"],
          ["video", "Video", "ویدئو"],
          ["market", "Market feed (not connected)", "دادهٔ بازار (متصل نشده)"],
        ]}
      />
      <BilingualFields value={item} onChange={update} />
      {["image", "video"].includes(item.mode) && (
        <UploadField
          value={item.media}
          video={item.mode === "video"}
          onChange={(v) => update("media", v)}
          {...{ library, onUploaded }}
        />
      )}
      {item.mode === "video" && (
        <UploadField
          en="Video poster"
          fa="پوستر ویدئو"
          value={item.poster}
          onChange={(v) => update("poster", v)}
          {...{ library, onUploaded }}
        />
      )}
      <div className="form-grid">
        <Field
          en="Button · English"
          fa="دکمهٔ انگلیسی"
          value={item.cta}
          onChange={(v) => update("cta", v)}
        />
        <Field
          en="Button · Persian"
          fa="دکمهٔ فارسی"
          value={item.ctaFa}
          onChange={(v) => update("ctaFa", v)}
        />
      </div>
      <Field
        en="Destination path"
        fa="مسیر پروفایل یا مقصد"
        value={item.url}
        onChange={(v) => update("url", v)}
        placeholder="/profiles/creator"
      />
    </>
  );
}
export default function HeroEditor({ hero, update, library, onUploaded }) {
  const { t } = useI18n();
  const change = (slot, k, v) =>
    update({ ...hero, [slot]: { ...hero[slot], [k]: v } });
  const edit = (id, k, v) =>
    update({
      ...hero,
      campaigns: hero.campaigns.map((c) =>
        c.id === id ? { ...c, [k]: v } : c,
      ),
    });
  const add = () => {
    const start = new Date();
    const end = new Date(start.getTime() + 86400000);
    update({
      ...hero,
      campaigns: [
        ...hero.campaigns,
        {
          ...heroDefaults.laptop,
          id: newid(),
          slot: "laptop",
          mode: "image",
          status: "draft",
          startsAt: start.toISOString(),
          endsAt: end.toISOString(),
          liveAt: "",
          advertiser: "",
        },
      ],
    });
  };
  return (
    <section className="studio-panel">
      <h2>{t("Hero media screens", "رسانه‌های نمایشگرهای Hero")}</h2>
      <p>
        {t(
          "Choose the default content for each screen. Approved campaigns replace it only during their scheduled window.",
          "محتوای پیش‌فرض هر نمایشگر را تعیین کنید. تبلیغ تأییدشده فقط در بازهٔ تعیین‌شده جای آن را می‌گیرد.",
        )}
      </p>
      <div className="hero-editor-grid">
        {["laptop", "phone"].map((slot) => (
          <article className="studio-card" key={slot}>
            <h3>
              {slot === "laptop"
                ? t("Laptop screen", "نمایشگر لپ‌تاپ")
                : t("Phone screen", "نمایشگر موبایل")}
            </h3>
            <MediaFields
              item={hero[slot]}
              update={(k, v) => change(slot, k, v)}
              {...{ library, onUploaded }}
            />
            <div className="slot-preview">
              <MediaPresentation item={hero[slot]} />
            </div>
          </article>
        ))}
      </div>
      <div className="sub-heading">
        <h2>{t("Campaign schedule", "برنامهٔ تبلیغات")}</h2>
        <button className="primary" onClick={add}>
          {t("Add campaign", "افزودن تبلیغ")}
        </button>
      </div>
      <p className="editor-note">
        {t(
          "Dates are entered in your browser timezone. They are stored in UTC. Overlapping approved campaigns in one screen cannot be saved. Booking requests and payment are not connected.",
          "تاریخ‌ها با منطقهٔ زمانی مرورگر وارد و به UTC ذخیره می‌شوند. تبلیغات تأییدشدهٔ هم‌زمان در یک نمایشگر قابل ذخیره نیستند. درخواست رزرو و پرداخت هنوز متصل نشده است.",
        )}{" "}
        ({Intl.DateTimeFormat().resolvedOptions().timeZone})
      </p>
      {hero.campaigns.map((c) => (
        <article className="studio-card campaign-editor" key={c.id}>
          <div className="form-grid">
            <Choice
              en="Screen"
              fa="نمایشگر"
              value={c.slot}
              onChange={(v) => edit(c.id, "slot", v)}
              options={[
                ["laptop", "Laptop", "لپ‌تاپ"],
                ["phone", "Phone", "موبایل"],
              ]}
            />
            <Choice
              en="Approval"
              fa="وضعیت تأیید"
              value={c.status}
              onChange={(v) => edit(c.id, "status", v)}
              options={[
                ["draft", "Draft", "پیش‌نویس"],
                ["approved", "Approved", "تأییدشده"],
                ["disabled", "Disabled", "غیرفعال"],
              ]}
            />
            <Field
              en="Start"
              fa="شروع نمایش"
              type="datetime-local"
              value={localInput(c.startsAt)}
              onChange={(v) => edit(c.id, "startsAt", isoInput(v))}
            />
            <Field
              en="End"
              fa="پایان نمایش"
              type="datetime-local"
              value={localInput(c.endsAt)}
              onChange={(v) => edit(c.id, "endsAt", isoInput(v))}
            />
            <Field
              en="Live event time (optional)"
              fa="زمان لایو (اختیاری)"
              type="datetime-local"
              value={localInput(c.liveAt)}
              onChange={(v) => edit(c.id, "liveAt", isoInput(v))}
            />
            <Field
              en="Advertiser"
              fa="تبلیغ‌دهنده"
              value={c.advertiser}
              onChange={(v) => edit(c.id, "advertiser", v)}
            />
          </div>
          <MediaFields
            item={c}
            update={(k, v) => edit(c.id, k, v)}
            {...{ library, onUploaded }}
          />
          <button
            className="danger subtle"
            onClick={() =>
              update({
                ...hero,
                campaigns: hero.campaigns.filter((x) => x.id !== c.id),
              })
            }
          >
            {t("Remove from draft", "حذف از پیش‌نویس")}
          </button>
        </article>
      ))}
    </section>
  );
}
