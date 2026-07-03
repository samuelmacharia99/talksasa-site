import { NextResponse } from "next/server";
import { clearSessionCookieOptions } from "@/lib/admin/auth";

export const runtime = "nodejs";

export async function POST() {
  const response = NextResponse.json({ success: true });
  const cookie = clearSessionCookieOptions();
  response.cookies.set(cookie);
  return response;
}
