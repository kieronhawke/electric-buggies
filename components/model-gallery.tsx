"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import { VehicleRender } from "./vehicle-render";

interface View { colour: string; roof: string; label: string }

/**
 * Model gallery with a zoom lightbox (keyboard accessible: ←/→/Esc, focus trap
 * via the dialog). Renders recolour views today; pass real image URLs later and
 * swap the tile/lightbox body, same interaction shell.
 */
export function ModelGallery({ plate, seats, name }: { plate: string; seats: number; name: string }) {
  const views: View[] = [
    { colour: plate, roof: "hardtop", label: `${name}, front three-quarter` },
    { colour: "#27364f", roof: "open", label: `${name}, open canopy` },
    { colour: "#5a2733", roof: "canopy", label: `${name}, touring canopy` },
    { colour: "#3f454b", roof: "hardtop", label: `${name}, enclosed` },
  ];
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const go = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + views.length) % views.length)), [views.length]);

  useEffect(() => {
    if (open === null) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, close, go]);

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        {views.map((v, i) => (
          <button
            key={i}
            onClick={() => setOpen(i)}
            aria-label={`Enlarge: ${v.label}`}
            className="group relative flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-paper transition-colors hover:bg-paper-2"
          >
            <VehicleRender colour={v.colour} roof={v.roof} seats={seats} className="max-h-[72%] transition-transform duration-300 group-hover:scale-105" title={v.label} />
            <span className="absolute bottom-2 right-2 rounded-full bg-white/80 px-2 py-1 text-[.66rem] font-semibold uppercase tracking-[.12em] text-ink-2 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">Zoom</span>
          </button>
        ))}
      </div>
      <p className="mt-3 text-xs text-ink-2">Renders shown, tap to zoom. Photography is added per model via the CMS.</p>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            role="dialog" aria-modal="true" aria-label={`${name} gallery`}
            className="fixed inset-0 z-[130] flex flex-col bg-ink/95 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={close}
          >
            <div className="flex items-center justify-between p-5 text-white">
              <span className="text-[.72rem] uppercase tracking-[.16em] text-white/70">{views[open].label}</span>
              <button onClick={close} aria-label="Close" className="text-2xl leading-none hover:text-white/70">✕</button>
            </div>
            <div className="flex flex-1 items-center justify-between px-2 sm:px-6" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => go(-1)} aria-label="Previous" className="p-4 text-3xl text-white/70 hover:text-white">‹</button>
              <VehicleRender colour={views[open].colour} roof={views[open].roof} seats={seats} className="max-h-[70vh] w-full max-w-3xl" title={views[open].label} />
              <button onClick={() => go(1)} aria-label="Next" className="p-4 text-3xl text-white/70 hover:text-white">›</button>
            </div>
            <div className="flex justify-center gap-2 p-5" onClick={(e) => e.stopPropagation()}>
              {views.map((v, i) => (
                <button key={i} onClick={() => setOpen(i)} aria-label={v.label} className={`h-2 w-2 rounded-full ${i === open ? "bg-white" : "bg-white/40"}`} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
