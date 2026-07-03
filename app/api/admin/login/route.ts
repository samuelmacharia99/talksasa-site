import { createHash } from "crypto";
import { NextResponse } from "next/server";
import {
  createSessionToken,
  isAdminConfigured,
  sessionCookieOptions,
  verifyPassword,
} from "@/lib/admin/auth";
import { isLoginRateLimited } from "@/lib/admin/login-rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "Admin is not configured" }, { status: 503 });
  }

  const ip = getClientIp(request);
  const rateKey = createHash("sha256").update(`admin-login:${ip}`).digest("hex").slice(0, 24);
  if (isLoginRateLimited(rateKey)) {
    return NextResponse.json({ error: "Too many login attempts" }, { status: 429 });
  }

  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const password = typeof body.password === "string" ? body.password : "";
  if (!verifyPassword(password)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = createSessionToken();
  const response = NextResponse.json({ success: true });
  const cookie = sessionCookieOptions(token);
  response.cookies.set(cookie);
  return response;
}
