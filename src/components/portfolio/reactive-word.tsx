"use client";
import { motion, useAnimationControls } from "motion/react";
import { useEffect, useRef, useState } from "react";

function useCenter(ref: React.RefObject<HTMLElement | null>) {
  const [c, setC] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      setC({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    if (el.parentElement) ro.observe(el.parentElement);
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
      cancelAnimationFrame(raf);
    };
  }, [ref]);
  return c;
}

function ReactiveLetter({
  char,
  mouseX,
  mouseY,
}: {
  char: string;
  mouseX: number;
  mouseY: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const center = useCenter(ref);
  const [dragging, setDragging] = useState(false);
  const controls = useAnimationControls();

  let mx = 0;
  let my = 0;
  let rot = 0;
  if (!dragging && center.x) {
    const dx = mouseX - center.x;
    const dy = mouseY - center.y;
    const dist = Math.hypot(dx, dy);
    const maxDist = 140;
    if (dist < maxDist) {
      const force = (1 - dist / maxDist) * 0.4;
      mx = dx * force;
      my = dy * force;
      rot = (dx / maxDist) * 10;
    }
  }

  return (
    <motion.span
      ref={ref}
      className="fn-react-letter-outer"
      animate={{ x: mx, y: my, rotate: rot }}
      transition={{ type: "spring", stiffness: 220, damping: 18, mass: 0.6 }}
      style={{ display: "inline-block" }}
    >
      <motion.span
        className="fn-react-letter-inner"
        drag
        dragMomentum={false}
        dragElastic={0.5}
        dragSnapToOrigin
        whileTap={{ scale: 0.9 }}
        onDragStart={() => setDragging(true)}
        onDragEnd={() => setDragging(false)}
        onTap={() => {
          controls.start({
            scale: [1, 1.28, 1],
            transition: { duration: 0.32, ease: "easeOut" },
          });
        }}
        animate={controls}
        data-interactive
        style={{ display: "inline-block", cursor: "grab" }}
      >
        {char === " " ? " " : char}
      </motion.span>
    </motion.span>
  );
}

export function ReactiveWord({ word }: { word: string }) {
  const [m, setM] = useState({ x: -10000, y: -10000 });
  useEffect(() => {
    const onMove = (e: PointerEvent) =>
      setM({ x: e.clientX, y: e.clientY });
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return (
    <span className="fn-react-word">
      {word.split("").map((c, i) => (
        <ReactiveLetter key={i} char={c} mouseX={m.x} mouseY={m.y} />
      ))}
    </span>
  );
}
