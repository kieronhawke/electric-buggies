import Link from "next/link";
import { Reveal } from "@/components/reveal";

interface LocationLite {
  slug: string;
  name: string;
  region: string;
  tagline: string;
}

// Continent grouping for the region/country selector (Tesla pattern 7).
const CONTINENT_BY_SLUG: Record<string, string> = {
  "united-kingdom": "Europe",
  scotland: "Europe",
  dubai: "Middle East",
  "new-york": "North America",
  bermuda: "Atlantic & Caribbean",
};
const CONTINENT_ORDER = ["Europe", "Middle East", "North America", "Atlantic & Caribbean", "Worldwide"];

function continentFor(l: LocationLite): string {
  if (CONTINENT_BY_SLUG[l.slug]) return CONTINENT_BY_SLUG[l.slug];
  const r = l.region.toLowerCase();
  if (/(united kingdom|britain|europe|france|spain|italy|monaco|switzerland|portugal)/.test(r)) return "Europe";
  if (/(emirates|uae|qatar|saudi|middle east|gulf)/.test(r)) return "Middle East";
  if (/(united states|usa|canada|america)/.test(r)) return "North America";
  if (/(atlantic|caribbean|bermuda|bahamas)/.test(r)) return "Atlantic & Caribbean";
  return "Worldwide";
}

/** Grouped-by-continent country selector: clean typographic list. */
export function RegionSelector({ locations }: { locations: LocationLite[] }) {
  const groups = new Map<string, LocationLite[]>();
  for (const l of locations) {
    const c = continentFor(l);
    if (!groups.has(c)) groups.set(c, []);
    groups.get(c)!.push(l);
  }
  const ordered = [...groups.entries()].sort(
    (a, b) => CONTINENT_ORDER.indexOf(a[0]) - CONTINENT_ORDER.indexOf(b[0]),
  );

  return (
    <div className="grid gap-x-12 gap-y-12 sm:grid-cols-2">
      {ordered.map(([continent, locs], gi) => (
        <Reveal key={continent} delay={gi * 0.06}>
          <section>
            <h2 className="border-b border-line pb-3 text-[.7rem] font-semibold uppercase tracking-[.22em] text-ink-2">
              {continent}
            </h2>
            <ul className="mt-2">
              {locs.map((l) => (
                <li key={l.slug}>
                  <Link
                    href={`/locations/${l.slug}`}
                    className="group flex items-baseline justify-between gap-4 border-b border-line py-4 transition-colors hover:text-ink"
                  >
                    <span>
                      <span className="block text-[1.35rem] font-light tracking-[-0.01em] text-ink">{l.name}</span>
                      <span className="mt-0.5 block max-w-[42ch] text-[.86rem] text-ink-2">{l.tagline}</span>
                    </span>
                    <svg
                      width="18"
                      height="10"
                      viewBox="0 0 18 10"
                      fill="none"
                      className="mt-2 flex-none text-ink-2 transition-transform duration-200 group-hover:translate-x-1.5 group-hover:text-ink"
                      aria-hidden
                    >
                      <path d="M1 5h15M12 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>
      ))}
    </div>
  );
}
