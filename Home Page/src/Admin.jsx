import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  Plus,
  Save,
  Trash2,
  Download,
  RefreshCw,
  Eye,
} from "lucide-react";
import { moduleTypes, statuses, configSchema } from "../shared/config.mjs";
import { Asset } from "./components";
export default function Admin() {
  const [data, setData] = useState(null),
    [saved, setSaved] = useState(""),
    [error, setError] = useState(""),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false),
    [selected, setSelected] = useState(null),
    [remove, setRemove] = useState(null);
  const load = async () => {
    setError("");
    try {
      const r = await fetch("/api/admin/home");
      const d = await r.json();
      if (!r.ok) throw Error(d.error);
      setData(d);
      setSaved(JSON.stringify(d.config));
      setSelected((s) =>
        d.config.modules.some((m) => m.id === s) ? s : d.config.modules[0]?.id,
      );
    } catch (e) {
      setError(e.message);
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
  const reorder = (id, delta) => {
    const list = [...data.config.modules].sort((a, b) => a.order - b.order);
    const index = list.findIndex((m) => m.id === id);
    if (index + delta < 0 || index + delta >= list.length) return;
    [list[index], list[index + delta]] = [list[index + delta], list[index]];
    setData({
      ...data,
      config: {
        ...data.config,
        modules: list.map((m, i) => ({ ...m, order: i })),
      },
    });
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
      cta: "Learn more",
      url: "",
    };
    setData({
      ...data,
      config: { ...data.config, modules: [...data.config.modules, m] },
    });
    setSelected(id);
  };
  const save = async () => {
    setError("");
    setMessage("");
    const valid = configSchema.safeParse(data.config);
    if (!valid.success) {
      setError(valid.error.issues.map((x) => x.message).join(" "));
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
      if (!r.ok) throw Error(result.error);
      setData({ ...data, ...result, config: valid.data });
      setSaved(JSON.stringify(valid.data));
      setMessage("Saved to database. Your homepage is updated.");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };
  const backup = () => {
    const blob = new Blob([JSON.stringify(data.config, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "greenorred-home-config.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const restore = async (e) => {
    setError("");
    try {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 64000) throw Error("Backup exceeds 64 KB.");
      const config = configSchema.parse(JSON.parse(await file.text()));
      setData({ ...data, config });
      setSelected(config.modules[0]?.id);
      setMessage("Backup loaded as a draft. Review it, then save.");
    } catch (e) {
      setError("Invalid backup: " + e.message);
    }
  };
  const current = data?.config.modules.find((m) => m.id === selected);
  return (
    <div className="admin">
      <header className="admin-top">
        <a href="/">
          <Asset name="brand" alt="GreenOrRed" />
        </a>
        <span>HOMEPAGE STUDIO</span>
        <a className="more" href="/" target="_blank" rel="noreferrer">
          <Eye size={17} />
          Preview homepage
        </a>
      </header>
      <main className="admin-main">
        <div className="admin-title">
          <div>
            <span className="eyebrow">SITE ADMINISTRATION · TEST</span>
            <h1>Your homepage, your way.</h1>
            <p>
              Manage services, cards and visibility without changing the page
              code.
            </p>
            <p lang="fa" dir="rtl" className="admin-persian">
              مدیریت کارت‌ها و بخش‌های هوم — تغییرات فقط با «Save changes» اعمال
              می‌شوند.
            </p>
          </div>
          <button className="primary" disabled={!dirty || busy} onClick={save}>
            <Save size={17} />
            {busy ? "Saving…" : "Save changes"}
          </button>
        </div>
        {error && (
          <div role="alert" className="error">
            {error}
            <button onClick={load}>Reload saved settings</button>
          </div>
        )}
        {message && (
          <p className="success" role="status">
            {message}
          </p>
        )}
        {!data ? (
          <p className="loading">
            {error
              ? "Administration is not available."
              : "Loading saved settings…"}
          </p>
        ) : (
          <>
            <div className="admin-summary">
              <span>
                <strong>{data.config.modules.length}</strong> services
              </span>
              <span>
                <strong>
                  {
                    data.config.modules.filter((m) => m.enabled && m.showOnHome)
                      .length
                  }
                </strong>{" "}
                on homepage
              </span>
              <span>
                Revision <strong>{data.revision}</strong>
              </span>
              <span className={dirty ? "unsaved" : ""}>
                {dirty ? "● Unsaved changes" : "✓ All changes saved"}
              </span>
            </div>
            <div className="admin-layout">
              <aside className="admin-list">
                <div className="sub-heading">
                  <h2>Services & modules</h2>
                  <button onClick={add} aria-label="Add module">
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
                          <strong>{m.title}</strong>
                          <small>
                            {m.type} · {m.display}
                          </small>
                        </span>
                      </button>
                      <div className="reorder">
                        <button
                          onClick={() => reorder(m.id, -1)}
                          disabled={i === 0}
                          aria-label={"Move " + m.title + " up"}
                        >
                          <ArrowUp size={15} />
                        </button>
                        <button
                          onClick={() => reorder(m.id, 1)}
                          disabled={i === data.config.modules.length - 1}
                          aria-label={"Move " + m.title + " down"}
                        >
                          <ArrowDown size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                <button className="add-module" onClick={add}>
                  <Plus size={17} />
                  Add service or banner
                </button>
              </aside>
              <section className="module-editor">
                {current ? (
                  <>
                    <div className="sub-heading">
                      <div>
                        <span className="eyebrow">MODULE SETTINGS</span>
                        <h2>{current.title}</h2>
                        <code>{current.id}</code>
                      </div>
                      <button
                        className="danger subtle"
                        onClick={() => setRemove(current.id)}
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    </div>
                    <div className="toggle-grid">
                      <label className="toggle-setting">
                        <span>
                          <b>Service enabled</b>
                          <small>Keep all settings when switched off.</small>
                        </span>
                        <input
                          type="checkbox"
                          checked={current.enabled}
                          onChange={(e) =>
                            update(current.id, "enabled", e.target.checked)
                          }
                        />
                      </label>
                      <label className="toggle-setting">
                        <span>
                          <b>Show on homepage</b>
                          <small>
                            Hide here without disabling the service.
                          </small>
                        </span>
                        <input
                          type="checkbox"
                          checked={current.showOnHome}
                          onChange={(e) =>
                            update(current.id, "showOnHome", e.target.checked)
                          }
                        />
                      </label>
                    </div>
                    <div className="form-grid">
                      <label>
                        Title · English
                        <input
                          value={current.title}
                          onChange={(e) =>
                            update(current.id, "title", e.target.value)
                          }
                          maxLength={90}
                        />
                      </label>
                      <label>
                        عنوان فارسی
                        <input
                          dir="rtl"
                          value={current.titleFa}
                          onChange={(e) =>
                            update(current.id, "titleFa", e.target.value)
                          }
                          maxLength={300}
                        />
                      </label>
                      <label>
                        Description · English
                        <textarea
                          value={current.description}
                          onChange={(e) =>
                            update(current.id, "description", e.target.value)
                          }
                          maxLength={300}
                        />
                      </label>
                      <label>
                        توضیح فارسی
                        <textarea
                          dir="rtl"
                          value={current.descriptionFa}
                          onChange={(e) =>
                            update(current.id, "descriptionFa", e.target.value)
                          }
                          maxLength={300}
                        />
                      </label>
                      <label>
                        Content renderer
                        <select
                          value={current.type}
                          onChange={(e) => {
                            update(current.id, "type", e.target.value);
                            if (
                              ["journal", "products"].includes(e.target.value)
                            )
                              update(current.id, "display", "permanent");
                            if (e.target.value === "developers")
                              update(current.id, "blocks", [
                                "affiliate",
                                "requests",
                              ]);
                          }}
                        >
                          {moduleTypes.map((x) => (
                            <option key={x}>{x}</option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Service status
                        <select
                          value={current.status}
                          onChange={(e) =>
                            update(current.id, "status", e.target.value)
                          }
                        >
                          {statuses.map((x) => (
                            <option key={x}>{x}</option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Display mode
                        <select
                          value={current.display}
                          disabled={["journal", "products"].includes(
                            current.type,
                          )}
                          onChange={(e) =>
                            update(current.id, "display", e.target.value)
                          }
                        >
                          <option value="expandable">
                            Expandable referral card
                          </option>
                          <option value="permanent">Independent section</option>
                        </select>
                      </label>
                      <label>
                        Card colour
                        <select
                          value={current.theme}
                          onChange={(e) =>
                            update(current.id, "theme", e.target.value)
                          }
                        >
                          {["green", "orange", "red"].map((x) => (
                            <option key={x}>{x}</option>
                          ))}
                        </select>
                      </label>
                      {current.type === "custom" && (
                        <>
                          <label>
                            Button label
                            <input
                              value={current.cta}
                              onChange={(e) =>
                                update(current.id, "cta", e.target.value)
                              }
                            />
                          </label>
                          <label>
                            Destination path (optional)
                            <input
                              placeholder="/community"
                              value={current.url}
                              onChange={(e) =>
                                update(current.id, "url", e.target.value)
                              }
                            />
                          </label>
                        </>
                      )}
                    </div>
                    {current.type === "developers" && (
                      <fieldset className="block-settings">
                        <legend>Visible blocks</legend>
                        {[
                          ["affiliate", "Affiliate Program"],
                          ["requests", "Custom Requests"],
                        ].map(([id, title]) => (
                          <label key={id}>
                            <input
                              type="checkbox"
                              checked={current.blocks.includes(id)}
                              onChange={(e) =>
                                update(
                                  current.id,
                                  "blocks",
                                  e.target.checked
                                    ? [...current.blocks, id]
                                    : current.blocks.filter((x) => x !== id),
                                )
                              }
                            />
                            {title}
                          </label>
                        ))}
                      </fieldset>
                    )}
                    <p className="editor-note">
                      Turning off a service never deletes its stored
                      configuration. Removing a module only removes its homepage
                      entry. This studio does not delete trading, journal or
                      account data.
                    </p>
                  </>
                ) : (
                  <p>Select a service or add your first module.</p>
                )}
              </section>
            </div>
            <div className="admin-bottom">
              <button onClick={backup}>
                <Download size={16} />
                Export configuration
              </button>
              <label className="file-import">
                Import configuration
                <input
                  type="file"
                  accept="application/json,.json"
                  onChange={restore}
                />
              </label>
              <span>
                Saved{" "}
                {data.updatedAt
                  ? new Date(data.updatedAt).toLocaleString()
                  : "configuration: original design defaults"}
              </span>
            </div>
          </>
        )}
        {remove && (
          <div className="confirm-backdrop">
            <section
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="remove-title"
            >
              <h2 id="remove-title">Remove this homepage entry?</h2>
              <p>
                Its configuration will be removed when you save. Switch off the
                service instead if you want to preserve it.
              </p>
              <div>
                <button onClick={() => setRemove(null)}>Cancel</button>
                <button
                  className="danger"
                  onClick={() => {
                    setData({
                      ...data,
                      config: {
                        ...data.config,
                        modules: data.config.modules.filter(
                          (m) => m.id !== remove,
                        ),
                      },
                    });
                    setSelected(null);
                    setRemove(null);
                  }}
                >
                  Remove entry
                </button>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
