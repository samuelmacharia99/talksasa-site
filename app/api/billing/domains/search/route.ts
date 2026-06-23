import { NextResponse } from "next/server";
import { searchDomains } from "@/lib/billing-api";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim() || "";
    const period = Number(searchParams.get("period") || "1");

    if (!q || q.length < 2) {
      return NextResponse.json(
        { success: false, error: "Enter at least 2 characters to search" },
        { status: 400 }
      );
    }

    const data = await searchDomains(q, period);
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Domain search failed";
    const status = message.includes("not configured") ? 503 : 502;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
