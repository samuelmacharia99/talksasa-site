/**
 * Run daily sales digest without curl (container-safe).
 * Usage: npm run cron:digest
 * Requires: CRON_SECRET, SMTP_*, NOTIFY_EMAIL_TO in .env
 */
import { loadEnv } from "./load-env.mjs";

loadEnv();

const secret = process.env.CRON_SECRET;
const base = (process.env.NEXT_PUBLIC_SITE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");

if (!secret) {
  console.error("CRON_SECRET is not set in environment");
  process.exit(1);
}

const url = `${base}/api/cron/digest`;

try {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${secret}` },
  });
  const body = await res.text();
  console.log(body);
  process.exit(res.ok ? 0 : 1);
} catch (err) {
  console.error("Digest request failed:", err instanceof Error ? err.message : err);
  process.exit(1);
}
