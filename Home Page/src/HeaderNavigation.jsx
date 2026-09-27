import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { navigation } from "../shared/navigation.mjs";
import { useI18n } from "./i18n";
export default function HeaderNavigation({ mobileOpen }) {
  const { t } = useI18n(),
    [active, setActive] = useState(null),
    ref = useRef();
  useEffect(() => {
    const close = (e) => {
      if (!ref.current?.contains(e.target)) setActive(null);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);
  return (
    <nav
      ref={ref}
      className={mobileOpen ? "nav open" : "nav"}
      aria-label={t("Main navigation")}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setActive(null);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          ref.current.querySelector('[aria-expanded="true"]')?.focus();
          setActive(null);
        }
      }}
    >
      {navigation.map((g) => (
        <div className="nav-group" key={g.id}>
          <button
            aria-expanded={active === g.id}
            aria-controls={"nav-" + g.id}
            onClick={() => setActive(active === g.id ? null : g.id)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive(g.id);
                requestAnimationFrame(() =>
                  document
                    .getElementById("nav-" + g.id)
                    ?.querySelector("a")
                    ?.focus(),
                );
              }
            }}
          >
            {t(g.en, g.fa)}
            <ChevronDown size={12} />
          </button>
          <div
            className="nav-dropdown"
            id={"nav-" + g.id}
            hidden={active !== g.id}
          >
            {g.items.map(([href, en, fa]) => (
              <a key={href} href={href}>
                {t(en, fa)}
              </a>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}
