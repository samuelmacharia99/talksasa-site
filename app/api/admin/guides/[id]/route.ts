import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import {
  deleteGuide,
  getGuideById,
  updateGuide,
  type GuideInput,
} from "@/lib/admin/guides-query";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

type RouteContext = { params: { id: string } };

export async function GET(_request: Request, context: RouteContext) {
  if (!isAdminAuthenticated()) return unauthorized();

  const guide = await getGuideById(context.params.id);
  if (!guide) {
    return NextResponse.json({ error: "Guide not found" }, { status: 404 });
  }
  return NextResponse.json(guide);
}

export async function PATCH(request: Request, context: RouteContext) {
  if (!isAdminAuthenticated()) return unauthorized();

  let body: Partial<GuideInput>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.status && body.status !== "draft" && body.status !== "published") {
    return NextResponse.json({ error: "status must be draft or published" }, { status: 400 });
  }
  if (body.title !== undefined && !body.title.trim()) {
    return NextResponse.json({ error: "title cannot be empty" }, { status: 400 });
  }
  if (body.excerpt !== undefined && !body.excerpt.trim()) {
    return NextResponse.json({ error: "excerpt cannot be empty" }, { status: 400 });
  }
  if (body.body !== undefined && !String(body.body).trim()) {
    return NextResponse.json({ error: "body cannot be empty" }, { status: 400 });
  }

  const guide = await updateGuide(context.params.id, body);
  if (!guide) {
    return NextResponse.json({ error: "Guide not found" }, { status: 404 });
  }
  return NextResponse.json(guide);
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!isAdminAuthenticated()) return unauthorized();

  const deleted = await deleteGuide(context.params.id);
  if (!deleted) {
    return NextResponse.json({ error: "Guide not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
