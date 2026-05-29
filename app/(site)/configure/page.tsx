import type { Metadata } from "next";
import { Configurator } from "@/components/configurator/configurator";
import { getConfiguratorOptions } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Configure Your Buggy",
  description:
    "Build your electric buggy, colour, roof, wheels, interior, accessories and your own logo, with a live preview, indicative pricing and a tailored quote.",
  path: "/configure",
});

export default async function ConfigurePage() {
  const options = await getConfiguratorOptions();
  return (
    <section className="px-[clamp(1.25rem,5vw,4.5rem)] pt-[calc(var(--header-h)+2rem)]">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-6">
          <p className="eyebrow">Start a New Build</p>
          <h1 className="mt-2 text-[clamp(2rem,4vw,3rem)]">Build it. Brand it. See it live.</h1>
        </div>
        <Configurator options={options} />
      </div>
    </section>
  );
}
