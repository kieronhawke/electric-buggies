import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Configurator } from "@/components/configurator/configurator";
import { models, modelBySlug } from "@/lib/data/models";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return models.filter((m) => m.basePrice > 0).map((m) => ({ model: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ model: string }>;
}): Promise<Metadata> {
  const { model: slug } = await params;
  const model = modelBySlug(slug);
  if (!model) return {};
  return buildMetadata({
    title: `Configure the ${model.name}`,
    description: `Configure your ${model.name} — colour, roof, wheels, upholstery and accessories — with a live preview and indicative pricing.`,
    path: `/configure/${model.slug}`,
  });
}

export default async function ConfigureModelPage({
  params,
}: {
  params: Promise<{ model: string }>;
}) {
  const { model: slug } = await params;
  const model = modelBySlug(slug);
  if (!model || model.basePrice === 0) notFound();

  return (
    <section className="px-[clamp(1.25rem,5vw,4.5rem)] pt-[calc(var(--header-h)+2rem)]">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-6">
          <p className="eyebrow">Configure</p>
          <h1 className="mt-2 text-[clamp(2rem,4vw,3rem)]">{model.name}</h1>
        </div>
        <Configurator initialModel={model.slug} />
      </div>
    </section>
  );
}
