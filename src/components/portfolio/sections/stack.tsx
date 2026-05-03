"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useInView } from "../hooks";
import { SectionHead } from "../atoms";

type Item = { name: string; desc: string };

function StackRow({ item, index }: { item: Item; index: number }) {
  const [r, inView] = useInView<HTMLElement>({ threshold: 0.4 });
  const [hover, setHover] = useState(false);
  return (
    <article
      ref={r}
      className={`fn-stack-row ${inView ? "is-in" : ""} ${
        hover ? "is-hover" : ""
      }`}
      style={{ transitionDelay: `${index * 40}ms` }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <span className="fn-stack-num">
        {String(index + 1).padStart(2, "0")}
      </span>
      <h3>{item.name}</h3>
      <p>{item.desc}</p>
    </article>
  );
}

export function FnStack() {
  const t = useTranslations("Portfolio.stack");
  const [ref, inView] = useInView<HTMLElement>();
  const items = t.raw("items") as Item[];
  return (
    <section
      ref={ref}
      data-section="stack"
      className={`fn-stack ${inView ? "is-in" : ""}`}
    >
      <SectionHead num="№03" cat={t("title")} kicker={t("kicker")} />
      <h2 className="fn-mega">
        {t("mega1")}{" "}
        <span className="fn-italic fn-accent">{t("mega2")}</span>
      </h2>
      <p className="fn-sub">{t("sub")}</p>
      <div className="fn-stack-list">
        {items.map((it, i) => (
          <StackRow key={it.name} item={it} index={i} />
        ))}
      </div>
    </section>
  );
}
