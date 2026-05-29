import type { Metadata } from "next";
import { Container } from "@/components/container";
import { Configurator } from "@/components/configurator/configurator";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Configure Your Vehicle",
  description:
    "Configure your Electric Buggies electric vehicle — colour, roof, wheels, upholstery and accessories — with a live preview and indicative pricing. Save, share and request a tailored quote.",
  path: "/configure",
});

export default function ConfigurePage() {
  return (
    <section className="pb-28 pt-28 md:pt-32">
      <Container size="wide">
        <div className="mb-8">
          <p className="eyebrow">The Configurator</p>
          <h1 className="mt-3 text-4xl text-ink md:text-5xl">Specify your Electric Buggies.</h1>
        </div>
        <Configurator />
      </Container>
    </section>
  );
}
