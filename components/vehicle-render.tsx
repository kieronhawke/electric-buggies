import { cn } from "@/lib/utils";

/**
 * Recolourable vehicle render, a clean profile illustration whose bodywork
 * fills with the selected colour. Used for model cards and as the live
 * configurator preview (brief §6).
 *
 * NOTE (asset-upgrade path, brief §6): this SVG is the asset-agnostic v1. The
 * configurator's <PreviewStage> consumes the same `colour`/`roof`/`wheels`
 * props, so swapping in (a) per-colour photography or (b) a Three.js model with
 * true material swaps is a drop-in replacement, no configurator rewrite. A
 * tasteful illustration is preferred here over an ugly photo composite.
 */
export function VehicleRender({
  colour = "#1c2b22",
  roof = "soft-canopy",
  wheels = "classic",
  seats = 4,
  className,
  title = "Electric Buggies vehicle preview",
}: {
  colour?: string;
  roof?: string;
  wheels?: string;
  seats?: number;
  className?: string;
  title?: string;
}) {
  const showRoof = roof !== "open";
  const panoramic = roof === "panoramic";
  const hardRoof = roof === "hard-roof";
  const rim =
    wheels === "noble" ? "#cfc8b8" : wheels === "diamond" ? "#b6b8b4" : "#7a756a";

  return (
    <svg
      viewBox="0 0 800 440"
      className={cn("h-full w-full", className)}
      role="img"
      aria-label={title}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="bodyShade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="55%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.22" />
        </linearGradient>
        <radialGradient id="floorShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* floor shadow */}
      <ellipse cx="400" cy="372" rx="300" ry="26" fill="url(#floorShadow)" />

      {/* canopy */}
      {showRoof && (
        <g>
          <rect x="232" y="92" width="14" height="150" rx="3" fill="#2a2620" />
          <rect x="556" y="92" width="14" height="150" rx="3" fill="#2a2620" />
          <rect
            x="212"
            y="78"
            width="378"
            height="22"
            rx="8"
            fill={hardRoof ? colour : "#2a2620"}
          />
          {hardRoof && (
            <rect x="212" y="78" width="378" height="22" rx="8" fill="url(#bodyShade)" />
          )}
          {panoramic && (
            <rect x="232" y="82" width="338" height="14" rx="6" fill="#9fb6c4" opacity="0.5" />
          )}
        </g>
      )}

      {/* seats */}
      <g fill="#3a352d">
        <rect x="252" y="196" width="86" height="58" rx="10" />
        <rect x="252" y="158" width="20" height="44" rx="8" />
        {seats >= 4 && (
          <>
            <rect x="392" y="196" width="86" height="58" rx="10" />
            <rect x="392" y="158" width="20" height="44" rx="8" />
          </>
        )}
      </g>

      {/* body / chassis, the recoloured element */}
      <g>
        <path
          d="M150 300
             C150 270 168 256 196 256
             L262 256
             C276 224 300 214 332 214
             L470 214
             C504 214 528 226 542 256
             L606 256
             C636 256 654 272 654 300
             L654 312
             C654 320 648 326 640 326
             L164 326
             C156 326 150 320 150 312 Z"
          fill={colour}
        />
        <path
          d="M150 300
             C150 270 168 256 196 256
             L262 256
             C276 224 300 214 332 214
             L470 214
             C504 214 528 226 542 256
             L606 256
             C636 256 654 272 654 300
             L654 312
             C654 320 648 326 640 326
             L164 326
             C156 326 150 320 150 312 Z"
          fill="url(#bodyShade)"
        />
        {/* front lamp + champagne hairline detail */}
        <rect x="636" y="276" width="14" height="18" rx="4" fill="#f5f3ef" opacity="0.85" />
        <rect x="164" y="314" width="476" height="3" fill="#9a8150" opacity="0.55" />
      </g>

      {/* wheels */}
      <g>
        {[250, 554].map((cx) => (
          <g key={cx}>
            <circle cx={cx} cy="330" r="52" fill="#16150f" />
            <circle cx={cx} cy="330" r="30" fill={rim} />
            <circle cx={cx} cy="330" r="9" fill="#16150f" />
          </g>
        ))}
      </g>
    </svg>
  );
}
