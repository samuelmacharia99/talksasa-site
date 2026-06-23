import { NextResponse } from "next/server";
import { fetchDomainExtensions } from "@/lib/billing-api";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = Number(searchParams.get("period") || "1");
    const data = await fetchDomainExtensions(period);
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load domain extensions";
    const status = message.includes("not configured") ? 503 : 502;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
