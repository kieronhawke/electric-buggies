"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * One understated, staggered reveal per section on scroll (brief §2).
 * Honours prefers-reduced-motion automatically.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section";
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];
  // `initial` must render identically on the server and on the first client
  // paint, otherwise reduced-motion users hit a hydration mismatch (the media
  // query is unknown during SSR). So we keep the same initial state for
  // everyone and instead collapse the transition to an instant snap when the
  // user prefers reduced motion: no perceived movement, no flash of hidden
  // content, no mismatch.
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-72px" }}
      transition={reduce ? { duration: 0 } : { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionTag>
  );
}

/** Container that staggers its Reveal children. */
export function RevealGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
