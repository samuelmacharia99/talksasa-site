import { NextResponse } from "next/server";
import { fetchResellerPackages } from "@/lib/billing-api";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cycle = searchParams.get("cycle") === "annual" ? "annual" : "monthly";
    const data = await fetchResellerPackages(cycle);
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load reseller packages";
    const status = message.includes("not configured") ? 503 : 502;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
