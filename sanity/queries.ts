import { groq } from "next-sanity";

/** GROQ queries (brief §3 — content fetched via GROQ with ISR). */

export const siteSettingsQuery = groq`*[_type == "siteSettings"][0]{
  siteName, strapline, warrantyTerm, email, phone, addressLocality, instagram, linkedin,
  "logo": logo.asset->url, defaultSeo
}`;

export const homepageQuery = groq`*[_type == "homepage"][0]{
  heroEyebrow, heroHeadline, heroSubhead, "heroImage": heroImage.asset->url,
  positioning, stats, seo
}`;

export const modelsQuery = groq`*[_type == "model"] | order(basePrice asc){
  name, "slug": slug.current, category, tagline, summary, highlights,
  basePrice, specs, "baseImage": baseImage.asset->url,
  "recommendedSectors": recommendedSectors[]->slug.current
}`;

export const modelBySlugQuery = groq`*[_type == "model" && slug.current == $slug][0]{
  name, "slug": slug.current, category, tagline, summary, body, highlights,
  basePrice, specs, "baseImage": baseImage.asset->url,
  "bodyMask": bodyMask.asset->url,
  "gallery": gallery[]{ "url": image.asset->url, alt, "cutout": cutout.asset->url },
  "recommendedSectors": recommendedSectors[]->slug.current
}`;

export const sectorsQuery = groq`*[_type == "sector"]{
  name, "slug": slug.current, tagline, intro, sections, useCases,
  "hero": hero.asset->url, "recommendedModels": recommendedModels[]->slug.current
}`;

export const sectorBySlugQuery = groq`*[_type == "sector" && slug.current == $slug][0]{
  name, "slug": slug.current, tagline, intro, sections, useCases,
  "hero": hero.asset->url, "recommendedModels": recommendedModels[]->slug.current, seo
}`;

export const faqsQuery = groq`*[_type == "faq"] | order(sortOrder asc){ question, answer, category }`;

export const landingPageQuery = groq`*[_type == "landingPage" && slug.current == $slug][0]{
  title, "slug": slug.current, eyebrow, intro, sections,
  "recommendedModels": recommendedModels[]->slug.current, seo
}`;

export const optionsQuery = groq`{
  "colours": *[_type == "colour"] | order(sortOrder asc){ "id": id.current, "name": label, group, hex, finish, priceDelta },
  "roofs": *[_type == "roof"] | order(sortOrder asc){ "id": id.current, "name": label, description, priceDelta },
  "wheels": *[_type == "wheel"] | order(sortOrder asc){ "id": id.current, "name": label, description, priceDelta },
  "upholstery": *[_type == "upholstery"] | order(sortOrder asc){ "id": id.current, "name": label, description, priceDelta },
  "accessories": *[_type == "accessory"] | order(sortOrder asc){ "id": id.current, "name": label, priceDelta }
}`;
