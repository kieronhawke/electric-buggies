"use client";

import { useState } from "react";
import { ModelCard } from "./model-card";
import { modelCategories, type Model, type ModelCategory } from "@/lib/data/models";
import { cn } from "@/lib/utils";

/** Filterable range grid. Models are passed in (live from Sanity, seed fallback). */
export function RangeGrid({ models }: { models: Model[] }) {
  const [filter, setFilter] = useState<ModelCategory | "all">("all");
  const shown = filter === "all" ? models : models.filter((m) => m.category === filter);

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter models by category">
        {modelCategories.map((c) => (
          <button
            key={c.value}
            role="tab"
            aria-selected={filter === c.value}
            onClick={() => setFilter(c.value)}
            className={cn(
              "inline-flex min-h-[44px] items-center rounded-full border px-5 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.12em] outline-none transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
              filter === c.value ? "border-ink bg-ink text-white" : "border-line-2 text-ink-2 hover:border-ink hover:text-ink",
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="mt-12 text-ink-2">No models in this category yet.</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((model) => <ModelCard key={model.slug} model={model} />)}
        </div>
      )}
    </div>
  );
}
