import { NextResponse } from "next/server";
import { getMysqlConfig } from "@/lib/db/config";
import { getDb } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Checks MySQL connectivity (for admin / deploy diagnostics). */
export async function GET() {
  try {
    const config = getMysqlConfig();
    await getDb();
    return NextResponse.json({
      ok: true,
      database: config.database,
      host: config.host,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database unavailable";
    return NextResponse.json({ ok: false, error: message }, { status: 503 });
  }
}
