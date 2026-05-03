"use client";
import { useTranslations } from "next-intl";
import { useInView } from "../hooks";
import { SectionHead } from "../atoms";
import { Draggable } from "../draggable";

export function FnAbout() {
  const t = useTranslations("Portfolio.about");
  const [ref, inView] = useInView<HTMLElement>();
  const facts = t.raw("facts") as [string, string][];

  return (
    <section
      ref={ref}
      data-section="about"
      className={`fn-about ${inView ? "is-in" : ""}`}
    >
      <SectionHead num="№02" cat={t("title")} kicker={t("kicker")} />
      <div className="fn-pull">
        <span className="fn-quote-mark">“</span>
        {t.rich("pull", { em: (chunks) => <em>{chunks}</em> })}
      </div>
      <div className="fn-about-grid">
        <div className="fn-prose">
          <p className="fn-drop">{t("p1")}</p>
          <p>{t("p2")}</p>
          <p>{t("p3")}</p>
        </div>
        <div className="fn-facts">
          <svg
            className="fn-hint-svg fn-hint-facts"
            viewBox="0 0 220 140"
            aria-hidden
          >
            <text
              x="20"
              y="30"
              fontFamily="Caveat, cursive"
              fontSize="24"
              fill="var(--ink)"
              transform="rotate(-4 20 30)"
            >
              {t("factsHint")}
            </text>
            <path
              d="M 80 50 Q 130 80, 175 115"
              stroke="var(--ink)"
              fill="none"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="3 4"
            />
            <path
              d="M 175 115 L 164 113 M 175 115 L 171 105"
              stroke="var(--ink)"
              fill="none"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          {facts.map(([k, v], i) => (
            <Draggable
              key={i}
              init={{ x: 0, y: i * 80 }}
              rotate={i % 2 ? 2 : -2}
              className="fn-fact-wrap"
            >
              <div className="fn-fact-card">
                <span className="fn-fact-k">{k}</span>
                <span className="fn-fact-v">{v}</span>
              </div>
            </Draggable>
          ))}
        </div>
      </div>
    </section>
  );
}
