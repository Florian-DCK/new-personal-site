"use client";
import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useIsMac } from "./hooks";

const SECTIONS = [
  "home",
  "about",
  "stack",
  "journey",
  "projects",
  "contact",
] as const;

export type Section = (typeof SECTIONS)[number];

function goTo(id: string) {
  if (id === "home") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const el = document.querySelector(`[data-section="${id}"]`);
  if (el) {
    const top =
      (el as HTMLElement).getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top, behavior: "smooth" });
  }
}

function dispatchCmdK() {
  window.dispatchEvent(new CustomEvent("fn:cmdk"));
}

export function FnNav({ active }: { active: Section }) {
  const t = useTranslations("Portfolio.nav");
  const isMac = useIsMac();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        dispatchCmdK();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="fn-nav">
      <button
        type="button"
        className="fn-nav-mark"
        onClick={() => goTo("home")}
        aria-label={t("home")}
      >
        <span className="fn-nav-mark-l1">
          Florian <em>Donckers</em>
        </span>
        <span className="fn-nav-mark-role">{t("role")}</span>
      </button>

      <nav className="fn-nav-links" aria-label="Primary">
        {SECTIONS.map((id) => (
          <a
            key={id}
            href={id === "home" ? "#top" : `#${id}`}
            onClick={(e) => {
              e.preventDefault();
              goTo(id);
            }}
            className={`fn-nav-link ${active === id ? "is-active" : ""}`}
            aria-current={active === id ? "location" : undefined}
          >
            {t(id)}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="fn-nav-cmd"
        aria-label={t("cmdAria")}
        onClick={dispatchCmdK}
      >
        <span className="fn-nav-cmd-search" aria-hidden>
          ⌕
        </span>
        <span className="fn-nav-cmd-text">{t("search")}</span>
        <span className="fn-nav-cmd-keys" aria-hidden suppressHydrationWarning>
          <span className="fn-nav-cmd-key">{isMac ? "⌘" : "Ctrl"}</span>
          <span className="fn-nav-cmd-key">K</span>
        </span>
      </button>
    </header>
  );
}

export function IssueBar({ scrollP }: { scrollP: number }) {
  const t = useTranslations("Portfolio.issue");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [monthYear, setMonthYear] = useState("");

  useEffect(() => {
    setMonthYear(
      new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" })
        .format(new Date())
        .toUpperCase()
    );
  }, [locale]);

  const switchLocale = (next: "fr" | "en") => {
    if (next === locale) return;
    router.replace(pathname, { locale: next });
  };

  return (
    <div className="fn-issuebar">
      <span>{t("label")}</span>
      <span>·</span>
      <span suppressHydrationWarning>{monthYear}</span>
      <span>·</span>
      <span>{t("place")}</span>
      <span className="fn-issuebar-right">
        <span className="fn-lang" aria-label="language">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              switchLocale("fr");
            }}
            className={locale === "fr" ? "is-active" : ""}
          >
            FR
          </a>
          <span aria-hidden>·</span>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              switchLocale("en");
            }}
            className={locale === "en" ? "is-active" : ""}
          >
            EN
          </a>
        </span>
        <span aria-hidden>·</span>
        <span>
          {Math.round(scrollP * 100)
            .toString()
            .padStart(2, "0")}
          %
        </span>
      </span>
    </div>
  );
}

export function ProgressBar({ scrollP }: { scrollP: number }) {
  return (
    <div className="fn-progress" style={{ transform: `scaleX(${scrollP})` }} />
  );
}

export function SideRail({
  active,
  onGo,
}: {
  active: Section;
  onGo: (id: Section) => void;
}) {
  return (
    <aside className="fn-rail" aria-label="section progress">
      {SECTIONS.map((id) => (
        <button
          key={id}
          className={`fn-dot ${active === id ? "is-active" : ""}`}
          onClick={() => onGo(id)}
          aria-label={id}
        >
          <span />
        </button>
      ))}
    </aside>
  );
}

export { SECTIONS };
