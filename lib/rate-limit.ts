/**
 * Best-effort in-memory per-IP rate limiter (per named bucket). Suitable for a
 * single serverless instance; swap for Upstash/Redis for multi-instance.
 */
const stores = new Map<string, Map<string, number[]>>();

export function rateLimited(bucket: string, ip: string, limit: number, windowMs: number): boolean {
  let hits = stores.get(bucket);
  if (!hits) { hits = new Map(); stores.set(bucket, hits); }
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  arr.push(now);
  hits.set(ip, arr);
  if (hits.size > 5000) hits.clear();
  return arr.length > limit;
}

export function clientIp(req: Request): string {
  return (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
}
