"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import frMessages from "../../../messages/fr.json";
import enMessages from "../../../messages/en.json";
import {
  buildIndex,
  normalize,
  searchIndex,
  type Section,
  type SearchResult,
} from "./cmdk-search";

const ALL_SECTIONS: Section[] = [
  "home",
  "about",
  "stack",
  "journey",
  "projects",
  "contact",
];

function scrollToSection(id: Section) {
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

function highlight(text: string, matches: string[]): React.ReactNode {
  if (!text || matches.length === 0) return text;
  // Match spans on the original (non-normalized) text by mapping positions
  // approximately. Cheap approach: split on word boundaries, mark words whose
  // normalized form starts with one of the matched tokens.
  const parts = text.split(/(\s+)/);
  return parts.map((part, i) => {
    const n = normalize(part);
    const hit = matches.some(
      (m) => m && (n === m || n.startsWith(m) || m.startsWith(n))
    );
    return hit ? (
      <mark key={i} className="fn-cmdk-mark">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    );
  });
}

export function CmdPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const locale = useLocale();
  const tNav = useTranslations("Portfolio.nav");
  const tCmd = useTranslations("Portfolio.cmdk");

  const index = useMemo(() => {
    const messages = locale === "fr" ? frMessages : enMessages;
    return buildIndex(messages, locale);
  }, [locale]);

  useEffect(() => {
    const onEvent = () => setOpen((o) => !o);
    window.addEventListener("fn:cmdk", onEvent);
    return () => window.removeEventListener("fn:cmdk", onEvent);
  }, []);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setSelected(0);
    const tid = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(tid);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const defaultResults: SearchResult[] = useMemo(
    () =>
      ALL_SECTIONS.map((s) => ({
        section: s,
        score: 0,
        snippet: "",
        matched: [],
      })),
    []
  );

  const results = query.trim() ? searchIndex(index, query) : defaultResults;
  const showEmpty = query.trim().length > 0 && results.length === 0;

  useEffect(() => {
    if (selected >= results.length) setSelected(0);
  }, [results.length, selected]);

  useEffect(() => {
    if (!open) return;
    const li = listRef.current?.querySelector<HTMLLIElement>(
      `li[data-idx="${selected}"]`
    );
    li?.scrollIntoView({ block: "nearest" });
  }, [selected, open]);

  const choose = (id: Section) => {
    setOpen(false);
    scrollToSection(id);
  };

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => (results.length ? (s + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) =>
        results.length ? (s - 1 + results.length) % results.length : 0
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const r = results[selected];
      if (r) choose(r.section);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fn-cmdk-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={tCmd("title")}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div className="fn-cmdk" onMouseDown={(e) => e.stopPropagation()}>
        <div className="fn-cmdk-input-row">
          <span className="fn-cmdk-icon" aria-hidden>
            ⌕
          </span>
          <input
            ref={inputRef}
            className="fn-cmdk-input"
            type="text"
            placeholder={tCmd("placeholder")}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelected(0);
            }}
            onKeyDown={onInputKey}
            spellCheck={false}
            autoComplete="off"
            aria-controls="fn-cmdk-list"
            aria-activedescendant={
              results[selected]
                ? `fn-cmdk-opt-${results[selected].section}`
                : undefined
            }
          />
          <kbd className="fn-cmdk-esc">esc</kbd>
        </div>

        {showEmpty ? (
          <div className="fn-cmdk-empty">{tCmd("empty")}</div>
        ) : (
          <ul
            ref={listRef}
            id="fn-cmdk-list"
            className="fn-cmdk-list"
            role="listbox"
          >
            {results.map((r, i) => {
              const label = tNav(r.section);
              return (
                <li
                  key={r.section}
                  id={`fn-cmdk-opt-${r.section}`}
                  data-idx={i}
                  role="option"
                  aria-selected={i === selected}
                  className={`fn-cmdk-item ${
                    i === selected ? "is-selected" : ""
                  }`}
                  onMouseEnter={() => setSelected(i)}
                  onClick={() => choose(r.section)}
                >
                  <span className="fn-cmdk-item-arrow" aria-hidden>
                    ↳
                  </span>
                  <div className="fn-cmdk-item-body">
                    <span className="fn-cmdk-item-label">{label}</span>
                    {r.snippet && (
                      <span className="fn-cmdk-item-snippet">
                        {highlight(r.snippet, r.matched)}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <div className="fn-cmdk-foot">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd>
            {tCmd("navigate")}
          </span>
          <span>
            <kbd>↵</kbd>
            {tCmd("select")}
          </span>
          <span>
            <kbd>esc</kbd>
            {tCmd("close")}
          </span>
        </div>
      </div>
    </div>
  );
}
