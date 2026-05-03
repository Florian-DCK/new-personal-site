"use client";
import React from "react";

export function Squiggle({
  w = 60,
  color = "currentColor",
  strokeWidth = 1.5,
}: {
  w?: number;
  color?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      width={w}
      height={8}
      viewBox="0 0 60 8"
      fill="none"
      style={{ display: "block" }}
      aria-hidden
    >
      <path
        d="M1 4 Q 6 0, 11 4 T 21 4 T 31 4 T 41 4 T 51 4 T 59 4"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function Arrow({
  size = 24,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 12 Q 12 8, 20 12 M 14 7 L 20 12 L 14 17"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function Marquee({
  children,
  reverse,
}: {
  children: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <div className={`fn-marquee ${reverse ? "is-rev" : ""}`}>
      <div className="fn-marquee-track">
        <div className="fn-marquee-set">{children}</div>
        <div className="fn-marquee-set">{children}</div>
        <div className="fn-marquee-set">{children}</div>
      </div>
    </div>
  );
}

export function SectionHead({
  num,
  cat,
  kicker,
}: {
  num: string;
  cat: string;
  kicker: string;
}) {
  return (
    <header className="fn-sec-head">
      <span className="fn-sec-num">{num}</span>
      <span className="fn-sec-cat">{cat.toUpperCase()}</span>
      <span className="fn-sec-kicker">— {kicker}</span>
      <span className="fn-sec-line" />
    </header>
  );
}
