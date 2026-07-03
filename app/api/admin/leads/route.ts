import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import {
  listLeads,
  updateLeadStatus,
  deleteLead,
  getLeadStats,
  exportLeadsCsv,
} from "@/lib/admin/leads-query";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(request: Request) {
  if (!isAdminAuthenticated()) return unauthorized();

  const { searchParams } = new URL(request.url);

  if (searchParams.get("action") === "stats") {
    const stats = await getLeadStats();
    return NextResponse.json(stats);
  }

  if (searchParams.get("action") === "export") {
    const csv = await exportLeadsCsv({
      type: searchParams.get("type") || undefined,
      status: searchParams.get("status") || undefined,
      search: searchParams.get("search") || undefined,
      dateFrom: searchParams.get("dateFrom") || undefined,
      dateTo: searchParams.get("dateTo") || undefined,
    });
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="talksasa-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  const page = Number(searchParams.get("page") || "1");
  const type = searchParams.get("type") || undefined;
  const result = await listLeads(page, 25, type, {
    status: searchParams.get("status") || undefined,
    search: searchParams.get("search") || undefined,
    dateFrom: searchParams.get("dateFrom") || undefined,
    dateTo: searchParams.get("dateTo") || undefined,
  });
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

  const updated = await updateLeadStatus(body.id, body.status);
  if (!updated) {
    return NextResponse.json({ error: "Lead not found or invalid status" }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  if (!isAdminAuthenticated()) return unauthorized();

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const deleted = await deleteLead(id);
  if (!deleted) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
