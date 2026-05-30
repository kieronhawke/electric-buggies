/** Pure formatters usable from both server and client components. */
export function gbpFromPence(pence: number) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(pence / 100);
}

export function formatDate(d: Date | string | null | undefined) {
  if (!d) return null;
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(d));
}
