"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PreviewStage } from "./preview-stage";
import { Button, Arrow } from "@/components/ui/button";
import { cn, gbp } from "@/lib/utils";
import { models } from "@/lib/data/models";
import {
  exteriorColours,
  roofs,
  wheels,
  upholstery,
  accessories,
  configSteps,
} from "@/lib/data/options";
import {
  type BuildState,
  defaultBuild,
  decodeBuild,
  encodeBuild,
  priceBuild,
  buildSpecLines,
} from "@/lib/configurator";

const STORAGE_KEY = "mayfair-build";

export function Configurator({ initialModel }: { initialModel?: string }) {
  const router = useRouter();
  const [build, setBuild] = useState<BuildState>(() => defaultBuild(initialModel));
  const [step, setStep] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  // Hydrate from URL (shareable) on mount; URL wins over the default.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.search.length > 1) {
      setBuild(decodeBuild(window.location.search));
    }
  }, []);

  // Persist build → URL + localStorage on every change (brief §6).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const qs = encodeBuild(build);
    window.history.replaceState(null, "", `?${qs}`);
    localStorage.setItem(STORAGE_KEY, qs);
  }, [build]);

  const set = useCallback(
    <K extends keyof BuildState>(key: K, value: BuildState[K]) =>
      setBuild((b) => ({ ...b, [key]: value })),
    [],
  );

  const toggleAccessory = (id: string) =>
    setBuild((b) => ({
      ...b,
      accessories: b.accessories.includes(id)
        ? b.accessories.filter((a) => a !== id)
        : [...b.accessories, id],
    }));

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2600);
  };

  const share = async () => {
    const url = `${window.location.origin}/configure?${encodeBuild(build)}`;
    try {
      await navigator.clipboard.writeText(url);
      flash("Build link copied to clipboard");
    } catch {
      flash(url);
    }
  };

  const save = () => {
    localStorage.setItem(STORAGE_KEY, encodeBuild(build));
    flash("Build saved to this device");
  };

  // Download spec → print-to-PDF of a branded sheet (dependency-free).
  // NOTE: a richer branded PDF (jsPDF/react-pdf) is a clean Phase 5 upgrade.
  const downloadSpec = () => window.print();

  const requestQuote = () =>
    router.push(`/request-a-quote?${encodeBuild(build)}`);

  const total = priceBuild(build);
  const specLines = buildSpecLines(build);
  const currentStep = configSteps[step].id;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:gap-8">
      {/* Live preview */}
      <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
        <div className="aspect-[4/3] lg:h-[60%] lg:aspect-auto">
          <PreviewStage build={build} />
        </div>
        {/* Printable spec sheet (hidden on screen, shown when printing) */}
        <PrintSheet build={build} total={total} />
      </div>

      {/* Options panel */}
      <div>
        {/* Step tabs */}
        <div className="flex flex-wrap gap-1.5 border-b border-hairline pb-4">
          {configSteps.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setStep(i)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-[0.68rem] font-medium uppercase tracking-[0.12em] transition-colors",
                step === i
                  ? "bg-ink text-paper"
                  : "text-ink-soft hover:bg-paper-2 hover:text-ink",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="min-h-[20rem] py-6">
          {currentStep === "model" && (
            <OptionList
              title="Choose your model"
              items={models.filter((m) => m.basePrice > 0).map((m) => ({
                id: m.slug,
                name: m.name,
                meta: m.categoryLabel,
                priceLabel: `from ${gbp(m.basePrice)}`,
              }))}
              selected={build.model}
              onSelect={(id) => set("model", id)}
            />
          )}

          {currentStep === "colour" && (
            <ColourGrid
              selected={build.colour}
              onSelect={(id) => set("colour", id)}
            />
          )}

          {currentStep === "roof" && (
            <OptionList
              title="Roof & canopy"
              items={roofs.map((r) => ({
                id: r.id,
                name: r.name,
                meta: r.description,
                priceLabel: deltaLabel(r.priceDelta),
              }))}
              selected={build.roof}
              onSelect={(id) => set("roof", id)}
            />
          )}

          {currentStep === "wheels" && (
            <OptionList
              title="Wheels"
              items={wheels.map((w) => ({
                id: w.id,
                name: w.name,
                meta: w.description,
                priceLabel: deltaLabel(w.priceDelta),
              }))}
              selected={build.wheels}
              onSelect={(id) => set("wheels", id)}
            />
          )}

          {currentStep === "upholstery" && (
            <OptionList
              title="Seats & upholstery"
              items={upholstery.map((u) => ({
                id: u.id,
                name: u.name,
                meta: u.description,
                priceLabel: deltaLabel(u.priceDelta),
              }))}
              selected={build.upholstery}
              onSelect={(id) => set("upholstery", id)}
            />
          )}

          {currentStep === "accessories" && (
            <div>
              <h3 className="font-display text-2xl text-ink">Accessories</h3>
              <p className="mt-1 text-sm text-ink-soft">Select any that apply.</p>
              <ul className="mt-5 space-y-2">
                {accessories.map((a) => {
                  const on = build.accessories.includes(a.id);
                  return (
                    <li key={a.id}>
                      <button
                        onClick={() => toggleAccessory(a.id)}
                        aria-pressed={on}
                        className={cn(
                          "flex w-full items-center justify-between rounded-lg border px-5 py-4 text-left transition-all",
                          on
                            ? "border-champagne bg-champagne/5"
                            : "border-hairline hover:border-ink",
                        )}
                      >
                        <span className="flex items-center gap-3">
                          <span
                            className={cn(
                              "flex h-5 w-5 items-center justify-center rounded border",
                              on ? "border-champagne bg-champagne text-white" : "border-hairline",
                            )}
                          >
                            {on && (
                              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none">
                                <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2.5" />
                              </svg>
                            )}
                          </span>
                          <span className="text-ink">{a.name}</span>
                        </span>
                        <span className="text-sm text-ink-soft">{deltaLabel(a.priceDelta)}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {currentStep === "summary" && (
            <div>
              <h3 className="font-display text-2xl text-ink">Your build</h3>
              <dl className="mt-5 divide-y divide-hairline">
                {specLines.map((line) => (
                  <div key={line.label} className="flex justify-between gap-4 py-3">
                    <dt className="text-sm uppercase tracking-[0.1em] text-ink-soft">
                      {line.label}
                    </dt>
                    <dd className="text-right text-ink">{line.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button onClick={save} variant="outline">Save</Button>
                <Button onClick={share} variant="outline">Share</Button>
                <Button onClick={downloadSpec} variant="outline">Download spec</Button>
              </div>
            </div>
          )}
        </div>

        {/* Step nav */}
        <div className="flex justify-between border-t border-hairline pt-5">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="text-sm uppercase tracking-[0.14em] text-ink-soft hover:text-ink disabled:opacity-40"
          >
            Back
          </button>
          {step < configSteps.length - 1 ? (
            <button
              onClick={() => setStep((s) => Math.min(configSteps.length - 1, s + 1))}
              className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.14em] text-champagne-deep hover:text-ink"
            >
              Next <Arrow className="h-3.5 w-3.5" />
            </button>
          ) : (
            <span className="text-sm uppercase tracking-[0.14em] text-ink-soft">Complete</span>
          )}
        </div>
      </div>

      {/* Sticky summary bar (brief §6) */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-white/95 backdrop-blur-md lg:col-span-2">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3.5 md:px-10">
          <div>
            <span className="eyebrow block">Indicative — final price on quotation</span>
            <span className="font-display text-2xl text-ink">{gbp(total)}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={share}
              className="hidden rounded-full border border-hairline px-4 py-2.5 text-xs uppercase tracking-[0.12em] text-ink-soft hover:border-ink hover:text-ink sm:inline-flex"
            >
              Share
            </button>
            <Button onClick={requestQuote}>
              Request Quote <Arrow />
            </Button>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-5 py-2.5 text-sm text-paper shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

function deltaLabel(delta: number) {
  if (delta === 0) return "Included";
  return `${delta > 0 ? "+" : "−"}${gbp(Math.abs(delta))}`;
}

function OptionList({
  title,
  items,
  selected,
  onSelect,
}: {
  title: string;
  items: { id: string; name: string; meta?: string; priceLabel: string }[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div>
      <h3 className="font-display text-2xl text-ink">{title}</h3>
      <ul className="mt-5 space-y-2">
        {items.map((item) => {
          const on = selected === item.id;
          return (
            <li key={item.id}>
              <button
                onClick={() => onSelect(item.id)}
                aria-pressed={on}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg border px-5 py-4 text-left transition-all",
                  on ? "border-champagne bg-champagne/5" : "border-hairline hover:border-ink",
                )}
              >
                <span>
                  <span className="block text-ink">{item.name}</span>
                  {item.meta && <span className="block text-xs text-ink-soft">{item.meta}</span>}
                </span>
                <span className="text-sm text-ink-soft">{item.priceLabel}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ColourGrid({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (id: string) => void;
}) {
  const groups = [...new Set(exteriorColours.map((c) => c.group))];
  return (
    <div>
      <h3 className="font-display text-2xl text-ink">Exterior colour</h3>
      <div className="mt-5 space-y-6">
        {groups.map((group) => (
          <div key={group}>
            <p className="eyebrow mb-3">{group}</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {exteriorColours
                .filter((c) => c.group === group)
                .map((c) => {
                  const on = selected === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => onSelect(c.id)}
                      aria-pressed={on}
                      className={cn(
                        "flex items-center gap-3 rounded-lg border p-2.5 text-left transition-all",
                        on ? "border-champagne ring-1 ring-champagne" : "border-hairline hover:border-ink",
                      )}
                    >
                      <span
                        className="h-9 w-9 flex-none rounded-full border border-black/10"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className="min-w-0">
                        <span className="block truncate text-sm text-ink">{c.name}</span>
                        <span className="block text-[0.65rem] uppercase tracking-wide text-ink-soft">
                          {c.finish}
                          {c.priceDelta > 0 && ` · +${gbp(c.priceDelta)}`}
                        </span>
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Hidden on screen; rendered for print (Download spec → Save as PDF). */
function PrintSheet({ build, total }: { build: BuildState; total: number }) {
  const lines = buildSpecLines(build);
  return (
    <div className="hidden print:block print:p-8">
      <h1 className="font-display text-3xl">MAYFAIR VEHICLES</h1>
      <p className="text-xs uppercase tracking-[0.3em]">Electric · Bespoke · British</p>
      <h2 className="mt-6 font-display text-2xl">Your configured build</h2>
      <table className="mt-4 w-full text-left text-sm">
        <tbody>
          {lines.map((l) => (
            <tr key={l.label} className="border-b">
              <th className="py-2 pr-4 font-medium">{l.label}</th>
              <td className="py-2">{l.value}</td>
            </tr>
          ))}
          <tr>
            <th className="py-2 pr-4 font-medium">Indicative price</th>
            <td className="py-2">{gbp(total)} (final price on quotation)</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
