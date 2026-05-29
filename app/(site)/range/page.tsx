import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHero } from "@/components/page-hero";
import { RangeGrid } from "@/components/range-grid";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "The Range",
  description:
    "Explore the Electric Buggies range — bespoke electric buggies and utility vehicles, from an intimate two-seater to an eight-seat shuttle. Configure yours and request a tailored quote.",
  path: "/range",
});

export default function RangePage() {
  return (
    <>
      <PageHero
        eyebrow="The Range"
        title="The complete Electric Buggies range."
        lede="Six starting points, each made to order. Filter by configuration, then configure your own."
        crumbs={[
          { name: "Home", path: "/" },
          { name: "The Range", path: "/range" },
        ]}
      />
      <section className="py-16 md:py-24">
        <Container>
          <RangeGrid />
        </Container>
      </section>
    </>
  );
}
