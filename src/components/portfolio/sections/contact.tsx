"use client";
import { useTranslations } from "next-intl";
import { useInView } from "../hooks";
import { SectionHead, Marquee } from "../atoms";

export function FnContact() {
  const t = useTranslations("Portfolio.contact");
  const tHero = useTranslations("Portfolio.hero");
  const [ref, inView] = useInView<HTMLElement>();
  const marquee = t.raw("marquee") as string[];
  return (
    <section
      ref={ref}
      data-section="contact"
      className={`fn-contact ${inView ? "is-in" : ""}`}
    >
      <SectionHead num="№06" cat={t("title")} kicker={t("kicker")} />
      <h2 className="fn-mega fn-massive">
        <span>{t("mega1")} </span>
        <span className="fn-italic fn-accent">{t("mega2")}</span>
      </h2>
      <a href={`mailto:${t("mail")}`} className="fn-mail">
        {t("mail")} <span>↗</span>
      </a>
      <div className="fn-foot">
        <div>
          <small>{t("social")}</small>
          <div className="fn-foot-links">
            <a
              href="https://www.linkedin.com/in/florian-donckers-b60a08200/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/Florian-DCK"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
        <div>
          <small>{t("location")}</small>
          <p>{t("locationValue")}</p>
        </div>
        <div>
          <small>{t("status")}</small>
          <p>● {tHero("status")}</p>
        </div>
      </div>
      <Marquee reverse>
        {marquee.flatMap((s, i) => [
          <span key={`s-${i}`}>{s}</span>,
          <span key={`d-${i}`}>·</span>,
        ])}
      </Marquee>
    </section>
  );
}
