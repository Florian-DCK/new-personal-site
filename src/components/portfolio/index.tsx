"use client";
import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Squiggle } from "./atoms";
import { useScrollProgress } from "./hooks";
import { BgWaves, InkTrail } from "./ink-trail";
import { CmdPalette } from "./cmdk";
import {
  FnNav,
  IssueBar,
  ProgressBar,
  SideRail,
  SECTIONS,
  type Section,
} from "./nav";
import { FnHero } from "./sections/hero";
import { FnAbout } from "./sections/about";
import { FnStack } from "./sections/stack";
import { FnJourney } from "./sections/journey";
import { FnProjects } from "./sections/projects";
import { FnContact } from "./sections/contact";

export function Portfolio() {
  const tFooter = useTranslations("Portfolio.footer");
  const [active, setActive] = useState<Section>("home");
  const scrollP = useScrollProgress();

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-section]")
    );
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const v = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const top = v[0];
        if (top) {
          const id = top.target.getAttribute("data-section");
          if (id && (SECTIONS as readonly string[]).includes(id)) {
            setActive(id as Section);
          }
        }
      },
      { threshold: [0.3, 0.6] }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const goTo = useCallback((id: Section) => {
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
  }, []);

  return (
    <div className="fn-root">
      <div className="fn-grain" />
      <BgWaves scrollP={scrollP} />
      <InkTrail active />

      <FnNav active={active} />
      <IssueBar scrollP={scrollP} />
      <ProgressBar scrollP={scrollP} />

      <main className="fn-page">
        <FnHero />
        <FnAbout />
        <FnStack />
        <FnJourney />
        <FnProjects />
        <FnContact />
        <footer className="fn-footer">
          <Squiggle w={120} color="var(--muted)" />
          <p>© 2026 — {tFooter("made")}</p>
          <span />
        </footer>
      </main>

      <SideRail active={active} onGo={goTo} />
      <CmdPalette />
    </div>
  );
}
