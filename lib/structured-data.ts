import { site } from "./site";
import { models, type Model } from "./data/models";
import { faqs } from "./data/faqs";

/** Organization JSON-LD — site-wide (brief §9). */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    description: site.description,
    email: site.contact.email,
    telephone: site.contact.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.contact.address.line2,
      addressCountry: "GB",
    },
    sameAs: [site.social.instagram, site.social.linkedin],
  };
}

/** AutoDealer JSON-LD — site-wide (brief §9). */
export function autoDealerJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: site.name,
    url: site.url,
    description: site.description,
    telephone: site.contact.phone,
    email: site.contact.email,
    areaServed: "GB",
    address: {
      "@type": "PostalAddress",
      addressLocality: site.contact.address.line2,
      addressCountry: "GB",
    },
    makesOffer: models
      .filter((m) => m.basePrice > 0)
      .map((m) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Product", name: `${site.name} ${m.name}` },
        priceCurrency: "GBP",
        price: m.basePrice,
      })),
  };
}

/** WebSite + SearchAction JSON-LD (brief §9). */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${site.url}/range?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

/** Product JSON-LD — per model (brief §9). */
export function productJsonLd(model: Model) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${site.name} ${model.name}`,
    description: model.summary,
    brand: { "@type": "Brand", name: site.name },
    category: model.categoryLabel,
    ...(model.basePrice > 0
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "GBP",
            price: model.basePrice,
            priceValidUntil: `${new Date().getFullYear() + 1}-12-31`,
            availability: "https://schema.org/InStock",
            url: `${site.url}/range/${model.slug}`,
            seller: { "@type": "Organization", name: site.name },
          },
        }
      : {}),
  };
}

/** BreadcrumbList JSON-LD (brief §9). */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: new URL(item.path, site.url).toString(),
    })),
  };
}

/** FAQPage JSON-LD — ownership page (brief §9). */
export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
