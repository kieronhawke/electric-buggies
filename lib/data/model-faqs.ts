import { gbp } from "@/lib/utils";
import type { Model } from "./models";

/**
 * Genuine buyer FAQs per model. These are the questions buyers actually ask
 * (cost, road legality, branding, range, warranty, delivery), so they earn
 * FAQPage rich results, read well, and answer the queries AI engines fan out.
 *
 * Facts we do not have are written AROUND with confident, non-committal copy
 * (no invented numbers): range/charge/warranty terms are confirmed per
 * configuration. Road-legal copy stays accurate (private land by default).
 */
export function modelFaqs(model: Model, showPrice = false): { q: string; a: string }[] {
  const n = model.name;
  const bespoke = model.basePrice === 0;
  const price = bespoke || !showPrice
    ? `The ${n} is priced to your configuration, branding and fleet size, confirmed on a tailored quote. We aim to offer the best vehicles at the most competitive, affordable rate, and to beat any genuine like-for-like quote.`
    : `The ${n} starts from ${gbp(model.basePrice)}. The final figure depends on your configuration, branding and fleet size, confirmed on a tailored quote. We aim to beat any genuine like-for-like quote.`;
  return [
    { q: `How much does the ${n} cost?`, a: price },
    { q: `Who is the ${n} for?`, a: `${model.summary} It is at home across estates, resorts, golf clubs, holiday parks and private events.` },
    { q: `Is the ${n} road legal?`, a: `Our standard vehicles are built for private land: estates, resorts, golf courses, grounds and venues. Certain configurations can be made road legal subject to type approval, and we will advise honestly on what is possible for your intended use.` },
    { q: `Can I brand the ${n} for my business or fleet?`, a: `Yes. Custom colours, livery, upholstery and your logo are a core part of what we do, so a fleet can be finished entirely to your brand. You can preview the look in the configurator and we confirm the finish at quotation.` },
    { q: `What is the range, and how do I charge it?`, a: `The ${n} is fully electric and charges from a standard supply, ready for a full day's use. We confirm the exact range and charge time for your chosen battery and specification, so it matches how you will use it.` },
    { q: `What warranty and support come with the ${n}?`, a: `Every vehicle is backed by a 3-year warranty and access to our 24-hour VIP call-out, with servicing and support across the UK and worldwide. We are built to look after you long after delivery.` },
    { q: `Do you deliver the ${n} worldwide?`, a: `Yes. We build to order in Britain and deliver across the UK and internationally, coordinating freight and import so your vehicle arrives ready to use.` },
  ];
}
