import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import {
  createGuide,
  listGuides,
  type GuideInput,
} from "@/lib/admin/guides-query";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function validateGuideBody(body: Partial<GuideInput>): string | null {
  if (!body.title?.trim()) return "title is required";
  if (!body.excerpt?.trim()) return "excerpt is required";
  if (body.body == null || !String(body.body).trim()) return "body is required";
  if (body.status && body.status !== "draft" && body.status !== "published") {
    return "status must be draft or published";
  }
  return null;
}

export async function GET(request: Request) {
  if (!isAdminAuthenticated()) return unauthorized();

  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") || "1");
  const result = await listGuides(page, 25, {
    status: searchParams.get("status") || undefined,
    search: searchParams.get("search") || undefined,
  });
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  if (!isAdminAuthenticated()) return unauthorized();

  let body: Partial<GuideInput>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const error = validateGuideBody(body);
  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  const guide = await createGuide({
    title: body.title!,
    slug: body.slug || body.title!,
    excerpt: body.excerpt!,
    body: body.body!,
    status: body.status,
    seoTitle: body.seoTitle,
    seoDescription: body.seoDescription,
    ctaLabel: body.ctaLabel,
    ctaHref: body.ctaHref,
  });

  return NextResponse.json(guide, { status: 201 });
}
