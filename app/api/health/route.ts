import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Lightweight liveness check — does not touch MySQL. */
export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "talksasa-site",
    time: new Date().toISOString(),
  });
}
