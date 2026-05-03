"use client";
import { useTranslations } from "next-intl";
import { useInView } from "../hooks";
import { SectionHead } from "../atoms";
import { Draggable } from "../draggable";

export function FnProjects() {
  const t = useTranslations("Portfolio.projects");
  const [ref, inView] = useInView<HTMLElement>();

  const cols = 3;
  const w = 220;
  const h = 280;
  const gap = 32;

  return (
    <section
      ref={ref}
      data-section="projects"
      className={`fn-projects ${inView ? "is-in" : ""}`}
    >
      <SectionHead num="№05" cat={t("title")} kicker={t("kicker")} />
      <h2 className="fn-mega fn-italic">
        {t("mega1")} <span className="fn-accent">{t("mega2")}</span>
      </h2>
      <p className="fn-sub">{t("sub")}</p>
      <div className="fn-proj-board">
        <svg
          className="fn-hint-svg fn-hint-poly"
          viewBox="-30 0 310 130"
          aria-hidden
        >
          <text
            x="20"
            y="40"
            fontFamily="Caveat, cursive"
            fontSize="26"
            fill="var(--ink)"
            transform="rotate(-3 20 40)"
          >
            {t("hint")}
          </text>
          <path
            d="M 60 60 Q 25 80, -5 110"
            stroke="var(--ink)"
            fill="none"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="3 4"
          />
          <path
            d="M -5 110 L -2 99 M -5 110 L 6 107"
            stroke="var(--ink)"
            fill="none"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        {[1, 2, 3, 4, 5, 6].map((n, i) => {
          const r = Math.floor(i / cols);
          const c = i % cols;
          return (
            <Draggable
              key={n}
              init={{ x: c * (w + gap), y: r * (h + gap) }}
              rotate={((i * 11) % 9) - 4}
              className="fn-proj-wrap"
            >
              <div className="fn-polaroid">
                <div className="fn-polaroid-img">
                  <svg viewBox="0 0 200 150" preserveAspectRatio="xMidYMid slice">
                    <defs>
                      <pattern
                        id={`fnstr${n}`}
                        width="6"
                        height="6"
                        patternUnits="userSpaceOnUse"
                        patternTransform="rotate(45)"
                      >
                        <line
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="6"
                          stroke="currentColor"
                          strokeWidth="0.4"
                          opacity="0.4"
                        />
                      </pattern>
                    </defs>
                    <rect width="200" height="150" fill={`url(#fnstr${n})`} />
                    <text
                      x="100"
                      y="80"
                      textAnchor="middle"
                      fontFamily="JetBrains Mono, monospace"
                      fontSize="10"
                      fill="currentColor"
                      opacity="0.6"
                    >
                      project_0{n}.case
                    </text>
                  </svg>
                </div>
                <div className="fn-polaroid-meta">
                  <span className="fn-polaroid-num">/ 0{n}</span>
                  <h4>
                    {t("placeholder")} #{n}
                  </h4>
                  <small>{t("agency")}</small>
                </div>
              </div>
            </Draggable>
          );
        })}
      </div>
    </section>
  );
}
