"use client";
import { useTranslations } from "next-intl";
import { useInView } from "../hooks";
import { SectionHead } from "../atoms";

type Item = { year: string; role: string; place: string; desc: string };

export function FnJourney() {
  const t = useTranslations("Portfolio.journey");
  const [ref, inView] = useInView<HTMLElement>();
  const items = t.raw("items") as Item[];
  return (
    <section
      ref={ref}
      data-section="journey"
      className={`fn-journey ${inView ? "is-in" : ""}`}
    >
      <SectionHead num="№04" cat={t("title")} kicker={t("kicker")} />
      <h2 className="fn-mega">
        {t("mega1")}{" "}
        <span className="fn-italic fn-accent">{t("mega2")}</span>
      </h2>
      <div className="fn-jrn-list">
        {items.map((it, i) => (
          <article key={i} className="fn-jrn">
            <div className="fn-jrn-year">{it.year}</div>
            <div className="fn-jrn-body">
              <h3>{it.role}</h3>
              <div className="fn-jrn-place">@ {it.place}</div>
              <p>{it.desc}</p>
            </div>
            <div className="fn-jrn-num">
              {String(items.length - i).padStart(2, "0")}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
