import type { SchemaTypeDefinition } from "sanity";
import { seo, spec, galleryImage } from "./objects";
import { colour, roof, wheel, upholsteryType, accessory } from "./options";
import {
  model,
  sector,
  landingPage,
  page,
  faq,
  quoteRequest,
} from "./documents";
import { homepage, siteSettings } from "./singletons";

export const schemaTypes: SchemaTypeDefinition[] = [
  // objects
  seo,
  spec,
  galleryImage,
  // configurator options
  colour,
  roof,
  wheel,
  upholsteryType,
  accessory,
  // documents
  model,
  sector,
  landingPage,
  page,
  faq,
  quoteRequest,
  // singletons
  homepage,
  siteSettings,
];
