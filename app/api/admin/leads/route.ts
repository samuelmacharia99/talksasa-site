import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { listLeads, updateLeadStatus } from "@/lib/admin/leads-query";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(request: Request) {
  if (!isAdminAuthenticated()) return unauthorized();

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") || "1");
  const type = searchParams.get("type") || undefined;

  const result = listLeads(page, 25, type ?? undefined);
  return NextResponse.json(result);
}

export async function PATCH(request: Request) {
  if (!isAdminAuthenticated()) return unauthorized();

  let body: { id?: string; status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.id || !body.status) {
    return NextResponse.json({ error: "id and status are required" }, { status: 400 });
  }

  const updated = updateLeadStatus(body.id, body.status);
  if (!updated) {
    return NextResponse.json({ error: "Lead not found or invalid status" }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
