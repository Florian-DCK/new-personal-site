"use client";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useInView } from "../hooks";
import { SectionHead } from "../atoms";

type Item = { name: string; desc: string };

function ParticleMini({ active }: { active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const W = (c.width = c.offsetWidth);
    const H = (c.height = c.offsetHeight);
    const N = 40;
    const pts = Array.from({ length: N }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
    }));
    let raf = 0;
    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      const speed = active ? 1.6 : 0.5;
      for (const p of pts) {
        p.x += p.vx * speed;
        p.y += p.vy * speed;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      }
      const inkColor =
        getComputedStyle(c).getPropertyValue("--ink") || "#000";
      const accentColor =
        getComputedStyle(c).getPropertyValue("--accent") || "#ee5b3a";
      ctx.strokeStyle = inkColor.trim();
      ctx.lineWidth = 0.4;
      for (let i = 0; i < N; i++)
        for (let j = i + 1; j < N; j++) {
          const a = pts[i],
            b = pts[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 60) {
            ctx.globalAlpha = 1 - d / 60;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      ctx.globalAlpha = 1;
      ctx.fillStyle = accentColor.trim();
      pts.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);
  return (
    <canvas
      ref={ref}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}

function TypeMorphMini({ active }: { active: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        fontFamily: "var(--font-fraunces), 'Fraunces', serif",
        fontSize: 64,
        fontStyle: "italic",
        color: "var(--ink)",
      }}
    >
      {"morph".split("").map((c, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            transition: "transform 0.5s cubic-bezier(.5,0,.2,1)",
            transform: active
              ? `translateY(${Math.sin(i) * 16}px) rotate(${(i - 2) * 8}deg) scale(${1 + (i % 2) * 0.2})`
              : "none",
            color: i === 2 ? "var(--accent)" : "var(--ink)",
          }}
        >
          {c}
        </span>
      ))}
    </div>
  );
}

function GravityMini({ active }: { active: boolean }) {
  const [balls, setBalls] = useState(() =>
    Array.from({ length: 7 }, (_, i) => ({ x: 30 + i * 28, y: 20, vy: 0 }))
  );
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const tick = () => {
      setBalls((bs) =>
        bs.map((b) => {
          let y = b.y + b.vy;
          let vy = b.vy + 0.4;
          if (y > 130) {
            y = 130;
            vy = -vy * 0.7;
          }
          return { ...b, y, vy };
        })
      );
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);
  return (
    <svg viewBox="0 0 240 150" style={{ width: "100%", height: "100%" }}>
      <line x1="0" y1="140" x2="240" y2="140" stroke="var(--ink)" strokeWidth="1" />
      {balls.map((b, i) => (
        <circle key={i} cx={b.x} cy={b.y} r="7" fill="var(--accent)" />
      ))}
    </svg>
  );
}

function AudioMini({ active }: { active: boolean }) {
  const [bars, setBars] = useState(() => Array.from({ length: 16 }, () => 0.2));
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      setBars((b) =>
        b.map((_, i) => {
          const base = active
            ? 0.5 + Math.sin(Date.now() / 200 + i) * 0.4
            : 0.15;
          return Math.max(0.1, base + (Math.random() - 0.5) * 0.2);
        })
      );
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-around",
        height: "100%",
        padding: "0 14px 14px",
      }}
    >
      {bars.map((h, i) => (
        <div
          key={i}
          style={{
            width: 6,
            height: `${h * 100}%`,
            background: "var(--accent)",
            borderRadius: 2,
            transition: "height 0.1s",
          }}
        />
      ))}
    </div>
  );
}

function PgTile({ item, index }: { item: Item; index: number }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      className="fn-pg-tile"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="fn-pg-canvas">
        {index === 0 && <ParticleMini active={hover} />}
        {index === 1 && <TypeMorphMini active={hover} />}
        {index === 2 && <GravityMini active={hover} />}
        {index === 3 && <AudioMini active={hover} />}
      </div>
      <div className="fn-pg-meta">
        <span className="fn-pg-tag">EXP·0{index + 1}</span>
        <h4>{item.name}</h4>
        <p>{item.desc}</p>
      </div>
    </div>
  );
}

export function FnPlayground() {
  const t = useTranslations("Portfolio.playground");
  const [ref, inView] = useInView<HTMLElement>();
  const items = t.raw("items") as Item[];
  return (
    <section
      ref={ref}
      data-section="playground"
      className={`fn-pg ${inView ? "is-in" : ""}`}
    >
      <SectionHead num="№06" cat={t("title")} kicker={t("kicker")} />
      <h2 className="fn-mega">
        {t("mega1")}
        <span className="fn-italic fn-accent"> {t("mega2")}</span>
      </h2>
      <p className="fn-sub">{t("sub")}</p>
      <div className="fn-pg-grid">
        {items.map((it, i) => (
          <PgTile key={it.name} item={it} index={i} />
        ))}
      </div>
    </section>
  );
}
