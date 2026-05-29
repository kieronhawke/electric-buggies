/**
 * Optimise the owner's product photos → /public/img/vehicles/*.webp.
 * Resizes to a sensible max width and converts to WebP (sharp). Re-runnable.
 *   node scripts/optimise-images.mjs
 */
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const SRC = join(process.env.HOME, "Desktop", "ElectricVehicleimages "); // note trailing space
const OUT = join(process.cwd(), "public", "img", "vehicles");
mkdirSync(OUT, { recursive: true });

// source filename → clean output name
const map = {
  "Club_Car_Tempo_Blue_2351x1763.png": "two",
  "Ascent-Web3.png": "four",
  "Club_Car_Villager_8_Canopy_LR_3189x1749.png": "eight",
  "EZGO-S6-Utility-Vehicle-UK-1024x698.png": "utility",
  "Club_Car_Villager_6_Wheelchair_Access_Vehicle_07_LR_2193x1460.png": "accessible",
  "Shuttle2_Blue_TQL_069.png.webp": "shuttle",
  "20181012020537_915179.png": "fleet-a",
  "Hc767fd6e8f204ef89236beba623c7a25f.avif": "fleet-b",
};

for (const [src, name] of Object.entries(map)) {
  try {
    await sharp(join(SRC, src))
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(join(OUT, `${name}.webp`));
    console.log(`✓ ${name}.webp`);
  } catch (e) {
    console.error(`✗ ${src}: ${e.message}`);
  }
}
console.log("done →", OUT);
