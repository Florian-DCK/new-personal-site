"use client";
import React, { useEffect, useRef, useState, CSSProperties } from "react";

type Pos = { x: number; y: number };

export function Draggable({
  children,
  init = { x: 0, y: 0 },
  rotate = 0,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  init?: Pos;
  rotate?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const [pos, setPos] = useState<Pos>(init);
  const dragRef = useRef<{ ox: number; oy: number; lastX: number } | null>(
    null
  );
  const [dragging, setDragging] = useState(false);
  const [tilt, setTilt] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("[data-no-drag]")) return;
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    dragRef.current = {
      ox: e.clientX - r.left,
      oy: e.clientY - r.top,
      lastX: e.clientX,
    };
    setDragging(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    e.preventDefault();
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: PointerEvent) => {
      const d = dragRef.current;
      const parent = ref.current?.parentElement;
      if (!d || !parent) return;
      const pr = parent.getBoundingClientRect();
      const vx = e.clientX - d.lastX;
      d.lastX = e.clientX;
      setTilt(Math.max(-10, Math.min(10, vx * 0.4)));
      setPos({
        x: e.clientX - pr.left - d.ox,
        y: e.clientY - pr.top - d.oy,
      });
    };
    const onUp = () => {
      setDragging(false);
      setTilt(0);
      dragRef.current = null;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [dragging]);

  return (
    <div
      ref={ref}
      className={`fn-drag ${dragging ? "is-dragging" : ""} ${className}`}
      style={{
        ...style,
        left: pos.x,
        top: pos.y,
        transform: `rotate(${rotate + tilt}deg)`,
        cursor: dragging ? "grabbing" : "grab",
        zIndex: dragging ? 100 : 1,
      }}
      onPointerDown={onPointerDown}
      onDoubleClick={() => setPos(init)}
    >
      {children}
    </div>
  );
}
