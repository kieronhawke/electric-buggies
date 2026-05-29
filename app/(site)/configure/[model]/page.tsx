import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
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
    <section className="pb-28 pt-28 md:pt-32">
      <Container size="wide">
        <div className="mb-8">
          <p className="eyebrow">Configure</p>
          <h1 className="mt-3 text-4xl text-ink md:text-5xl">{model.name}</h1>
        </div>
        <Configurator initialModel={model.slug} />
      </Container>
    </section>
  );
}
