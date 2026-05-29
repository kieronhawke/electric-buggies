# Electric Buggies — 3D Rendering & Buggy-Builder Strategy

A practical plan for turning "we mostly have standard photos" into an editable, Land-Rover/Porsche-grade 3D configurator — with real-time colour, part swaps, 360° rotation, and customer **logo placement**. This is research + a recommended path; it informs the build but no decision here is locked.

---

## 1. How the big brands actually do it
Two approaches dominate, and **both require a 3D model to be produced first**:

- **Real-time 3D in the browser (WebGL).** The model is rendered live; users rotate it and see colour/material/part changes instantly. BMW lets users open doors, rotate, and see light reflections. Porsche's newest configurator runs on **Unreal Engine with cloud streaming (AWS)** for photoreal real-time visuals; earlier Porsche versions used **Unity WebGL**, and tools like "Colour of Your Choice" offer 190+ live colours. This is the gold standard for interactivity — and the right model for a *custom* logo-placement feature.
- **Pre-rendered hyper-real images.** Many "2D" configurators (including older Porsche) are actually **high-quality 3D renders**, beautifully lit and retouched, shown from a few fixed angles. Photoreal, but every option combination must be rendered in advance, which multiplies fast and makes arbitrary combos (and free logo placement) hard.

**Takeaway:** real-time WebGL is what enables the editable, logo-on-the-buggy experience you want. Enterprise brands use Unreal/Unity + huge budgets; we get ~90% of the feel with web-native tools at a tiny fraction of the cost.

---

## 2. The core challenge: you have photos, not 3D models
A configurator needs a **3D model per buggy platform** (ideally with separate materials for body / roof / wheels / seats, and UV-mapped surfaces for decals). There are three realistic ways to get there, and we can mix them:

### Option A — AI image-to-3D (fast, cheap, good for a first pass)
Upload a photo, get a 3D model in seconds–minutes. 2026 tools are dramatically better than a year ago.
- **Meshy** — sharp textures; preserves detail/logos well; strong all-rounder.
- **Tripo** — clean, game-ready topology (easy to edit/rig).
- **Rodin / Hyper3D** — most photoreal; higher cost.
- **Luma AI** — generous free tier; good for testing.
- **3D AI Studio / JAI Portal** — aggregators that run several engines (Meshy, Rodin, Tripo, Hunyuan3D, Trellis) so you pick the best output per model.
- *Reality check:* AI meshes often need cleanup (non-manifold geometry, imperfect topology) before they're configurator-grade. Best as a **fast starting point** or for early prototyping — not necessarily final quality for the hero product the whole brand sells. Commercial use is permitted on the paid tools.

### Option B — Photogrammetry / 3D scanning (accurate, needs a physical buggy)
Walk around a real unit taking 20–100 photos (or use a LiDAR phone); software reconstructs an exact 3D mesh.
- **Polycam** (iPhone Pro LiDAR, ~$10/mo), **Luma AI** (NeRF/Gaussian splats, free tier), **RealityCapture**, **KIRI Engine**.
- Best once you have a buggy on hand; produces an accurate replica, but needs retopo/cleanup for real-time use.

### Option C — Commission proper 3D models (gold standard for quality)
A 3D artist builds clean, accurate models in **Blender** with correctly separated materials and UVs, optimised to web-ready **GLB/glTF**.
- **Base to start from:** buy a generic golf-buggy model on **CGTrader / TurboSquid / Sketchfab** (~$50–300) and have it customised to your designs — far cheaper than modelling from scratch.
- **Bespoke modelling:** a freelancer/studio (Upwork, Fiverr Pro, or a 3D studio) — typically a few hundred to low-thousands per model; one platform model can be re-skinned for several variants (Two/Four/Six/Eight share architecture), so you likely need only ~5–8 base models.
- Texturing in **Substance Painter**; hero marketing stills can be rendered in **KeyShot** or Blender Cycles.

**Recommended production route:** start with **AI image-to-3D (Meshy/Tripo) or a marketplace base model** to move fast, then **refine in Blender** (or commission) for the hero models; use **photogrammetry** once a physical buggy is available for maximum accuracy. Reuse shared platforms across variants.

---

## 3. Rendering it on the website (web tech)
The site is Next.js/React, so:
- **React Three Fiber (R3F) + drei — recommended.** R3F is the React wrapper around **Three.js**, the default for custom interactive web 3D; `@react-three/drei` gives ready-made helpers: `OrbitControls` (360° spin), `Environment` (studio lighting/reflections), `useGLTF` (load models), and crucially **`<Decal>`** for projecting a logo onto the bodywork. This fits our stack and gives full control over the premium look.
- **Google `<model-viewer>`** — dead-simple web component to drop in a GLB with built-in **AR** ("view in your space"); great as a lightweight per-model viewer and for mobile AR, less suited to a complex multi-step configurator.
- **Babylon.js** — full engine, best if we ever need heavy XR/VR; heavier than we need here.
- **Spline** — designer-friendly, low-code 3D with interactivity and a React export; an option for a more visual build workflow.
- **Formats & performance:** export **GLB/glTF**, compress with **Draco/meshopt** (via `gltf-transform`), keep poly counts sensible, lazy-load the 3D island, and provide a 2D fallback on low-power devices. Mobile performance is a first-class requirement.

---

## 4. Customer logo placement (the branding feature)
A major B2B selling point — branded fleets for resorts, estates, events, golf clubs.
- **Flow:** customer uploads a logo (transparent **PNG/SVG**) → picks placement (e.g. **front panel, both sides, rear, bonnet**) → adjusts scale/position → sees it on the buggy live → it's saved into the build and carried into the quote so your team produces it exactly.
- **2D phase (works now):** composite the uploaded logo onto **defined hotspots** for each photo view (front/side/rear) — scaled and positioned to the zone. Achievable immediately with the photos you already have.
- **3D phase:** use drei **`<Decal>`** to project the logo texture onto the mesh at a chosen **anchor point**, or map it to **predefined UV decal zones** per model. Looks like it's really printed on the panel and rotates with the buggy.
- **Admin/CMS:** define the available logo zones per model; store the customer's uploaded asset and chosen placement with the saved configuration.

---

## 5. Build-vs-buy: SaaS configurator platforms (the alternative)
If we ever wanted to avoid a custom build:
- **Zakeke** — cheapest/self-serve (~$29–149/mo); easy, but render quality is "adequate for SMB, **not premium**" — a poor fit for the Porsche/Range-Rover bar.
- **Expivi / Vividworks** — mid-market, strong configuration logic (Europe-focused).
- **Threekit** — enterprise, **best-in-class** photoreal (used by Mercedes-Benz, Crate & Barrel); but **$50k–150k+/yr**, 3–6 month implementation, and still needs dedicated 3D artists.
- **ConfiguraThor / Salsita** — custom-built mid-market services that include the 3D modelling and configurator logic for you (from ~€3,000).
- **Trade-offs:** SaaS = faster, but monthly cost, less control, brand/lock-in, and the affordable tiers don't hit a luxury look. **A custom R3F build gives the most control and the premium feel, fits our stack, and has no per-month platform fee** — at the cost of producing the models ourselves (Section 2). This is the recommended direction, with SaaS (Threekit) kept in mind only if we later want a turnkey enterprise route.

---

## 6. Recommended phased plan (matches the configurator's pluggable design)
The configurator's `<PreviewStage>` is already specified to swap visualisation engines **without a rewrite**, so we ship value now and raise fidelity over time:
- **Phase A — now (2D):** photographic **recolour** configurator (already prototyped) using your standard photos; **logo placement via 2D hotspots**; full step flow, pricing, save/share, quote. Live and useful immediately.
- **Phase B — models:** produce GLB models (AI image-to-3D → Blender cleanup, or commission; photogrammetry once a unit is available). Start with the best-selling 1–2 models.
- **Phase C — 3D:** integrate GLB via **R3F + drei** — real-time colour/material/part swaps, **360° rotation**, **`<Decal>` logo placement**, studio lighting; keep the 2D path as fallback. Add **AR** via `<model-viewer>`/USDZ.
- **Phase D — polish:** photoreal lighting/HDRI, per-model decal zones, optional pre-rendered hero turntables for marketing.

**Bottom line:** build the configurator custom in React Three Fiber, keep the live 2D version shipping today, and produce 3D models pragmatically (AI/marketplace → Blender → photogrammetry/commission for the hero models). This delivers the editable, logo-on-the-buggy, 360° experience at the quality bar you want — without enterprise cost or lock-in.
