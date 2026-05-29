"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Animated counter. The TRUE final value is what renders on the server / at
 * rest / with no JS (fixes the "0%" bug). Only once it scrolls into view (and
 * motion is allowed) does it briefly count up from 0 → value. Initial state
 * equals `to` so there's no hydration mismatch and no flash of 0.
 */
export function Counter({ to, suffix = "", duration = 1100 }: { to: number; suffix?: string; duration?: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(to); // correct value by default
  const animated = useRef(false);

  useEffect(() => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || animated.current) return;
        animated.current = true;
        io.disconnect();
        const start = performance.now();
        let raf = 0;
        const step = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(Math.round(to * eased));
          if (p < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
        return () => cancelAnimationFrame(raf);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration, reduce]);

  return <span ref={ref}>{val}{suffix}</span>;
}
