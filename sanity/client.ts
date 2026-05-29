import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { apiVersion, dataset, projectId } from "./env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // ISR + CDN for SEO + speed (brief §3)
});

const builder = imageUrlBuilder(client);

/** Build a responsive Sanity CDN image URL with crop/hotspot support. */
export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto("format").fit("max");
}
