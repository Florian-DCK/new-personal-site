"use client";
import { useEffect, useId, useRef, useState } from "react";

type Pt = { x: number; y: number; t: number };
type Mode = "default" | "grab" | "point";
type BgRect = {
  x: number; y: number; w: number; h: number;
  tl: number; tr: number; br: number; bl: number;
};
type TrailSegment = {
  sx: number; sy: number; // start
  cx: number; cy: number; // quadratic control
  ex: number; ey: number; // end
  opacity: number; width: number;
};

const TRAIL_LIFE = 700;

const GRAB_SELECTOR = ".fn-drag, [data-interactive]";
const CLICK_SELECTOR =
  'a, button, [role="button"], input[type="submit"], [data-cursor="click"]';

const HAND_D =
  "M18 11V6a2 2 0 0 0-4 0M14 10V4a2 2 0 0 0-4 0v2M10 10.5V6a2 2 0 0 0-4 0v8M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15";
const GRAB_D =
  "M18 11.5V9a2 2 0 0 0-4 0v1.4M14 10V8a2 2 0 0 0-4 0v2M10 9.9V9a2 2 0 0 0-4 0v5M6 14a2 2 0 0 0-4 0M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-4a8 8 0 0 1-8-8 2 2 0 1 1 4 0";
const POINT_D =
  "M22 14a8 8 0 0 1-8 8M18 11v-1a2 2 0 0 0-4 0M14 10V9a2 2 0 0 0-4 0v1M10 9.5V4a2 2 0 0 0-4 0v10M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15";

function parseRgb(s: string): [number, number, number, number] | null {
  const m = s.match(
    /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/
  );
  if (!m) return null;
  return [
    parseInt(m[1], 10),
    parseInt(m[2], 10),
    parseInt(m[3], 10),
    m[4] ? parseFloat(m[4]) : 1,
  ];
}

function rgbsEqual(
  a: [number, number, number, number],
  b: [number, number, number, number]
) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] > 0.5 && b[3] > 0.5;
}

function getAccentRgb(): [number, number, number, number] | null {
  if (typeof window === "undefined") return null;
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue("--accent")
    .trim();
  if (!v) return null;
  if (v.startsWith("#")) {
    const hex = v.replace("#", "");
    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16),
      1,
    ];
  }
  return parseRgb(v);
}

function parseRadius(v: string, w: number, h: number): number {
  const first = (v || "0").trim().split(/\s+/)[0] || "0";
  const num = parseFloat(first) || 0;
  if (first.endsWith("%")) return (Math.min(w, h) * num) / 100;
  return num;
}

function rectPath(
  x: number,
  y: number,
  w: number,
  h: number,
  tl: number,
  tr: number,
  br: number,
  bl: number
): string {
  const max = Math.min(w, h) / 2;
  tl = Math.min(Math.max(0, tl), max);
  tr = Math.min(Math.max(0, tr), max);
  br = Math.min(Math.max(0, br), max);
  bl = Math.min(Math.max(0, bl), max);
  return (
    `M${x + tl},${y} L${x + w - tr},${y} ` +
    `A${tr},${tr} 0 0 1 ${x + w},${y + tr} ` +
    `L${x + w},${y + h - br} ` +
    `A${br},${br} 0 0 1 ${x + w - br},${y + h} ` +
    `L${x + bl},${y + h} ` +
    `A${bl},${bl} 0 0 1 ${x},${y + h - bl} ` +
    `L${x},${y + tl} ` +
    `A${tl},${tl} 0 0 1 ${x + tl},${y} Z`
  );
}

export function InkTrail({
  active = true,
}: {
  active?: boolean;
}) {
  const idRaw = useId();
  const maskId = `fnmask-${idRaw.replace(/[^a-zA-Z0-9]/g, "")}`;

  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState<Pt[]>([]);
  const [mode, setMode] = useState<Mode>("default");
  const [pressed, setPressed] = useState(false);
  const [vp, setVp] = useState({ w: 0, h: 0 });
  const [bgs, setBgs] = useState<BgRect[]>([]);

  const bgElsRef = useRef<HTMLElement[]>([]);
  const targetRef = useRef({ x: -100, y: -100 });
  const inRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const scanRafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;
    const update = () =>
      setVp({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const scan = () => {
      const accent = getAccentRgb();
      if (!accent) return;
      const all = Array.from(document.querySelectorAll<HTMLElement>("body *"));
      const newBgs: HTMLElement[] = [];
      for (const el of all) {
        if (el.closest(".fn-ink-trail")) continue;
        const cs = getComputedStyle(el);
        const bg = parseRgb(cs.backgroundColor);
        if (bg && rgbsEqual(bg, accent)) newBgs.push(el);
      }
      bgElsRef.current = newBgs;
    };
    const queue = () => {
      if (scanRafRef.current != null) return;
      scanRafRef.current = requestAnimationFrame(() => {
        scanRafRef.current = null;
        scan();
      });
    };
    scan();
    window.addEventListener("resize", queue);
    const mo = new MutationObserver(queue);
    mo.observe(document.body, { subtree: true, childList: true });
    return () => {
      window.removeEventListener("resize", queue);
      mo.disconnect();
      if (scanRafRef.current) cancelAnimationFrame(scanRafRef.current);
    };
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const onMove = (e: PointerEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      inRef.current = true;
      const el = e.target as Element | null;
      if (el?.closest?.(CLICK_SELECTOR)) setMode("point");
      else if (el?.closest?.(GRAB_SELECTOR)) setMode("grab");
      else setMode("default");
    };
    const onLeave = () => {
      inRef.current = false;
      setMode("default");
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const tick = () => {
      const t = targetRef.current;
      setPos((p) => (p.x === t.x && p.y === t.y ? p : { x: t.x, y: t.y }));
      setTrail((tr) => {
        const last = tr[tr.length - 1];
        if (last && last.x === t.x && last.y === t.y) return tr;
        return [...tr, { x: t.x, y: t.y, t: Date.now() }].slice(-26);
      });

      const newBgs: BgRect[] = [];
      for (const el of bgElsRef.current) {
        const r = el.getBoundingClientRect();
        if (r.width <= 0 || r.height <= 0) continue;
        const cs = getComputedStyle(el);
        newBgs.push({
          x: r.left,
          y: r.top,
          w: r.width,
          h: r.height,
          tl: parseRadius(cs.borderTopLeftRadius, r.width, r.height),
          tr: parseRadius(cs.borderTopRightRadius, r.width, r.height),
          br: parseRadius(cs.borderBottomRightRadius, r.width, r.height),
          bl: parseRadius(cs.borderBottomLeftRadius, r.width, r.height),
        });
      }
      setBgs(newBgs);

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active]);

  useEffect(() => {
    const i = setInterval(
      () => setTrail((tr) => tr.filter((p) => Date.now() - p.t < TRAIL_LIFE)),
      80
    );
    return () => clearInterval(i);
  }, []);

  if (!active) return null;

  const now = Date.now();
  const segments: TrailSegment[] = [];
  for (let i = 1; i < trail.length; i++) {
    const p0 = trail[i - 1];
    const p1 = trail[i];
    const p2 = trail[i + 1];
    const age = now - p1.t;
    if (age >= TRAIL_LIFE) continue;
    const tNorm = 1 - age / TRAIL_LIFE;
    const eased = tNorm * tNorm;
    const opacity = 0.55 * eased;
    if (opacity < 0.015) continue;
    const width = 0.6 + 1.4 * tNorm;
    const sx = i === 1 ? p0.x : (p0.x + p1.x) / 2;
    const sy = i === 1 ? p0.y : (p0.y + p1.y) / 2;
    const ex = !p2 ? p1.x : (p1.x + p2.x) / 2;
    const ey = !p2 ? p1.y : (p1.y + p2.y) / 2;
    segments.push({ sx, sy, cx: p1.x, cy: p1.y, ex, ey, opacity, width });
  }

  return (
    <svg className="fn-ink-trail" aria-hidden>
      <defs>
        <mask
          id={maskId}
          maskUnits="userSpaceOnUse"
          x={0}
          y={0}
          width={vp.w}
          height={vp.h}
        >
          <rect x={0} y={0} width={vp.w} height={vp.h} fill="black" />
          {bgs.map((b, i) => (
            <path
              key={`bg-${i}`}
              d={rectPath(b.x, b.y, b.w, b.h, b.tl, b.tr, b.br, b.bl)}
              fill="white"
            />
          ))}
        </mask>
      </defs>

      <CursorLayer
        pos={pos}
        mode={mode}
        pressed={pressed}
        segments={segments}
        color="var(--accent)"
      />
      <g mask={`url(#${maskId})`}>
        <CursorLayer
          pos={pos}
          mode={mode}
          pressed={pressed}
          segments={segments}
          color="var(--bg)"
        />
      </g>
    </svg>
  );
}

function CursorLayer({
  pos,
  mode,
  pressed,
  segments,
  color,
}: {
  pos: { x: number; y: number };
  mode: Mode;
  pressed: boolean;
  segments: TrailSegment[];
  color: string;
}) {
  const dotV = mode === "default";
  const handV = mode === "grab" && !pressed;
  const fistV = mode === "grab" && pressed;
  const pointV = mode === "point";

  const ICON_PX = 28;
  const scale = ICON_PX / 24;
  const half = ICON_PX / 2;
  const handTransform = `translate(${pos.x - half} ${pos.y - half}) scale(${scale})`;
  const tipX = 8 * scale;
  const tipY = 4 * scale;
  const pointTransform = `translate(${pos.x - tipX} ${pos.y - tipY}) scale(${scale})`;

  const fade = { transition: "opacity 0.18s ease" };

  return (
    <g>
      {segments.map((s, i) => (
        <path
          key={i}
          d={`M ${s.sx} ${s.sy} Q ${s.cx} ${s.cy} ${s.ex} ${s.ey}`}
          fill="none"
          stroke={color}
          strokeWidth={s.width}
          strokeLinecap="butt"
          opacity={s.opacity}
        />
      ))}
      <circle
        cx={pos.x}
        cy={pos.y}
        r={dotV ? 6 : 0}
        fill={color}
        opacity={dotV ? 0.85 : 0}
        style={{ transition: "r 0.18s ease, opacity 0.18s ease" }}
      />
      <g transform={handTransform} opacity={handV ? 1 : 0} style={fade}>
        <path
          d={HAND_D}
          fill="none"
          stroke={color}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <g transform={handTransform} opacity={fistV ? 1 : 0} style={fade}>
        <path
          d={GRAB_D}
          fill="none"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <g transform={pointTransform} opacity={pointV ? 1 : 0} style={fade}>
        <path
          d={POINT_D}
          fill="none"
          stroke={color}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </g>
  );
}

export function BgWaves({ scrollP }: { scrollP: number }) {
  return (
    <div
      className="fn-waves"
      aria-hidden
      style={{ transform: `translateY(${-scrollP * 60}px)` }}
    >
      <svg viewBox="0 0 1400 600" preserveAspectRatio="xMidYMax slice">
        <defs>
          <pattern
            id="fn-seig"
            x="0"
            y="0"
            width="60"
            height="30"
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx="30"
              cy="30"
              r="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.7"
              opacity="0.55"
            />
            <circle
              cx="0"
              cy="30"
              r="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.7"
              opacity="0.55"
            />
            <circle
              cx="60"
              cy="30"
              r="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.7"
              opacity="0.55"
            />
          </pattern>
        </defs>
        <rect x="0" y="380" width="1400" height="220" fill="url(#fn-seig)" />
      </svg>
    </div>
  );
}
