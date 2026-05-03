"use client";
import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

type Exp = {
  role: string;
  place: string;
  city: string;
  type: string;
  period: string;
  desc: string;
};
type Edu = { degree: string; place: string; period: string; desc: string };
type Fact = { k: string; v: string; href?: string };
type Pair = { k: string; v: string };

function Squiggle({
  w = 60,
  h = 8,
  color = "currentColor",
  strokeWidth = 1.6,
}: {
  w?: number;
  h?: number;
  color?: string;
  strokeWidth?: number;
}) {
  const d = `M 1 ${h / 2} Q ${w * 0.16} 1, ${w * 0.32} ${h / 2} T ${
    w * 0.64
  } ${h / 2} T ${w - 1} ${h / 2}`;
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      width={w}
      height={h}
      fill="none"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d={d}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}

function Portrait() {
  return (
    <img
      src="/florian.png"
      alt="Florian Donckers"
      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
    />
  );
}

function HandArrow() {
  return (
    <svg width="60" height="38" viewBox="0 0 60 38" aria-hidden>
      <path
        d="M 4 8 Q 24 4, 38 18 Q 50 28, 56 32"
        stroke="var(--ink)"
        fill="none"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeDasharray="3 4"
      />
      <path
        d="M 56 32 L 47 28 M 56 32 L 51 22"
        stroke="var(--ink)"
        fill="none"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function formatIssueDate(locale: string): string {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return locale === "fr" ? `${dd}.${mm}.${yyyy}` : `${mm}.${dd}.${yyyy}`;
}

export function CV() {
  const t = useTranslations("Resume");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [issueDate, setIssueDate] = useState("");

  useEffect(() => {
    setIssueDate(formatIssueDate(locale));
  }, [locale]);

  const exp = t.raw("exp") as Exp[];
  const edu = t.raw("edu") as Edu[];
  const stackPrimary = t.raw("stackPrimary") as string[];
  const stackSecondary = t.raw("stackSecondary") as string[];
  const facts = t.raw("facts") as Fact[];
  const langs = t.raw("langs") as Pair[];
  const hl = t.raw("hl") as Pair[];

  const switchLocale = (next: "fr" | "en") => {
    if (next === locale) return;
    router.replace(pathname, { locale: next });
  };

  return (
    <div className="cv-shell">
      <div className="lang-switch" data-no-print>
        <button
          className={locale === "fr" ? "is-on" : ""}
          onClick={() => switchLocale("fr")}
        >
          FR
        </button>
        <button
          className={locale === "en" ? "is-on" : ""}
          onClick={() => switchLocale("en")}
        >
          EN
        </button>
      </div>
      <button
        type="button"
        className="print-btn"
        data-no-print
        onClick={() => window.print()}
      >
        {t("printBtn")}
      </button>

      <article className="cv">
        <span className="cv-watermark">CV</span>

        {/* Issue bar */}
        <div className="cv-issuebar">
          <span>
            <span className="dot" />
            {t("vol")} · <span suppressHydrationWarning>{issueDate}</span> ·{" "}
            {t("city")}
          </span>
          <span className="gap" />
          <span>{t("issueRef")}</span>
          <span className="gap" />
          <span>{t("doc")}</span>
        </div>

        {/* Hero */}
        <header className="cv-hero">
          <div>
            <h1 className="cv-name">
              florian
              <br />
              <span className="it ac">donckers.</span>
            </h1>
            <Squiggle
              w={120}
              h={9}
              color="var(--ink)"
              strokeWidth={1.8}
            />
          </div>
          <div className="cv-role-block">
            <div className="cv-role">{t("roleKicker")}</div>
            <div className="cv-title">{t("role")}</div>
            <div className="cv-status-pill">
              <span className="dot" />
              {t("status")}
            </div>
          </div>
        </header>

        {/* Polaroid + handwritten note */}
        <div className="cv-portrait">
          <div className="frame">
            <div className="pic">
              <Portrait />
            </div>
            <span className="cap">{t("caption")}</span>
          </div>
        </div>
        <div className="cv-note">
          <span>{t("note")}</span>
          <HandArrow />
        </div>

        {/* Pull quote */}
        <blockquote className="cv-quote">
          {t.rich("quote", {
            accent: (chunks) => <span className="accent">{chunks}</span>,
            italic: (chunks) => <i>{chunks}</i>,
          })}
        </blockquote>

        {/* Body */}
        <div className="cv-body">
          {/* LEFT — Experience + Education */}
          <div>
            <section className="cv-sect">
              <div className="cv-sect-head">
                <span className="cv-sect-num">№01</span>
                <h2 className="cv-sect-title">
                  {t("expTitle").toLowerCase()}
                  <span className="it"> /</span>
                </h2>
                <span className="cv-sect-kicker">{t("expKicker")}</span>
              </div>
              {exp.map((x, i) => (
                <article className="xp" key={i}>
                  <div className="xp-top">
                    <h3 className="xp-role">{x.role}</h3>
                    <span className="xp-period">{x.period}</span>
                  </div>
                  <div className="xp-place">
                    {x.place} · {x.city}
                    <span className="type">{x.type}</span>
                  </div>
                  <p className="xp-desc">{x.desc}</p>
                </article>
              ))}
            </section>

            <section className="cv-sect">
              <div className="cv-sect-head">
                <span className="cv-sect-num">№02</span>
                <h2 className="cv-sect-title">
                  {t("eduTitle").toLowerCase()}
                  <span className="it"> /</span>
                </h2>
              </div>
              {edu.map((e, i) => (
                <article className="edu" key={i}>
                  <div className="edu-top">
                    <h3 className="edu-degree">{e.degree}</h3>
                    <span className="edu-period">{e.period}</span>
                  </div>
                  <div className="edu-place">{e.place}</div>
                  <p className="edu-desc">{e.desc}</p>
                </article>
              ))}
            </section>
          </div>

          {/* RIGHT — Stack + Contact + Languages + Highlights */}
          <div>
            <section className="cv-sect">
              <div className="cv-sect-head">
                <span className="cv-sect-num">№03</span>
                <h2 className="cv-sect-title">
                  {t("stackTitle").toLowerCase()}
                  <span className="it"> /</span>
                </h2>
                <span className="cv-sect-kicker">{t("stackKicker")}</span>
              </div>
              <div className="stack-chips" style={{ marginBottom: 8 }}>
                {stackPrimary.map((s, i) => (
                  <span className="chip is-primary" key={s}>
                    <span className="num">0{i + 1}</span>
                    {s}
                  </span>
                ))}
              </div>
              <div className="stack-chips">
                {stackSecondary.map((s, i) => (
                  <span className="chip" key={s}>
                    <span className="num">
                      {String(stackPrimary.length + i + 1).padStart(2, "0")}
                    </span>
                    {s}
                  </span>
                ))}
              </div>
            </section>

            <section className="cv-sect">
              <div className="cv-sect-head">
                <span className="cv-sect-num">№04</span>
                <h2 className="cv-sect-title">
                  {t("contactTitle").toLowerCase()}
                  <span className="it"> /</span>
                </h2>
              </div>
              <div className="facts">
                {facts.map((f, i) => (
                  <div className="fact" key={i}>
                    <span className="fact-k">{f.k}</span>
                    <span className="fact-v">
                      {f.href ? <a href={f.href}>{f.v}</a> : f.v}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="cv-sect">
              <div className="cv-sect-head">
                <span className="cv-sect-num">№05</span>
                <h2 className="cv-sect-title">
                  {t("langTitle").toLowerCase()}
                  <span className="it"> /</span>
                </h2>
              </div>
              {langs.map((l, i) => (
                <div className="lang-row" key={i}>
                  <span>{l.k}</span>
                  <span className="lang-level">{l.v}</span>
                </div>
              ))}
            </section>

            <section className="cv-sect">
              <div className="cv-sect-head">
                <span className="cv-sect-num">№06</span>
                <h2 className="cv-sect-title">
                  {t("hlTitle").toLowerCase()}
                  <span className="it"> /</span>
                </h2>
              </div>
              <div className="hl-list">
                {hl.map((h, i) => (
                  <div className="hl-row" key={i}>
                    <div className="hl-marker">★</div>
                    <div>
                      <div className="hl-k">{h.k}</div>
                      <div className="hl-v">{h.v}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <footer className="cv-foot">
          <span>{t("footerL")}</span>
          <Squiggle w={50} h={8} color="var(--accent)" strokeWidth={1.6} />
          <span>{t("footerR")}</span>
        </footer>
      </article>
    </div>
  );
}
