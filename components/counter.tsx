/**
 * Stat value. Renders the TRUE value at all times (server, client, no-JS) so
 * it can never flash "0%". (A count-from-0 animation is incompatible with
 * "show the true value at rest"; the section's scroll-reveal provides motion.)
 * Kept as a component so call sites and the `duration` prop stay stable.
 */
export function Counter({ to, suffix = "" }: { to: number; suffix?: string; duration?: number }) {
  return <span>{to}{suffix}</span>;
}
