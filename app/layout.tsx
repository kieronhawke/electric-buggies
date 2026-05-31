import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { organizationJsonLd, autoDealerJsonLd, websiteJsonLd } from "@/lib/structured-data";
import { pricesVisible } from "@/lib/content";

// Modern UI/body sans, self-hosted by next/font at build time (brief §A: preconnect + self-hosted).
const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}, ${site.strapline}`,
    template: `%s, ${site.name}`,
  },
  description: site.description,
  keywords: [
    "electric buggies",
    "electric golf buggies",
    "electric golf carts UK",
    "electric utility vehicles",
    "street-legal golf buggy UK",
    "luxury electric buggy",
  ],
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: site.name,
    url: site.url,
    title: `${site.name}, ${site.strapline}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name}, ${site.strapline}`,
    description: site.description,
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const showPrice = await pricesVisible();
  return (
    <html lang="en-GB" className={`${hanken.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-white text-ink">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(autoDealerJsonLd(showPrice)) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }} />
        {children}
      </body>
    </html>
  );
}
