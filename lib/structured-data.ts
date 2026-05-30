import { site } from "./site";
import { models, type Model } from "./data/models";
import { faqs } from "./data/faqs";

/** Organization JSON-LD, site-wide (brief §9). */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    description: site.description,
    email: site.contact.email,
    telephone: site.contact.phone,
    logo: `${site.url}/icon`,
    image: `${site.url}/icon`,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.contact.address.line2,
      addressCountry: "GB",
    },
    areaServed: "Worldwide",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: site.contact.phone,
      email: site.contact.email,
      contactType: "sales",
      areaServed: "Worldwide",
      availableLanguage: "English",
    },
    // Only include real social profiles, never a placeholder homepage URL.
    sameAs: [site.social.instagram, site.social.linkedin].filter((u) => u && !/^https?:\/\/[^/]+\/?$/.test(u)),
  };
}

/** AutoDealer JSON-LD, site-wide (brief §9). */
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

/** Product JSON-LD, per model (brief §9). */
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

/** FAQPage JSON-LD, ownership page (brief §9). */
export function faqJsonLd() {
  return faqPageJsonLd(faqs);
}

/** Generic FAQPage JSON-LD from any {question,answer} list (sectors/locations). */
export function faqPageJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

/** Service + areaServed JSON-LD, sectors & locations (brief §E). */
export function serviceJsonLd({ name, description, areaServed, path }: { name: string; description: string; areaServed: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: name,
    description,
    provider: { "@type": "Organization", name: site.name, url: site.url },
    areaServed,
    url: new URL(path, site.url).toString(),
  };
}

/** Article / BlogPosting JSON-LD, blog posts (brief §C/§E). */
export function articleJsonLd({ title, description, path, datePublished, author, image }: { title: string; description: string; path: string; datePublished: string; author: string; image?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    datePublished,
    dateModified: datePublished,
    // Author links to the About page (E-E-A-T: clear, attributable authorship).
    author: { "@type": "Organization", name: author, url: `${site.url}/about` },
    publisher: { "@type": "Organization", name: site.name, url: site.url, logo: { "@type": "ImageObject", url: `${site.url}/icon` } },
    mainEntityOfPage: new URL(path, site.url).toString(),
    ...(image ? { image } : {}),
  };
}
