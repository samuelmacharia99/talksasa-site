import { NextResponse } from "next/server";
import { fetchServices } from "@/lib/billing-api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await fetchServices();
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load services";
    const status = message.includes("not configured") ? 503 : 502;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
