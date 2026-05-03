"use client";
import { useEffect, useRef, useState } from "react";

export function useMouse() {
  const [pos, setPos] = useState({ x: 0, y: 0, in: false });
  useEffect(() => {
    const onMove = (e: MouseEvent) =>
      setPos({ x: e.clientX, y: e.clientY, in: true });
    const onLeave = () => setPos((p) => ({ ...p, in: false }));
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);
  return pos;
}

export function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const sh =
        document.documentElement.scrollHeight - window.innerHeight;
      setP(sh > 0 ? window.scrollY / sh : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return p;
}

export function useIsMac(): boolean {
  const [isMac, setIsMac] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const nav = window.navigator;
    const ua = nav.userAgent || "";
    const platform =
      (nav as Navigator & { userAgentData?: { platform?: string } })
        .userAgentData?.platform || nav.platform || "";
    setIsMac(/mac|iphone|ipad|ipod/i.test(platform) || /Mac OS X/i.test(ua));
  }, []);
  return isMac;
}

export function useInView<T extends Element>(
  options: IntersectionObserverInit = {}
) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { threshold: 0.2, ...options }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, inView] as const;
}
