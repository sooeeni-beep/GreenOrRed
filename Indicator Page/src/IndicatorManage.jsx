import React, { useEffect, useState } from "react";
import {
  Plus,
  Save,
  ArrowLeft,
  Globe,
  Trash2,
  Eye,
  Image as ImageIcon,
} from "lucide-react";
import { useI18n } from "../../Home Page/src/i18n";
import { Asset, Modal } from "../../Home Page/src/components";
import {
  Field,
  Choice,
  UploadField,
  BilingualFields,
  newid,
} from "../../Home Page/src/StudioFields";
import { catalogSchema, platforms, categories } from "../shared/catalog.mjs";
import "./indicator.css";
export default function IndicatorManage() {
  const { t, lang, setLang } = useI18n();
  const [data, setData] = useState(null),
    [saved, setSaved] = useState(""),
    [selected, setSelected] = useState(null),
    [error, setError] = useState(""),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false),
    [remove, setRemove] = useState(null),
    [filter, setFilter] = useState("");
  const dirty = !!data && saved !== JSON.stringify(data.config);
  const load = async () => {
    setError("");
    try {
      const r = await fetch("/api/admin/indicators");
      const d = await r.json();
      if (!r.ok) throw Error();
      setData(d);
      setSaved(JSON.stringify(d.config));
      setSelected(d.config.products[0]?.id ?? null);
    } catch {
      setError(
        t(
          "Cannot load the catalog. Sign in as the site owner and retry.",
          "بارگذاری فروشگاه ممکن نشد. با حساب مالک سایت وارد شوید و دوباره تلاش کنید.",
        ),
      );
    }
  };
  useEffect(() => {
    load();
  }, []);
  useEffect(() => {
    document.title = t(
      "Manage Indicators — GreenOrRed",
      "مدیریت اندیکاتورها — گرین‌اوررد",
    );
  }, [lang]);
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
  const update = (key, value) => {
    setMessage("");
    setData((d) => ({
      ...d,
      config: {
        ...d.config,
        products: d.config.products.map((p) =>
          p.id === selected
            ? { ...p, [key]: value, updatedAt: new Date().toISOString() }
            : p,
        ),
      },
    }));
  };
  const add = () => {
    const now = new Date().toISOString();
    const p = {
      id: newid(),
      title: t("New indicator", "اندیکاتور جدید"),
      titleFa: "",
      description: "",
      descriptionFa: "",
      creator: "",
      image: "",
      platforms: ["mt5"],
      category: "trend",
      price: 0,
      currency: "USD",
      status: "draft",
      createdAt: now,
      updatedAt: now,
    };
    setData((d) => ({
      ...d,
      config: { ...d.config, products: [p, ...d.config.products] },
    }));
    setSelected(p.id);
    setMessage("");
  };
  const save = async () => {
    setMessage("");
    setError("");
    const parsed = catalogSchema.safeParse(data.config);
    if (!parsed.success) {
      setError(
        t(
          "Check every product: title, platform, valid non-negative price; published products also need an image and description.",
          "اطلاعات محصولات را بررسی کنید: عنوان، پلتفرم و قیمت معتبر لازم است؛ محصول منتشرشده باید تصویر و توضیحات هم داشته باشد.",
        ),
      );
      return;
    }
    setBusy(true);
    try {
      const r = await fetch("/api/admin/indicators", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ revision: data.revision, config: parsed.data }),
      });
      const d = await r.json();
      if (!r.ok) {
        if (r.status === 409) throw Error("conflict");
        throw Error();
      }
      setData({ config: parsed.data, revision: d.revision });
      setSaved(JSON.stringify(parsed.data));
      setMessage(
        t(
          "Saved. Published products are now visible in the indicator preview.",
          "ذخیره شد. محصولات منتشرشده اکنون در پیش‌نمایش اندیکاتورها نمایش داده می‌شوند.",
        ),
      );
    } catch (e) {
      setError(
        e.message === "conflict"
          ? t(
              "Another session saved changes. Your draft is kept here; copy your changes before reloading.",
              "نشست دیگری تغییرات را ذخیره کرده است. پیش‌نویس شما حفظ شده؛ پیش از بارگذاری مجدد، تغییرات خود را کپی کنید.",
            )
          : t(
              "Save failed. Your draft is preserved; please retry.",
              "ذخیره ناموفق بود. پیش‌نویس شما حفظ شده است؛ دوباره تلاش کنید.",
            ),
      );
    } finally {
      setBusy(false);
    }
  };
  const product = data?.config.products.find((p) => p.id === selected);
  return (
    <div className="indicator-page ind-manage">
      <header className="ind-manage-header page">
        <a
          href="/indicator-preview"
          aria-label={t(
            "Back to indicator store",
            "بازگشت به فروشگاه اندیکاتور",
          )}
        >
          <Asset name="brand" alt="GreenOrRed" />
        </a>
        <h1>{t("Manage indicators", "مدیریت اندیکاتورها")}</h1>
        <button
          onClick={() => setLang(lang === "fa" ? "en" : "fa")}
          aria-label={t("Switch language")}
        >
          <Globe size={18} />
          {lang === "fa" ? "EN" : "FA"}
        </button>
        <a
          className="ind-button outline"
          href="/indicator-preview"
          target="_blank"
          rel="noreferrer"
        >
          <Eye size={16} />
          {t("Preview", "پیش‌نمایش")}
        </a>
        <button
          className="ind-button"
          disabled={!data || busy || !dirty}
          onClick={save}
        >
          <Save size={16} />
          {busy
            ? t("Saving…", "در حال ذخیره…")
            : t("Save changes", "ذخیرهٔ تغییرات")}
        </button>
      </header>
      <main className="page">
        <div className="ind-manage-intro">
          <p>
            {t(
              "Add your own indicators, upload artwork and publish when ready. Changes here affect only the indicator preview.",
              "اندیکاتورهای خود را اضافه کنید، تصویر بارگذاری کنید و پس از تکمیل منتشر کنید. تغییرات اینجا فقط روی پیش‌نمایش اندیکاتورها اعمال می‌شود.",
            )}
          </p>
          <small>
            {t(
              "USD prices · No payment, order fulfillment or seller accounts are connected yet.",
              "قیمت‌ها به دلار هستند · پرداخت، تحویل سفارش و حساب سازندگان هنوز متصل نیستند.",
            )}
          </small>
        </div>
        {error && (
          <div className="ind-notice error" role="alert">
            {error}
            {!data && <button onClick={load}>{t("Retry")}</button>}
          </div>
        )}
        {message && (
          <div className="ind-notice" role="status">
            {message}
          </div>
        )}
        {!data && !error ? (
          <p>{t("Loading…", "در حال بارگذاری…")}</p>
        ) : (
          data && (
            <div className="ind-manager-grid">
              <aside className="ind-manager-list">
                <button
                  className="ind-button"
                  onClick={add}
                  disabled={data.config.products.length >= 200 || busy}
                >
                  <Plus size={16} />
                  {t("Add indicator", "افزودن اندیکاتور")}
                </button>
                <label className="ind-manager-search">
                  <span>{t("Search products", "جست‌وجوی محصولات")}</span>
                  <input
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    placeholder={t("Search…", "جست‌وجو…")}
                  />
                </label>
                <p className="ind-manager-count">
                  {t(
                    `${data.config.products.length} products`,
                    `${data.config.products.length} محصول`,
                  )}
                  {dirty
                    ? " · " + t("Unsaved changes", "تغییرات ذخیره‌نشده")
                    : ""}
                </p>
                {data.config.products
                  .filter((p) =>
                    (p.title + " " + p.titleFa)
                      .toLowerCase()
                      .includes(filter.toLowerCase()),
                  )
                  .map((p) => (
                    <button
                      className={
                        "ind-manager-item " +
                        (selected === p.id ? "selected" : "")
                      }
                      key={p.id}
                      onClick={() => setSelected(p.id)}
                    >
                      {p.image ? (
                        <img src={p.image} alt="" />
                      ) : (
                        <ImageIcon size={28} />
                      )}
                      <span>
                        <strong>{t(p.title, p.titleFa)}</strong>
                        <small>
                          {p.status === "published"
                            ? t("Published", "منتشرشده")
                            : t("Draft", "پیش‌نویس")}
                        </small>
                      </span>
                    </button>
                  ))}
              </aside>
              <fieldset className="ind-editor" disabled={busy}>
                {product ? (
                  <>
                    <div className="ind-editor-heading">
                      <h2>{t(product.title, product.titleFa)}</h2>
                      <button
                        className="ind-remove"
                        onClick={() => setRemove(product.id)}
                        aria-label={t("Delete product", "حذف محصول")}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <p className="ind-editor-hint">
                      {t(
                        "For a fully Persian product page, fill both Persian fields. Handwritten brand artwork remains unchanged.",
                        "برای نمایش کامل فارسی، عنوان و توضیحات فارسی را هم وارد کنید. تصاویر دست‌نویس برند تغییری نمی‌کنند.",
                      )}
                    </p>
                    <BilingualFields value={product} onChange={update} />
                    <div className="form-grid">
                      <Field
                        en="Creator / brand"
                        fa="سازنده / برند"
                        value={product.creator}
                        onChange={(v) => update("creator", v)}
                      />
                      <Choice
                        en="Category"
                        fa="دسته‌بندی"
                        value={product.category}
                        onChange={(v) => update("category", v)}
                        options={categories}
                      />
                      <Field
                        en="Price · USD (0 = free)"
                        fa="قیمت به دلار (صفر = رایگان)"
                        type="number"
                        min="0"
                        max="1000000"
                        step="0.01"
                        value={product.price}
                        onChange={(v) =>
                          update("price", v === "" ? "" : Number(v))
                        }
                      />
                      <Choice
                        en="Publication"
                        fa="وضعیت انتشار"
                        value={product.status}
                        onChange={(v) => update("status", v)}
                        options={[
                          ["draft", "Draft / hidden", "پیش‌نویس / پنهان"],
                          [
                            "published",
                            "Published / visible",
                            "منتشرشده / نمایان",
                          ],
                        ]}
                      />
                    </div>
                    <fieldset className="ind-editor-platforms">
                      <legend>
                        {t("Compatible platforms", "پلتفرم‌های سازگار")}
                      </legend>
                      {platforms.map(([id, en, fa]) => (
                        <label key={id}>
                          <input
                            type="checkbox"
                            checked={product.platforms.includes(id)}
                            onChange={(e) =>
                              update(
                                "platforms",
                                e.target.checked
                                  ? [...product.platforms, id]
                                  : product.platforms.filter((x) => x !== id),
                              )
                            }
                          />
                          {t(en, fa)}
                        </label>
                      ))}
                    </fieldset>
                    <UploadField
                      en="Product image · PNG / JPEG / WebP"
                      fa="تصویر محصول · PNG / JPEG / WebP"
                      value={product.image}
                      onChange={(v) => update("image", v)}
                    />
                    {product.image && (
                      <img
                        className="ind-editor-preview"
                        src={product.image}
                        alt={t(product.title, product.titleFa)}
                      />
                    )}
                    <p className="ind-editor-hint">
                      {t(
                        "Images are stored after upload. Product changes become visible only after Save changes. No ratings or sales totals are fabricated.",
                        "تصویر پس از بارگذاری ذخیره می‌شود. تغییرات محصول فقط با دکمهٔ ذخیره اعمال می‌شوند. امتیاز یا تعداد فروش ساختگی ثبت نمی‌شود.",
                      )}
                    </p>
                    <button
                      className="ind-button"
                      disabled={busy || !dirty}
                      onClick={save}
                    >
                      <Save size={16} />
                      {t("Save changes", "ذخیرهٔ تغییرات")}
                    </button>
                  </>
                ) : (
                  <div className="ind-empty">
                    <Plus size={32} />
                    <h2>
                      {t(
                        "Add your first indicator",
                        "اولین اندیکاتور را اضافه کنید",
                      )}
                    </h2>
                    <p>
                      {t(
                        "Start with a draft. Add an image, title, description, platform and price, then publish it.",
                        "با یک پیش‌نویس شروع کنید. تصویر، عنوان، توضیحات، پلتفرم و قیمت را تکمیل کنید و سپس منتشر کنید.",
                      )}
                    </p>
                    <button className="ind-button" onClick={add}>
                      {t("Add indicator", "افزودن اندیکاتور")}
                    </button>
                  </div>
                )}
              </fieldset>
            </div>
          )
        )}
      </main>
      {remove && (
        <Modal
          title={t("Delete this indicator?", "این اندیکاتور حذف شود؟")}
          onClose={() => setRemove(null)}
        >
          <p>
            {t(
              "It will be removed from this draft. Save changes to apply the deletion.",
              "از این پیش‌نویس حذف می‌شود. برای اعمال حذف، تغییرات را ذخیره کنید.",
            )}
          </p>
          <div className="ind-confirm">
            <button
              className="ind-button outline"
              onClick={() => setRemove(null)}
            >
              {t("Cancel", "انصراف")}
            </button>
            <button
              className="ind-button"
              onClick={() => {
                setData((d) => ({
                  ...d,
                  config: {
                    products: d.config.products.filter((p) => p.id !== remove),
                  },
                }));
                if (selected === remove) setSelected(null);
                setRemove(null);
              }}
            >
              {t("Delete", "حذف")}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
