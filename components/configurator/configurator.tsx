"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { PreviewStage } from "./preview-stage";
import { cn, gbp } from "@/lib/utils";
import { models } from "@/lib/data/models";
import { exteriorColours, roofs, wheels, upholstery, accessories, logoZones, configSteps } from "@/lib/data/options";
import { type BuildState, defaultBuild, decodeBuild, encodeBuild, priceBuild, buildSpecLines } from "@/lib/configurator";

const STORAGE = "eb-build";
const LOGO_KEY = "eb-logo";

/** Animated price tween. */
function usePrice(target: number) {
  const [val, setVal] = useState(target);
  const prev = useRef(target);
  useEffect(() => {
    const from = prev.current, to = target, start = performance.now(), dur = 450;
    prev.current = to;
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(from + (to - from) * e));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return val;
}

export function Configurator({ initialModel }: { initialModel?: string }) {
  const router = useRouter();
  const [build, setBuild] = useState<BuildState>(() => defaultBuild(initialModel));
  const [step, setStep] = useState(0);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.search.length > 1) setBuild(decodeBuild(window.location.search));
    setLogoUrl(localStorage.getItem(LOGO_KEY));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const qs = encodeBuild(build);
    window.history.replaceState(null, "", `?${qs}`);
    localStorage.setItem(STORAGE, qs);
  }, [build]);

  const set = useCallback(<K extends keyof BuildState>(key: K, value: BuildState[K]) => setBuild((b) => ({ ...b, [key]: value })), []);
  const toggleAccessory = (id: string) => setBuild((b) => ({ ...b, accessories: b.accessories.includes(id) ? b.accessories.filter((a) => a !== id) : [...b.accessories, id] }));

  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(null), 2600); };
  const total = priceBuild(build);
  const price = usePrice(total);

  const onLogo = (file: File | undefined) => {
    if (!file) return;
    if (!/(png|svg)/i.test(file.type) && !/\.svg$/i.test(file.name)) { flash("Please upload a PNG or SVG"); return; }
    if (file.size > 4_000_000) { flash("Please keep the file under 4MB"); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result);
      setLogoUrl(url);
      try { localStorage.setItem(LOGO_KEY, url); } catch { /* quota */ }
      setBuild((b) => ({ ...b, logoZone: b.logoZone ?? logoZones[0].id }));
    };
    reader.readAsDataURL(file);
  };

  const share = async () => {
    const url = `${window.location.origin}/configure?${encodeBuild(build)}`;
    try { await navigator.clipboard.writeText(url); flash("Build link copied"); } catch { flash(url); }
  };
  const save = () => { localStorage.setItem(STORAGE, encodeBuild(build)); flash("Build saved to this device"); };
  const reset = () => { setBuild(defaultBuild(build.model)); flash("Build reset"); };
  const requestQuote = () => router.push(`/request-a-quote?${encodeBuild(build)}`);

  const current = configSteps[step].id;
  const specLines = buildSpecLines(build);

  return (
    <div className="grid gap-6 pb-24 lg:grid-cols-[1.5fr_1fr] lg:gap-8">
      {/* Preview */}
      <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-9rem)]">
        <div className="h-[44svh] overflow-hidden rounded-lg border border-line lg:h-full">
          <PreviewStage build={build} logoUrl={logoUrl} />
        </div>
      </div>

      {/* Options */}
      <div>
        {/* Step rail */}
        <div className="flex gap-4 overflow-x-auto border-b border-line pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {configSteps.map((s, i) => (
            <button key={s.id} onClick={() => setStep(i)} className={cn("relative whitespace-nowrap py-3 text-[.78rem] font-semibold", step === i ? "text-ink" : "text-ink-2")}>
              <span className="mr-1.5 tabular-nums opacity-50">{String(i + 1).padStart(2, "0")}</span>{s.label}
              <span className={cn("absolute inset-x-0 -bottom-px h-0.5 origin-left bg-ink transition-transform", step === i ? "scale-x-100" : "scale-x-0")} />
            </button>
          ))}
        </div>

        <div key={current} className="min-h-[22rem] py-6 motion-safe:animate-[fade_.35s_ease]">
          <style>{`@keyframes fade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}`}</style>

          {current === "model" && (
            <Group title="Choose your model" kicker="Start here">
              <List items={models.filter((m) => m.basePrice > 0).map((m) => ({ id: m.slug, name: m.name, desc: m.categoryLabel, price: 0, priceLabel: `from ${gbp(m.basePrice)}` }))} selected={build.model} onSelect={(id) => set("model", id)} />
            </Group>
          )}

          {current === "colour" && (
            <Group title="Choose your colour" kicker="Exterior">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {exteriorColours.map((c) => {
                  const on = build.colour === c.id;
                  return (
                    <button key={c.id} onClick={() => set("colour", c.id)} aria-pressed={on} className={cn("flex flex-col gap-2.5 rounded-lg border p-3 text-left transition-all hover:-translate-y-0.5", on ? "border-ink shadow-[0_0_0_1px_var(--color-ink)]" : "border-line hover:border-line-2")}>
                      <span className="h-11 w-full rounded-[5px] border border-black/10" style={{ background: c.hex }} />
                      <span className="text-[.82rem] font-semibold leading-tight">{c.name}</span>
                      <span className="text-[.66rem] font-semibold uppercase tracking-wide text-ink-2">{c.finish}{c.priceDelta ? ` · +${gbp(c.priceDelta)}` : ""}</span>
                    </button>
                  );
                })}
              </div>
            </Group>
          )}

          {current === "roof" && <Group title="Roof & canopy" kicker="Overhead"><List items={roofs.map((r) => ({ id: r.id, name: r.name, desc: r.description, price: r.priceDelta, swatch: r.swatch }))} selected={build.roof} onSelect={(id) => set("roof", id)} /></Group>}
          {current === "wheels" && <Group title="Wheels" kicker="Stance"><List items={wheels.map((w) => ({ id: w.id, name: w.name, desc: w.description, price: w.priceDelta, swatch: w.rim }))} selected={build.wheels} onSelect={(id) => set("wheels", id)} /></Group>}
          {current === "upholstery" && <Group title="Interior & upholstery" kicker="Inside"><List items={upholstery.map((u) => ({ id: u.id, name: u.name, desc: u.description, price: u.priceDelta, swatch: u.seat }))} selected={build.upholstery} onSelect={(id) => set("upholstery", id)} /></Group>}

          {current === "accessories" && (
            <Group title="Accessories" kicker="Finishing touches">
              <div className="flex flex-col gap-2.5">
                {accessories.map((a) => {
                  const on = build.accessories.includes(a.id);
                  return (
                    <button key={a.id} onClick={() => toggleAccessory(a.id)} aria-pressed={on} className={cn("flex items-center gap-4 rounded-lg border p-4 text-left transition-all", on ? "border-ink shadow-[0_0_0_1px_var(--color-ink)]" : "border-line hover:border-line-2")}>
                      <span className="flex-1"><span className="block text-[.95rem] font-semibold">{a.name}</span><span className="text-[.78rem] text-ink-2">{a.description}</span></span>
                      <span className="text-[.82rem] font-semibold text-ink-2">{a.priceDelta ? `+${gbp(a.priceDelta)}` : "Included"}</span>
                      <span className={cn("grid h-5 w-5 place-items-center rounded-full border", on ? "border-ink bg-ink text-white" : "border-line-2")}>{on && <Check />}</span>
                    </button>
                  );
                })}
              </div>
            </Group>
          )}

          {current === "branding" && (
            <Group title="Your logo & branding" kicker="For your fleet">
              <p className="-mt-2 mb-4 text-[.92rem] text-ink-2">Upload a logo (PNG or SVG) and place it on the vehicle. Final artwork is confirmed at quotation.</p>
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-line-2 bg-paper px-6 py-8 text-center transition-colors hover:border-ink">
                <span className="text-[.95rem] font-semibold">{logoUrl ? "Replace logo" : "Upload your logo"}</span>
                <span className="text-[.78rem] text-ink-2">PNG or SVG · transparent · up to 4MB</span>
                <input type="file" accept="image/png,image/svg+xml,.svg,.png" className="hidden" onChange={(e) => onLogo(e.target.files?.[0])} />
              </label>

              {logoUrl && (
                <>
                  <p className="mt-6 mb-3 text-[.7rem] font-semibold uppercase tracking-[.16em] text-ink-2">Placement</p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {logoZones.map((z) => {
                      const on = build.logoZone === z.id;
                      return (
                        <button key={z.id} onClick={() => set("logoZone", z.id)} aria-pressed={on} className={cn("rounded-lg border px-4 py-3 text-left text-[.9rem] font-semibold transition-all", on ? "border-ink shadow-[0_0_0_1px_var(--color-ink)]" : "border-line hover:border-line-2")}>{z.label}</button>
                      );
                    })}
                  </div>
                  <div className="mt-6">
                    <label className="flex items-center justify-between text-[.78rem] font-semibold uppercase tracking-[.12em] text-ink-2">Logo size <span>{Math.round(build.logoScale * 100)}%</span></label>
                    <input type="range" min={0.5} max={1.5} step={0.05} value={build.logoScale} onChange={(e) => set("logoScale", Number(e.target.value))} className="mt-2 w-full accent-[var(--color-ink)]" />
                  </div>
                  <button onClick={() => { setLogoUrl(null); localStorage.removeItem(LOGO_KEY); set("logoZone", null); }} className="mt-4 text-[.78rem] font-semibold uppercase tracking-[.04em] text-ink-2 hover:text-ink">Remove logo</button>
                </>
              )}
            </Group>
          )}

          {current === "summary" && (
            <Group title="Summary" kicker="Your build">
              <div className="flex flex-col">
                {specLines.map((l) => (
                  <div key={l.label} className="flex justify-between gap-4 border-b border-line py-3 text-[.92rem]">
                    <span className="text-ink-2"><b className="block text-[.7rem] font-semibold uppercase tracking-[.12em] text-ink">{l.label}</b>{l.value}</span>
                    <span className="font-semibold">{l.price ? `+${gbp(l.price)}` : l.label === "Model" ? gbp(priceBuild({ ...build, colour: exteriorColours[0].id, roof: "open", wheels: "classic-silver", upholstery: "stone", accessories: [] })) : "—"}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-2.5">
                <button onClick={save} className="rounded-[2px] border border-line-2 px-5 py-2.5 text-[.72rem] font-semibold uppercase tracking-[.06em] hover:border-ink">Save</button>
                <button onClick={share} className="rounded-[2px] border border-line-2 px-5 py-2.5 text-[.72rem] font-semibold uppercase tracking-[.06em] hover:border-ink">Share</button>
                <button onClick={() => window.print()} className="rounded-[2px] border border-line-2 px-5 py-2.5 text-[.72rem] font-semibold uppercase tracking-[.06em] hover:border-ink">Download spec</button>
                <button onClick={reset} className="rounded-[2px] border border-line-2 px-5 py-2.5 text-[.72rem] font-semibold uppercase tracking-[.06em] hover:border-ink">Reset</button>
              </div>
            </Group>
          )}
        </div>

        {/* Back / Next */}
        <div className="flex gap-2.5 border-t border-line pt-5">
          <button onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="flex-1 rounded-[4px] border border-line-2 py-3 text-[.74rem] font-semibold uppercase tracking-[.06em] disabled:opacity-40 hover:border-ink">← Back</button>
          <button onClick={() => setStep((s) => Math.min(configSteps.length - 1, s + 1))} disabled={step === configSteps.length - 1} className="flex-1 rounded-[4px] border border-ink bg-ink py-3 text-[.74rem] font-semibold uppercase tracking-[.06em] text-white disabled:opacity-40">{step === configSteps.length - 1 ? "Done" : "Next →"}</button>
        </div>
      </div>

      {/* Sticky summary bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur-md lg:col-span-2">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-3 px-[clamp(1rem,3vw,2rem)] py-3">
          <button onClick={() => setShowBreakdown((s) => !s)} className="text-left">
            <span className="block text-[.62rem] font-semibold uppercase tracking-[.16em] text-ink-2">Indicative total</span>
            <span className="text-[1.4rem] font-bold tabular-nums">{gbp(price)} <span className="text-[.62rem] font-semibold uppercase tracking-wide text-ink-2">breakdown ▾</span></span>
          </button>
          <div className="flex items-center gap-2">
            <button onClick={save} aria-label="Save" className="grid h-10 w-10 place-items-center rounded-[6px] border border-line-2 hover:border-ink">♥</button>
            <button onClick={share} aria-label="Share" className="grid h-10 w-10 place-items-center rounded-[6px] border border-line-2 hover:border-ink">↗</button>
            <button onClick={requestQuote} className="rounded-[3px] bg-ink px-5 py-3 text-[.72rem] font-semibold uppercase tracking-[.06em] text-white">Request Quote</button>
          </div>
        </div>
        {showBreakdown && (
          <div className="mx-auto max-w-[1320px] border-t border-line px-[clamp(1rem,3vw,2rem)] py-3 text-[.85rem]">
            {specLines.map((l) => (
              <div key={l.label} className="flex justify-between py-1"><span className="text-ink-2">{l.label}: {l.value}</span><span className="font-semibold">{l.price ? `+${gbp(l.price)}` : "—"}</span></div>
            ))}
            <p className="mt-2 text-[.72rem] text-ink-2">Indicative — final price on quotation.</p>
          </div>
        )}
      </div>

      {toast && <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-5 py-2.5 text-sm text-white shadow-lg">{toast}</div>}
    </div>
  );
}

function Group({ title, kicker, children }: { title: string; kicker: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-5"><div className="text-[.66rem] font-semibold uppercase tracking-[.22em] text-ink-2">{kicker}</div><h2 className="mt-1 text-2xl">{title}</h2></div>
      {children}
    </div>
  );
}

function List({ items, selected, onSelect }: { items: { id: string; name: string; desc?: string; price: number; priceLabel?: string; swatch?: string }[]; selected: string; onSelect: (id: string) => void }) {
  return (
    <div className="flex flex-col gap-2.5">
      {items.map((it) => {
        const on = selected === it.id;
        return (
          <button key={it.id} onClick={() => onSelect(it.id)} aria-pressed={on} className={cn("flex items-center gap-4 rounded-lg border p-4 text-left transition-all", on ? "border-ink shadow-[0_0_0_1px_var(--color-ink)]" : "border-line hover:border-line-2")}>
            {it.swatch && <span className="h-10 w-10 flex-none rounded-[7px] border border-black/10" style={{ background: it.swatch }} />}
            <span className="flex-1"><span className="block text-[.95rem] font-semibold">{it.name}</span>{it.desc && <span className="text-[.78rem] text-ink-2">{it.desc}</span>}</span>
            <span className="text-[.82rem] font-semibold text-ink-2">{it.priceLabel ?? (it.price ? `+${gbp(it.price)}` : "Included")}</span>
            <span className={cn("grid h-5 w-5 place-items-center rounded-full border", on ? "border-ink bg-ink text-white" : "border-line-2")}>{on && <Check />}</span>
          </button>
        );
      })}
    </div>
  );
}

function Check() {
  return <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none"><path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2.5" /></svg>;
}
