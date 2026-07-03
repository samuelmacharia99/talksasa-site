const buckets = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = Number(process.env.LEAD_RATE_LIMIT_MAX || 8);

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  bucket.count += 1;
  if (bucket.count > MAX_REQUESTS) return true;
  return false;
}

/** Prevent unbounded memory growth in long-running processes */
export function pruneRateLimitBuckets() {
  const now = Date.now();
  Array.from(buckets.entries()).forEach(([key, bucket]) => {
    if (now > bucket.resetAt) buckets.delete(key);
  });
}
