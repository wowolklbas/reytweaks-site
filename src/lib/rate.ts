// Sliding-window rate limiter, in-memory. Good enough for a small shop;
// pair with Vercel WAF / Upstash for stricter production control.

import { rateLimitBuckets } from "./config";

export function rateLimited(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const buckets = rateLimitBuckets();
  const arr = (buckets.get(key) || []).filter((t) => now - t < windowMs);
  if (arr.length >= max) {
    buckets.set(key, arr);
    return true;
  }
  arr.push(now);
  buckets.set(key, arr);
  return false;
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd ? fwd.split(",")[0].trim() : "local";
}
