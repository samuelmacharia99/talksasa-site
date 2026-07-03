import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { createLead } from "@/lib/leads/service";
import { isRateLimited, pruneRateLimitBuckets } from "@/lib/leads/rate-limit";
import { validateLeadPayload } from "@/lib/leads/validate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 12_000;

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

function isAllowedOrigin(request: Request): boolean {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://talksasa.com";
  let allowedHosts: string[];
  try {
    allowedHosts = [new URL(siteUrl).host, "localhost:3000", "127.0.0.1:3000"];
  } catch {
    allowedHosts = ["localhost:3000"];
  }

  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  if (!origin && !referer) return true;

  for (const value of [origin, referer]) {
    if (!value) continue;
    try {
      const host = new URL(value).host;
      if (allowedHosts.includes(host)) return true;
    } catch {
      // ignore malformed header
    }
  }

  return false;
}

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  const ip = getClientIp(request);
  const rateKey = createHash("sha256")
    .update(`${process.env.IP_HASH_SALT || "talksasa"}:${ip}`)
    .digest("hex")
    .slice(0, 24);

  pruneRateLimitBuckets();
  if (isRateLimited(rateKey)) {
    return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const validated = validateLeadPayload(body);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  try {
    const record = createLead(validated.data, ip);
    return NextResponse.json({
      success: true,
      id: record.id,
      redirect: `/thank-you?type=${validated.data.type}`,
    });
  } catch {
    return NextResponse.json({ error: "Could not save your request" }, { status: 500 });
  }
}
