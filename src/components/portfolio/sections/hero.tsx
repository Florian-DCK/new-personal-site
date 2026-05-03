"use client";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useInView } from "../hooks";
import { Squiggle, Arrow, Marquee } from "../atoms";
import { Draggable } from "../draggable";
import { ReactiveWord } from "../reactive-word";

export function FnHero() {
  const t = useTranslations("Portfolio.hero");
  const [ref] = useInView<HTMLElement>({ threshold: 0.1 });

  const marquee = t.raw("marquee") as string[];
  const postit1 = (t("postit1Body") as string).split("\n");
  const bold1 = t("postit1Boldword");

  const renderPostit = (lines: string[], bold: string) => (
    <p>
      {lines.map((line, i) => {
        const idx = line.indexOf(bold);
        if (idx === -1) {
          return (
            <span key={i}>
              {line}
              {i < lines.length - 1 && <br />}
            </span>
          );
        }
        return (
          <span key={i}>
            {line.slice(0, idx)}
            <b>{bold}</b>
            {line.slice(idx + bold.length)}
            {i < lines.length - 1 && <br />}
          </span>
        );
      })}
    </p>
  );

  return (
    <section ref={ref} data-section="home" className="fn-hero">
      <div className="fn-hero-meta">
        <span>{t("metaVol")}</span>
        <span>{t("metaDate")}</span>
        <span>{t("metaPlace")}</span>
      </div>
      <div className="fn-hero-grid">
        <div className="fn-hero-text">
          <div className="fn-kicker">
            <Squiggle w={26} color="var(--accent)" strokeWidth={2} />
            <span>{t("kicker")}</span>
          </div>
          <h1 className="fn-h1">
            <span className="fn-line">{t("title1")}</span>
            <span className="fn-line fn-italic fn-accent">{t("title2")}</span>
            <span className="fn-line fn-stroke">
              {(() => {
                const line = t("title3");
                const word = t("title3Word");
                const i = line.indexOf(word);
                if (i < 0) return line;
                return (
                  <>
                    {line.slice(0, i)}
                    <ReactiveWord word={word} />
                    {line.slice(i + word.length)}
                  </>
                );
              })()}
            </span>
          </h1>
          <p className="fn-lead">{t("sub")}</p>
          <div className="fn-hero-cta">
            <a
              href="#projects"
              className="fn-btn fn-btn-primary"
              onClick={(e) => {
                e.preventDefault();
                const el = document.querySelector('[data-section="projects"]');
                if (el)
                  window.scrollTo({
                    top:
                      (el as HTMLElement).getBoundingClientRect().top +
                      window.scrollY -
                      96,
                    behavior: "smooth",
                  });
              }}
            >
              <span>{t("cta1")}</span> <Arrow size={18} />
            </a>
            <Link href="/cv" className="fn-btn fn-btn-ghost">
              {t("cta2")} ↓
            </Link>
          </div>
        </div>
        <div className="fn-hero-portrait">
          <Draggable init={{ x: 60, y: 20 }} rotate={-3} className="fn-photo-wrap">
            <div className="fn-photo">
              <div className="fn-photo-img">
                <img
                  src="/florian.png"
                  alt="Florian Donckers"
                  draggable={false}
                />
              </div>
              <span className="fn-photo-caption">{t("photoCaption")}</span>
            </div>
          </Draggable>

          <svg className="fn-hint-svg fn-hint-photo" viewBox="0 0 240 220" aria-hidden>
            <text
              x="10"
              y="40"
              fontFamily="Caveat, cursive"
              fontSize="26"
              fill="var(--ink)"
              transform="rotate(-8 10 40)"
            >
              {t("hint")}
            </text>
            <path
              d="M 90 50 Q 130 80, 150 130 Q 165 165, 175 195"
              stroke="var(--ink)"
              fill="none"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="3 4"
            />
            <path
              d="M 175 195 L 167 188 M 175 195 L 177 184"
              stroke="var(--ink)"
              fill="none"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>

          <Draggable init={{ x: -30, y: 320 }} rotate={-8} className="fn-postit-wrap">
            <div className="fn-postit" style={{ background: "#ffe375" }}>
              <span className="fn-pin" />
              {renderPostit(postit1, bold1)}
              <small>{t("postit1Foot")}</small>
            </div>
          </Draggable>
          <Draggable init={{ x: 320, y: 280 }} rotate={6} className="fn-postit-wrap">
            <div className="fn-postit" style={{ background: "#a8e6cf" }}>
              <span className="fn-pin" />
              <p>{t("postit2Body")}</p>
              <a
                href={`mailto:${t("postit2Email")}`}
                data-no-drag
                className="fn-postit-mail"
              >
                {t("postit2Email")}
              </a>
            </div>
          </Draggable>
        </div>
      </div>
      <Marquee>
        {marquee.flatMap((s, i) => [
          <span key={`s-${i}`}>{s}</span>,
          <span key={`d-${i}`}>·</span>,
        ])}
      </Marquee>
    </section>
  );
}
