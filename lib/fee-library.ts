/**
 * Pre-written named fees and inclusions for the Quote Generator and Inventory
 * cost stack. All amounts are ESTIMATES in pence the admin can edit. Customer
 * quotes show the fee label + amount; the landed-fee presets are internal.
 */
import type { FeeLine } from "./costing";

export interface NamedFee {
  label: string;
  amount: number; // pence, default estimate
  group: string;
}

/** Customer-facing fees offered in the Quote Generator dropdown (30+). */
export const QUOTE_FEE_LIBRARY: NamedFee[] = [
  // Delivery
  { label: "UK mainland delivery", amount: 45000, group: "Delivery" },
  { label: "Scottish Highlands surcharge", amount: 18000, group: "Delivery" },
  { label: "Island / offshore delivery", amount: 65000, group: "Delivery" },
  { label: "White-glove delivery & handover", amount: 30000, group: "Delivery" },
  { label: "Worldwide freight (export)", amount: 280000, group: "Delivery" },
  { label: "Express / priority build slot", amount: 95000, group: "Delivery" },
  // Preparation
  { label: "Pre-delivery inspection (PDI)", amount: 22000, group: "Preparation" },
  { label: "Road-registration & number plates", amount: 28000, group: "Preparation" },
  { label: "Commissioning & on-site training", amount: 35000, group: "Preparation" },
  // Branding & finish
  { label: "Bespoke livery / full wrap", amount: 120000, group: "Branding" },
  { label: "Custom paint colour", amount: 85000, group: "Branding" },
  { label: "Logo & signwriting", amount: 32000, group: "Branding" },
  { label: "Embroidered seats", amount: 24000, group: "Branding" },
  // Hardware upgrades
  { label: "Lithium battery upgrade", amount: 180000, group: "Upgrades" },
  { label: "Fast charger", amount: 65000, group: "Upgrades" },
  { label: "Extended-range battery pack", amount: 240000, group: "Upgrades" },
  { label: "Hard top / canopy", amount: 78000, group: "Upgrades" },
  { label: "Full enclosure & doors", amount: 145000, group: "Upgrades" },
  { label: "Heated windscreen & wiper", amount: 42000, group: "Upgrades" },
  { label: "Lighting & indicator pack", amount: 38000, group: "Upgrades" },
  { label: "Road-legal pack (lights, mirrors, horn)", amount: 95000, group: "Upgrades" },
  { label: "Cargo bed / utility conversion", amount: 130000, group: "Upgrades" },
  { label: "Wheelchair access ramp (PRM)", amount: 165000, group: "Upgrades" },
  { label: "Premium seating upgrade", amount: 58000, group: "Upgrades" },
  { label: "Telematics & fleet tracking", amount: 36000, group: "Upgrades" },
  // Aftercare
  { label: "2-year extended warranty", amount: 95000, group: "Aftercare" },
  { label: "5-year extended warranty", amount: 185000, group: "Aftercare" },
  { label: "Annual service plan", amount: 48000, group: "Aftercare" },
  { label: "6-month complimentary service plan", amount: 0, group: "Aftercare" },
  { label: "On-site breakdown cover", amount: 72000, group: "Aftercare" },
  { label: "Spare parts starter kit", amount: 55000, group: "Aftercare" },
  { label: "Driver training day", amount: 40000, group: "Aftercare" },
];

/** Internal landed/import fee presets for the inventory cost stack (other fees). */
export const LANDED_FEE_PRESETS: NamedFee[] = [
  { label: "Customs clearance", amount: 18000, group: "Import" },
  { label: "Terminal handling (THC)", amount: 24000, group: "Import" },
  { label: "Documentation fee", amount: 6500, group: "Import" },
  { label: "Drayage / haulage from port", amount: 32000, group: "Import" },
  { label: "Port handling & lift-on/off", amount: 14000, group: "Import" },
  { label: "Demurrage / storage", amount: 9000, group: "Import" },
  { label: "Marine cargo insurance", amount: 21000, group: "Import" },
  { label: "Pre-shipment inspection", amount: 12000, group: "Import" },
  { label: "Customs agent commission", amount: 15000, group: "Import" },
  { label: "Bank / FX transfer fee", amount: 8000, group: "Import" },
  { label: "Container unpack & de-vanning", amount: 11000, group: "Import" },
];

/** Inclusion tick-boxes offered on quotes (no separate charge; value-adds). */
export const INCLUSIONS_LIBRARY: string[] = [
  "2-year extended warranty",
  "5-year extended warranty",
  "6-month complimentary service plan",
  "Free UK delivery",
  "Free worldwide delivery",
  "Extendable warranty",
];

export const asFeeLine = (f: NamedFee): FeeLine => ({ label: f.label, amount: f.amount });
