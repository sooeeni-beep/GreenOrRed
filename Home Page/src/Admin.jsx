import React, { useState, useEffect } from "react";
import {
  Plus,
  Save,
  ArrowUp,
  ArrowDown,
  Eye,
  Download,
  Globe,
} from "lucide-react";
import {
  configSchema,
  normalizeConfig,
  moduleTypes,
  statuses,
} from "../shared/config.mjs";
import { useI18n } from "./i18n";
import { Asset, Modal } from "./components";
import {
  Field,
  Choice,
  Toggle,
  UploadField,
  BilingualFields,
} from "./StudioFields";
import BlockEditor from "./BlockEditor";
import HeroEditor from "./HeroEditor";
import ContentEditor from "./ContentEditor";
const types = {
  traders: "ابزارهای معامله‌گران",
  developers: "توسعه‌دهندگان",
  educators: "آموزش",
  videos: "ویدئوها",
  journal: "ژورنال",
  products: "محصولات",
  custom: "بخش سفارشی",
};
export default function Admin() {
  const { t, lang, setLang } = useI18n();
  const [data, setData] = useState(null),
    [saved, setSaved] = useState(""),
    [error, setError] = useState(""),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false),
    [selected, setSelected] = useState(null),
    [tab, setTab] = useState("modules"),
    [remove, setRemove] = useState(null);
  const load = async () => {
    setError("");
    try {
      const r = await fetch("/api/admin/home");
      const d = await r.json();
      if (!r.ok) throw Error(d.error);
      d.config = normalizeConfig(d.config);
      setData(d);
      setSaved(JSON.stringify(d.config));
      setSelected((s) =>
        d.config.modules.some((m) => m.id === s) ? s : d.config.modules[0]?.id,
      );
    } catch (e) {
      setError(
        t(
          "Cannot load settings. Confirm you are signed in as the site owner and retry.",
          "بارگذاری تنظیمات ممکن نشد؛ با حساب مالک سایت وارد شوید و دوباره تلاش کنید.",
        ),
      );
    }
  };
  useEffect(() => {
    load();
  }, []);
  const dirty = !!data && saved !== JSON.stringify(data.config);
  useEffect(() => {
    const warn = (e) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  const setConfig = (key, value) =>
    setData((d) => ({ ...d, config: { ...d.config, [key]: value } }));
  const update = (id, key, value) => {
    setMessage("");
    setData((d) => ({
      ...d,
      config: {
        ...d.config,
        modules: d.config.modules.map((m) =>
          m.id === id ? { ...m, [key]: value } : m,
        ),
      },
    }));
  };
  const add = () => {
    const id = "module-" + Date.now().toString(36);
    const m = {
      id,
      type: "custom",
      title: "New service",
      titleFa: "سرویس جدید",
      description: "",
      descriptionFa: "",
      enabled: false,
      showOnHome: true,
      status: "coming-soon",
      display: "expandable",
      order: data.config.modules.length,
      theme: "green",
      blocks: [],
      cta: "",
      ctaFa: "",
      url: "",
      layout: "stack",
      cardIcon: "",
      contentBlocks: [],
    };
    setConfig("modules", [...data.config.modules, m]);
    setSelected(id);
  };
  const reorder = (id, delta) => {
    const list = [...data.config.modules].sort((a, b) => a.order - b.order);
    const i = list.findIndex((m) => m.id === id);
    if (i + delta < 0 || i + delta >= list.length) return;
    [list[i], list[i + delta]] = [list[i + delta], list[i]];
    setConfig(
      "modules",
      list.map((m, i) => ({ ...m, order: i })),
    );
  };
  const validationMessage = (issues) => {
    if (lang !== "fa")
      return issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(" · ");
    if (issues.some((i) => i.message.includes("overlap")))
      return "بازهٔ تبلیغات تأییدشده در یک نمایشگر هم‌پوشانی دارد.";
    if (issues.some((i) => i.message.includes("Campaign end")))
      return "پایان تبلیغ باید بعد از شروع آن باشد.";
    if (issues.some((i) => i.message.includes("Approved campaigns")))
      return "تبلیغ تأییدشده باید تصویر یا ویدئو و مسیر مقصد داشته باشد.";
    if (issues.some((i) => i.message.includes("Published content")))
      return "محتوای منتشرشده باید عنوان، تصویر و برای ویدئو فایل یا مقصد داشته باشد.";
    if (issues.some((i) => i.message.includes("media type")))
      return "نوع فایل با نوع رسانه مطابقت ندارد؛ برای تصویر فایل تصویری و برای ویدئو فایل ویدئویی انتخاب کنید.";
    return (
      "بعضی فیلدها معتبر نیستند. عنوان‌ها، مسیرهای مقصد، طول متن‌ها و زمان‌ها را بررسی کنید. " +
      issues.map((i) => i.path.join(".")).join("، ")
    );
  };
  const save = async () => {
    setError("");
    setMessage("");
    const valid = configSchema.safeParse(data.config);
    if (!valid.success) {
      setError(validationMessage(valid.error.issues));
      return;
    }
    setBusy(true);
    try {
      const r = await fetch("/api/admin/home", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ config: valid.data, revision: data.revision }),
      });
      const result = await r.json();
      if (!r.ok) throw Error(r.status === 409 ? "conflict" : "save");
      setData((current) => ({
        ...current,
        ...result,
        config:
          JSON.stringify(current.config) === JSON.stringify(data.config)
            ? valid.data
            : current.config,
      }));
      setSaved(JSON.stringify(valid.data));
      setMessage(
        t(
          "Saved. The homepage is updated.",
          "ذخیره شد؛ صفحهٔ اصلی به‌روزرسانی شد.",
        ),
      );
    } catch (e) {
      setError(
        e.message === "conflict"
          ? t(
              "Another session updated these settings. Export your draft, then reload the saved version.",
              "تنظیمات در نشست دیگری تغییر کرده است. از پیش‌نویس خروجی بگیرید و سپس نسخهٔ ذخیره‌شده را بارگذاری کنید.",
            )
          : t(
              "Saving failed. Your draft is preserved; please retry.",
              "ذخیره انجام نشد. پیش‌نویس شما حفظ شده؛ دوباره تلاش کنید.",
            ),
      );
    } finally {
      setBusy(false);
    }
  };
  const backup = () => {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(data.config, null, 2)], {
        type: "application/json",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "greenorred-home-config.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const restore = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 256000) throw Error();
      const c = normalizeConfig(JSON.parse(await file.text()));
      setData({ ...data, config: c });
      setSelected(c.modules[0]?.id);
      setMessage(
        t(
          "Backup loaded as a draft. Review and save.",
          "نسخهٔ پشتیبان به‌صورت پیش‌نویس بارگذاری شد؛ بررسی و ذخیره کنید.",
        ),
      );
    } catch {
      setError(
        t("Invalid configuration backup.", "فایل پشتیبان تنظیمات معتبر نیست."),
      );
    }
    e.target.value = "";
  };
  const uploaded = (file) =>
    setData((d) => ({
      ...d,
      config: {
        ...d.config,
        mediaLibrary: [
          ...d.config.mediaLibrary.filter((x) => x.url !== file.url),
          file,
        ],
      },
    }));
  const current = data?.config.modules.find((m) => m.id === selected);
  const mediaProps = {
    library: data?.config.mediaLibrary || [],
    onUploaded: uploaded,
  };
  return (
    <div className="admin" dir={lang === "fa" ? "rtl" : "ltr"}>
      <header className="admin-top">
        <a href="/">
          <Asset name="brand" alt="GreenOrRed" />
        </a>
        <span>{t("HOMEPAGE STUDIO", "مدیریت صفحهٔ اصلی")}</span>
        <button
          className="language"
          onClick={() => setLang(lang === "en" ? "fa" : "en")}
        >
          <Globe size={16} />
          {lang === "fa" ? "EN" : "فارسی"}
        </button>
        <a className="more" href="/" target="_blank" rel="noreferrer">
          <Eye size={17} />
          {t("View homepage", "مشاهدهٔ صفحهٔ اصلی")}
        </a>
      </header>
      <main className="admin-main">
        <div className="admin-title">
          <div>
            <span className="eyebrow">
              {t("SITE ADMINISTRATION · TEST", "مدیریت سایت · نسخهٔ آزمایشی")}
            </span>
            <h1>
              {t("Your homepage, your way.", "صفحهٔ اصلی، به انتخاب شما.")}
            </h1>
            <p>
              {t(
                "Manage modules, media and published content.",
                "بخش‌ها، رسانه‌ها و محتوای منتشرشده را مدیریت کنید.",
              )}
            </p>
          </div>
          <button className="primary" disabled={!dirty || busy} onClick={save}>
            <Save size={17} />
            {busy
              ? t("Saving…", "در حال ذخیره…")
              : t("Save changes", "ذخیرهٔ تغییرات")}
          </button>
        </div>
        {error && (
          <div role="alert" className="error">
            {error}
            <button onClick={load}>
              {t("Reload saved settings", "بارگذاری تنظیمات ذخیره‌شده")}
            </button>
          </div>
        )}
        {message && (
          <p className="success" role="status">
            {message}
          </p>
        )}
        {!data ? (
          <p className="loading">
            {t("Loading settings…", "در حال بارگذاری تنظیمات…")}
          </p>
        ) : (
          <>
            <div className="admin-summary">
              <span>
                {data.config.modules.length} {t("modules", "بخش")}
              </span>
              <span>
                {t("Revision", "نسخه")} {data.revision}
              </span>
              <span className={dirty ? "unsaved" : ""}>
                {dirty
                  ? t("● Unsaved changes", "● تغییرات ذخیره نشده")
                  : t("✓ All changes saved", "✓ همهٔ تغییرات ذخیره شده")}
              </span>
            </div>
            <div
              className="studio-tabs"
              role="tablist"
              aria-label={t("Administration sections", "بخش‌های مدیریت")}
            >
              {[
                ["modules", "Modules & design", "بخش‌ها و طراحی"],
                ["hero", "Hero & campaigns", "نمایشگرها و تبلیغات"],
                ["content", "Products & videos", "محصولات و ویدئوها"],
              ].map(([id, en, fa]) => (
                <button
                  role="tab"
                  aria-selected={tab === id}
                  onClick={() => setTab(id)}
                  key={id}
                >
                  {t(en, fa)}
                </button>
              ))}
            </div>
            {tab === "hero" ? (
              <HeroEditor
                hero={data.config.hero}
                update={(v) => setConfig("hero", v)}
                {...mediaProps}
              />
            ) : tab === "content" ? (
              <ContentEditor
                items={data.config.content}
                update={(v) => setConfig("content", v)}
                {...mediaProps}
              />
            ) : (
              <div className="admin-layout">
                <aside className="admin-list">
                  <div className="sub-heading">
                    <h2>{t("Services & modules", "سرویس‌ها و بخش‌ها")}</h2>
                    <button
                      onClick={add}
                      aria-label={t("Add module", "افزودن بخش")}
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  {[...data.config.modules]
                    .sort((a, b) => a.order - b.order)
                    .map((m, i) => (
                      <div
                        className={
                          "module-row " + (selected === m.id ? "selected" : "")
                        }
                        key={m.id}
                      >
                        <button
                          className="module-select"
                          onClick={() => setSelected(m.id)}
                        >
                          <span
                            className={"state-dot " + (m.enabled ? "on" : "")}
                          />
                          <span>
                            <strong>{t(m.title, m.titleFa)}</strong>
                            <small>
                              {t(m.type, types[m.type])} ·{" "}
                              {m.display === "permanent"
                                ? t("Independent", "مستقل")
                                : t("Expandable", "بازشونده")}
                            </small>
                          </span>
                        </button>
                        <div className="reorder">
                          <button
                            onClick={() => reorder(m.id, -1)}
                            disabled={i === 0}
                            aria-label={t(
                              "Move module up",
                              "انتقال بخش به بالا",
                            )}
                          >
                            <ArrowUp size={15} />
                          </button>
                          <button
                            onClick={() => reorder(m.id, 1)}
                            disabled={i === data.config.modules.length - 1}
                            aria-label={t(
                              "Move module down",
                              "انتقال بخش به پایین",
                            )}
                          >
                            <ArrowDown size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  <button className="add-module" onClick={add}>
                    <Plus size={17} />
                    {t("Add module", "افزودن بخش")}
                  </button>
                </aside>
                <section className="module-editor">
                  {current ? (
                    <>
                      <div className="sub-heading">
                        <div>
                          <h2>{t(current.title, current.titleFa)}</h2>
                          <code>{current.id}</code>
                        </div>
                        <button
                          className="danger subtle"
                          onClick={() => setRemove(current.id)}
                        >
                          {t("Remove", "حذف")}
                        </button>
                      </div>
                      <div className="toggle-grid">
                        <Toggle
                          en="Service enabled"
                          fa="سرویس فعال است"
                          checked={current.enabled}
                          onChange={(v) => update(current.id, "enabled", v)}
                        />
                        <Toggle
                          en="Show on homepage"
                          fa="نمایش در صفحهٔ اصلی"
                          checked={current.showOnHome}
                          onChange={(v) => update(current.id, "showOnHome", v)}
                        />
                      </div>
                      <BilingualFields
                        value={current}
                        onChange={(k, v) => update(current.id, k, v)}
                      />
                      <div className="form-grid">
                        <Choice
                          en="Section template"
                          fa="قالب بخش"
                          value={current.type}
                          onChange={(v) => {
                            update(current.id, "type", v);
                            if (["journal", "products"].includes(v))
                              update(current.id, "display", "permanent");
                            if (v === "developers")
                              update(current.id, "blocks", [
                                "affiliate",
                                "requests",
                              ]);
                          }}
                          options={moduleTypes.map((v) => [v, v, types[v]])}
                        />
                        <Choice
                          en="Service status"
                          fa="وضعیت سرویس"
                          value={current.status}
                          onChange={(v) => update(current.id, "status", v)}
                          options={statuses.map((v) => [v, v, t(v)])}
                        />
                        {!["journal", "products"].includes(current.type) && (
                          <Choice
                            en="Display mode"
                            fa="نوع نمایش"
                            value={current.display}
                            onChange={(v) => update(current.id, "display", v)}
                            options={[
                              [
                                "expandable",
                                "Expandable card",
                                "کارت بازشونده",
                              ],
                              ["permanent", "Independent section", "بخش مستقل"],
                            ]}
                          />
                        )}
                        <Choice
                          en="Card colour"
                          fa="رنگ کارت"
                          value={current.theme}
                          onChange={(v) => update(current.id, "theme", v)}
                          options={[
                            ["green", "Green", "سبز"],
                            ["orange", "Terracotta", "سفالی"],
                            ["red", "Red", "قرمز"],
                          ]}
                        />
                      </div>
                      <UploadField
                        en="Card icon / logo"
                        fa="آیکون / لوگوی کارت"
                        value={current.cardIcon}
                        onChange={(v) => update(current.id, "cardIcon", v)}
                        {...mediaProps}
                      />
                      {current.type === "developers" && (
                        <fieldset className="block-settings">
                          <legend>
                            {t("Default blocks", "بلوک‌های پیش‌فرض")}
                          </legend>
                          {[
                            ["affiliate", "Affiliate Program"],
                            ["requests", "Custom Requests"],
                          ].map(([id, title]) => (
                            <Toggle
                              key={id}
                              en={title}
                              fa={t(title)}
                              checked={current.blocks.includes(id)}
                              onChange={(v) =>
                                update(
                                  current.id,
                                  "blocks",
                                  v
                                    ? [...current.blocks, id]
                                    : current.blocks.filter((x) => x !== id),
                                )
                              }
                            />
                          ))}
                        </fieldset>
                      )}
                      <BlockEditor
                        module={current}
                        update={(k, v) => update(current.id, k, v)}
                        {...mediaProps}
                      />
                      <p className="editor-note">
                        {t(
                          "Switching a service off preserves its settings. Uploaded files are kept separately from module visibility.",
                          "خاموش‌کردن سرویس، تنظیمات آن را حفظ می‌کند. فایل‌های بارگذاری‌شده مستقل از وضعیت نمایش بخش نگهداری می‌شوند.",
                        )}
                      </p>
                    </>
                  ) : (
                    <p>
                      {t(
                        "Select or add a module.",
                        "یک بخش انتخاب یا اضافه کنید.",
                      )}
                    </p>
                  )}
                </section>
              </div>
            )}
            <div className="admin-bottom">
              <button onClick={backup}>
                <Download size={16} />
                {t("Export configuration", "خروجی تنظیمات")}
              </button>
              <label className="file-import">
                {t("Import configuration", "ورود تنظیمات")}
                <input
                  type="file"
                  accept="application/json,.json"
                  onChange={restore}
                />
              </label>
              <span>
                {data.updatedAt
                  ? new Intl.DateTimeFormat(lang === "fa" ? "fa-IR" : "en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(data.updatedAt))
                  : t("Original configuration", "تنظیمات اولیه")}
              </span>
            </div>
          </>
        )}
        {remove && (
          <Modal
            title={t("Remove this module?", "این بخش حذف شود؟")}
            onClose={() => setRemove(null)}
          >
            <p>
              {t(
                "This only removes the homepage entry after you save. Disable it instead to preserve its configuration.",
                "این کار پس از ذخیره فقط مدخل هوم را حذف می‌کند. برای حفظ تنظیمات، بخش را غیرفعال کنید.",
              )}
            </p>
            <button
              className="danger"
              onClick={() => {
                setConfig(
                  "modules",
                  data.config.modules.filter((m) => m.id !== remove),
                );
                setSelected(null);
                setRemove(null);
              }}
            >
              {t("Remove entry", "حذف مدخل")}
            </button>
          </Modal>
        )}
      </main>
    </div>
  );
}
