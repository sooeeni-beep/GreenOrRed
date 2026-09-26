import React, { useState } from "react";
import { Plus, ArrowUp, ArrowDown, Trash2, Eye } from "lucide-react";
import { useI18n } from "./i18n";
import {
  Field,
  Choice,
  Toggle,
  UploadField,
  BilingualFields,
  newid,
} from "./StudioFields";
import { Blocks } from "./Blocks";
import { Modal } from "./components";
const empty = (type) => ({
  id: newid(),
  type,
  title: "",
  titleFa: "",
  description: "",
  descriptionFa: "",
  media: "",
  mobileMedia: "",
  cta: "",
  ctaFa: "",
  url: "",
  enabled: true,
});
export default function BlockEditor({ module, update, library, onUploaded }) {
  const { t } = useI18n(),
    [preview, setPreview] = useState(false),
    [width, setWidth] = useState("desktop");
  const blocks = module.contentBlocks || [];
  const set = (next) => update("contentBlocks", next);
  const edit = (id, k, v) =>
    set(blocks.map((b) => (b.id === id ? { ...b, [k]: v } : b)));
  const move = (i, delta) => {
    const next = [...blocks];
    if (i + delta < 0 || i + delta >= next.length) return;
    [next[i], next[i + delta]] = [next[i + delta], next[i]];
    set(next);
  };
  const template = () =>
    set([
      ...blocks,
      {
        ...empty("banner"),
        title: "Meet the community",
        titleFa: "به انجمن بپیوندید",
        description: "Connect, learn and share your experience.",
        descriptionFa:
          "ارتباط بگیرید، یاد بگیرید و تجربه‌هایتان را به اشتراک بگذارید.",
        cta: "Explore community",
        ctaFa: "ورود به انجمن",
        url: "",
      },
      {
        ...empty("text"),
        title: "Share your knowledge",
        titleFa: "دانش خود را به اشتراک بگذارید",
      },
    ]);
  return (
    <div className="block-editor">
      <div className="sub-heading">
        <h3>{t("Section design", "طراحی محتوای بخش")}</h3>
        <button className="more" onClick={() => setPreview(true)}>
          <Eye size={17} />
          {t("Preview", "پیش‌نمایش")}
        </button>
      </div>
      <Choice
        en="Layout"
        fa="چیدمان"
        value={module.layout || "stack"}
        onChange={(v) => update("layout", v)}
        options={[
          ["stack", "Stacked blocks", "بلوک‌های زیر هم"],
          ["split", "Image and text", "تصویر کنار متن"],
          ["grid", "Card grid", "شبکهٔ کارت‌ها"],
        ]}
      />
      <button className="template-button" onClick={template}>
        {t("Add Community starter blocks", "افزودن بلوک‌های آغازین انجمن")}
      </button>
      {blocks.map((b, i) => (
        <fieldset className="block-edit" key={b.id}>
          <legend>
            {t("Block", "بلوک")} {i + 1}
          </legend>
          <div className="block-tools">
            <button
              disabled={i === 0}
              onClick={() => move(i, -1)}
              aria-label={t("Move block up", "بلوک به بالا")}
            >
              <ArrowUp size={17} />
            </button>
            <button
              disabled={i === blocks.length - 1}
              onClick={() => move(i, 1)}
              aria-label={t("Move block down", "بلوک به پایین")}
            >
              <ArrowDown size={17} />
            </button>
            <button
              onClick={() => set(blocks.filter((x) => x.id !== b.id))}
              aria-label={t("Remove block", "حذف بلوک")}
            >
              <Trash2 size={17} />
            </button>
          </div>
          <Toggle
            en="Show block"
            fa="نمایش بلوک"
            checked={b.enabled}
            onChange={(v) => edit(b.id, "enabled", v)}
          />
          <Choice
            en="Block type"
            fa="نوع بلوک"
            value={b.type}
            onChange={(v) => edit(b.id, "type", v)}
            options={[
              ["banner", "Banner", "بنر"],
              ["text", "Text", "متن"],
              ["image", "Image", "تصویر"],
              ["video", "Video", "ویدئو"],
              ["cta", "Call to action", "دکمه و دعوت به اقدام"],
            ]}
          />
          <BilingualFields value={b} onChange={(k, v) => edit(b.id, k, v)} />
          {["image", "banner", "video"].includes(b.type) && (
            <>
              <UploadField
                value={b.media}
                video={b.type === "video"}
                onChange={(v) => edit(b.id, "media", v)}
                {...{ library, onUploaded }}
              />
              {b.type !== "video" && (
                <UploadField
                  en="Mobile image (optional)"
                  fa="تصویر موبایل (اختیاری)"
                  value={b.mobileMedia}
                  onChange={(v) => edit(b.id, "mobileMedia", v)}
                  {...{ library, onUploaded }}
                />
              )}
            </>
          )}
          <div className="form-grid">
            <Field
              en="Button · English"
              fa="دکمهٔ انگلیسی"
              value={b.cta}
              onChange={(v) => edit(b.id, "cta", v)}
            />
            <Field
              en="Button · Persian"
              fa="دکمهٔ فارسی"
              value={b.ctaFa}
              onChange={(v) => edit(b.id, "ctaFa", v)}
            />
          </div>
          <Field
            en="Destination path"
            fa="مسیر مقصد"
            value={b.url}
            onChange={(v) => edit(b.id, "url", v)}
            placeholder="/community"
          />
        </fieldset>
      ))}
      <button
        className="add-module"
        onClick={() => set([...blocks, empty("banner")])}
      >
        <Plus size={17} />
        {t("Add content block", "افزودن بلوک محتوا")}
      </button>
      <p className="editor-note">
        {t(
          "Upload images, choose a layout and edit text here. Save changes to publish. A completely new visual pattern still needs a new template.",
          "تصویر بارگذاری کنید، چیدمان انتخاب کنید و متن را ویرایش کنید. انتشار با ذخیرهٔ تغییرات انجام می‌شود. طرح کاملاً جدید همچنان به قالب جدید نیاز دارد.",
        )}
      </p>
      {preview && (
        <Modal
          title={t("Section preview", "پیش‌نمایش بخش")}
          onClose={() => setPreview(false)}
        >
          <div className="tabs">
            <button onClick={() => setWidth("desktop")}>
              {t("Desktop", "دسکتاپ")}
            </button>
            <button onClick={() => setWidth("mobile")}>
              {t("Mobile", "موبایل")}
            </button>
          </div>
          <div className={"block-preview " + width}>
            <h2>{t(module.title, module.titleFa)}</h2>
            <Blocks module={module} onNavigate={() => {}} />
          </div>
        </Modal>
      )}
    </div>
  );
}
