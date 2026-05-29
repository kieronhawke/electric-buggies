"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";
import { structure } from "./sanity/structure";
import { apiVersion, dataset, projectId } from "./sanity/env";

/**
 * Embedded Sanity Studio config (brief §3 — Studio at /studio).
 * Singletons are pinned via the structure resolver; new-document options for
 * them are hidden below.
 */
export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter((t) => !["homepage", "siteSettings"].includes(t.schemaType)),
  },
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
  document: {
    // Hide "create new" for singletons.
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === "global"
        ? prev.filter((t) => !["homepage", "siteSettings"].includes(t.templateId))
        : prev,
  },
});
