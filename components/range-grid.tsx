"use client";

import { useState } from "react";
import { ModelCard } from "./model-card";
import { models, modelCategories, type ModelCategory } from "@/lib/data/models";
import { cn } from "@/lib/utils";

/** Filterable range grid (brief §5). */
export function RangeGrid() {
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
              "rounded-full border px-5 py-2 text-[0.72rem] font-medium uppercase tracking-[0.14em] transition-all duration-300",
              filter === c.value
                ? "border-ink bg-ink text-paper"
                : "border-hairline text-ink-soft hover:border-ink hover:text-ink",
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((model) => (
          <ModelCard key={model.slug} model={model} />
        ))}
      </div>
    </div>
  );
}
