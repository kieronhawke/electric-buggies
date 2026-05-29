"use client";

import { modelBySlug } from "@/lib/data/models";
import { exteriorColours, roofs, wheels, upholstery, logoZones } from "@/lib/data/options";
import type { BuildState } from "@/lib/configurator";

/**
 * ── ENGINE-AGNOSTIC PREVIEW (brief §H / 3D-RENDERING-STRATEGY.md) ──────────
 *
 * PreviewStage renders whatever the active "engine" supports. v1 is the
 * photographic/illustrative 2D engine below: a recolourable SVG buggy whose
 * bodywork tints instantly, with the customer logo composited onto 2D hotspots.
 *
 * To raise fidelity later WITHOUT rewriting the configurator, implement this
 * same contract with a new engine and swap it in here:
 *
 *   interface PreviewEngine {
 *     // build → visual. Same props for every engine.
 *     render(build: BuildState): ReactNode;
 *   }
 *
 *  - 2D-photo engine: <canvas> compositing a per-model base photo + PNG alpha
 *    mask (hue/sat-preserving tint), overlay layers for roof/wheels, and the
 *    logo drawn at the zone hotspot. Drop the photo+mask on each `model` doc.
 *  - 3D engine (React Three Fiber + drei): <Canvas><useGLTF model3d/>
 *    + OrbitControls (360°) + Environment (lighting) + material colour swap +
 *    <Decal> for the logo at `decalZones[zone]`. 2D stays the low-power fallback.
 *
 * The Configurator only knows BuildState, never the engine, so visualisation
 * advances independently of the step flow, pricing, save/share and quote logic.
 */

export function PreviewStage({ build, logoUrl }: { build: BuildState; logoUrl: string | null }) {
  const model = modelBySlug(build.model);
  const colour = exteriorColours.find((c) => c.id === build.colour) ?? exteriorColours[0];
  const roof = build.roof;
  const wheel = wheels.find((w) => w.id === build.wheels) ?? wheels[0];
  const seat = upholstery.find((u) => u.id === build.upholstery)?.seat ?? "#b9bcc1";
  const zone = logoZones.find((z) => z.id === build.logoZone);

  const showRoofPanel = roof !== "open";
  const hardtop = roof === "hardtop";

  // Finish → sheen overlay opacity on the bodywork.
  const sheen = colour.finish === "Metallic" ? 0.28 : colour.finish === "Matte" ? 0.06 : 0.16;

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[radial-gradient(120%_100%_at_50%_18%,#ffffff_0%,#eef0f2_55%,#dfe2e6_100%)]">
      <span className="absolute left-4 top-4 rounded-full border border-line-2 bg-white/60 px-3 py-1 text-[.6rem] font-semibold uppercase tracking-[.2em] text-ink-2 backdrop-blur">
        Live preview
      </span>

      <div className="relative w-[min(86%,640px)]">
        <svg viewBox="0 0 640 380" className="w-full drop-shadow-[0_26px_30px_rgba(0,0,0,0.16)] motion-safe:animate-[float_7s_ease-in-out_infinite]" aria-label={`${model?.name} preview in ${colour.name}`}>
          <style>{`@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}} .bd{transition:fill .5s ease} .rf,.sk{transition:opacity .35s ease}`}</style>
          <defs>
            <linearGradient id="sheen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity={sheen} />
              <stop offset="55%" stopColor="#fff" stopOpacity="0" />
              <stop offset="100%" stopColor="#000" stopOpacity={sheen * 0.7} />
            </linearGradient>
          </defs>

          <ellipse cx="320" cy="338" rx="240" ry="20" fill="#000" opacity="0.10" />

          {/* canopy */}
          <g className="rf" style={{ opacity: showRoofPanel ? 1 : 0 }}>
            <rect x="168" y="78" width="306" height="16" rx="8" className="bd" fill={colour.hex} />
            <rect x="182" y="92" width="9" height="92" rx="4" fill="#23282e" />
            <rect x="451" y="92" width="9" height="92" rx="4" fill="#23282e" />
            {hardtop && <rect x="176" y="92" width="290" height="60" rx="6" className="bd" fill={colour.hex} opacity="0.92" />}
          </g>

          {/* body */}
          <g>
            <path d="M96 250 q0 -14 16 -14 h416 q16 0 16 14 v22 q0 14 -16 14 h-416 q-16 0 -16 -14 z" fill="#23282e" />
            <path className="bd" d="M120 246 q-8 -78 64 -82 h64 l30 -36 q6 -8 18 -8 h70 q40 0 56 30 l16 36 q44 2 52 30 q6 22 -2 34 h-420 q-18 -14 -16 -34 z" fill={colour.hex} />
            <path d="M120 246 q-8 -78 64 -82 h64 l30 -36 q6 -8 18 -8 h70 q40 0 56 30 l16 36 q44 2 52 30 q6 22 -2 34 h-420 q-18 -14 -16 -34 z" fill="url(#sheen)" />
            <path d="M256 168 q0 -16 16 -16 h44 q16 0 16 16 v54 h-76 z" fill={seat} />
            <rect x="250" y="216" width="92" height="14" rx="6" fill={seat} />
            <path d="M384 150 l28 56 h-44 q-8 0 -8 -8 v-40 q0 -8 24 -8 z" fill="#cfd4d9" opacity="0.7" />
            <circle cx="520" cy="214" r="9" fill="#fbfdff" />
          </g>

          {/* wheels */}
          <g>
            {[196, 444].map((cx) => (
              <g key={cx}>
                <circle cx={cx} cy="286" r="50" fill="#1b1f24" />
                <circle cx={cx} cy="286" r="30" fill={wheel.rim} />
                <circle cx={cx} cy="286" r="9" fill="#2a2f35" />
                {wheel.sport && (
                  <g stroke="#2a2f35" strokeWidth="4">
                    <line x1={cx} y1="262" x2={cx} y2="310" /><line x1={cx - 24} y1="286" x2={cx + 24} y2="286" />
                    <line x1={cx - 16} y1="270" x2={cx + 16} y2="302" /><line x1={cx + 16} y1="270" x2={cx - 16} y2="302" />
                  </g>
                )}
              </g>
            ))}
          </g>
        </svg>

        {/* Logo decal overlay (2D hotspot composite, brief §G) */}
        {logoUrl && zone && (
          <div
            className="pointer-events-none absolute"
            style={{
              left: `${zone.x}%`,
              top: `${zone.y}%`,
              transform: `translate(-50%,-50%) scale(${build.logoScale})`,
              width: "16%",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoUrl} alt="Your logo on the vehicle" className="w-full object-contain mix-blend-multiply" />
          </div>
        )}
      </div>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-center">
        <div className="text-[1.05rem] font-semibold">{colour.name}</div>
        <div className="text-[.72rem] font-semibold uppercase tracking-[.14em] text-ink-2">{colour.finish}{zone ? ` · Branded (${build.logoZone})` : ""}</div>
      </div>
    </div>
  );
}
