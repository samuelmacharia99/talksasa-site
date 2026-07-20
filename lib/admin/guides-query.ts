import { and, desc, eq, like, ne, or, sql } from "drizzle-orm";
import type { ResultSetHeader } from "mysql2";
import { randomUUID } from "crypto";
import { getDb } from "@/lib/db";
import { guides, type Guide } from "@/lib/db/schema";

export type GuideItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  status: "draft" | "published";
  seoTitle: string | null;
  seoDescription: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type GuidesListResult = {
  guides: GuideItem[];
  total: number;
  page: number;
  pageSize: number;
};

export type GuideInput = {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  status?: "draft" | "published";
  seoTitle?: string | null;
  seoDescription?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
};

function mapGuide(row: Guide): GuideItem {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    body: row.body,
    status: row.status,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    ctaLabel: row.ctaLabel,
    ctaHref: row.ctaHref,
    publishedAt: row.publishedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 160);
}

function normalizeSlug(slug: string): string {
  const cleaned = slugify(slug);
  return cleaned || "guide";
}

function emptyToNull(value: string | null | undefined): string | null {
  if (value == null) return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export async function listGuides(
  page = 1,
  pageSize = 25,
  filters?: { status?: string; search?: string }
): Promise<GuidesListResult> {
  const db = await getDb();
  const safePage = Math.max(1, page);
  const safeSize = Math.min(100, Math.max(1, pageSize));
  const offset = (safePage - 1) * safeSize;

  const conditions = [];
  if (filters?.status === "draft" || filters?.status === "published") {
    conditions.push(eq(guides.status, filters.status));
  }
  if (filters?.search?.trim()) {
    const term = `%${filters.search.trim()}%`;
    conditions.push(
      or(like(guides.title, term), like(guides.slug, term), like(guides.excerpt, term))
    );
  }
  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const rows = await db
    .select()
    .from(guides)
    .where(where)
    .orderBy(desc(guides.updatedAt))
    .limit(safeSize)
    .offset(offset);

  const [countRow] = await db
    .select({ count: sql<number>`count(*)` })
    .from(guides)
    .where(where);

  return {
    guides: rows.map(mapGuide),
    total: Number(countRow?.count ?? 0),
    page: safePage,
    pageSize: safeSize,
  };
}

export async function getGuideById(id: string): Promise<GuideItem | null> {
  const db = await getDb();
  const rows = await db.select().from(guides).where(eq(guides.id, id)).limit(1);
  return rows[0] ? mapGuide(rows[0]) : null;
}

export async function getGuideBySlug(
  slug: string,
  options?: { publishedOnly?: boolean }
): Promise<GuideItem | null> {
  const db = await getDb();
  const conditions = [eq(guides.slug, slug)];
  if (options?.publishedOnly) {
    conditions.push(eq(guides.status, "published"));
  }
  const rows = await db
    .select()
    .from(guides)
    .where(and(...conditions))
    .limit(1);
  return rows[0] ? mapGuide(rows[0]) : null;
}

export async function listPublishedGuides(): Promise<GuideItem[]> {
  const db = await getDb();
  const rows = await db
    .select()
    .from(guides)
    .where(eq(guides.status, "published"))
    .orderBy(desc(guides.publishedAt), desc(guides.updatedAt));
  return rows.map(mapGuide);
}

async function ensureUniqueSlug(slug: string, excludeId?: string): Promise<string> {
  const db = await getDb();
  let candidate = normalizeSlug(slug);
  let suffix = 2;

  while (true) {
    const conditions = [eq(guides.slug, candidate)];
    if (excludeId) conditions.push(ne(guides.id, excludeId));
    const existing = await db
      .select({ id: guides.id })
      .from(guides)
      .where(and(...conditions))
      .limit(1);
    if (existing.length === 0) return candidate;
    const base = normalizeSlug(slug).slice(0, 150);
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
}

export async function createGuide(input: GuideInput): Promise<GuideItem> {
  const db = await getDb();
  const now = new Date().toISOString();
  const status = input.status === "published" ? "published" : "draft";
  const slug = await ensureUniqueSlug(input.slug || input.title);
  const id = randomUUID();

  const row: Guide = {
    id,
    slug,
    title: input.title.trim(),
    excerpt: input.excerpt.trim(),
    body: input.body,
    status,
    seoTitle: emptyToNull(input.seoTitle),
    seoDescription: emptyToNull(input.seoDescription),
    ctaLabel: emptyToNull(input.ctaLabel),
    ctaHref: emptyToNull(input.ctaHref),
    publishedAt: status === "published" ? now : null,
    createdAt: now,
    updatedAt: now,
  };

  await db.insert(guides).values(row);
  return mapGuide(row);
}

export async function updateGuide(
  id: string,
  input: Partial<GuideInput>
): Promise<GuideItem | null> {
  const db = await getDb();
  const existing = await getGuideById(id);
  if (!existing) return null;

  const now = new Date().toISOString();
  const nextStatus =
    input.status === "published" || input.status === "draft"
      ? input.status
      : existing.status;

  let slug = existing.slug;
  if (input.slug !== undefined || input.title !== undefined) {
    slug = await ensureUniqueSlug(
      input.slug?.trim() || input.title?.trim() || existing.slug,
      id
    );
  }

  let publishedAt = existing.publishedAt;
  if (nextStatus === "published" && !publishedAt) {
    publishedAt = now;
  }
  if (nextStatus === "draft") {
    publishedAt = null;
  }

  const patch = {
    title: input.title !== undefined ? input.title.trim() : existing.title,
    slug,
    excerpt: input.excerpt !== undefined ? input.excerpt.trim() : existing.excerpt,
    body: input.body !== undefined ? input.body : existing.body,
    status: nextStatus as Guide["status"],
    seoTitle:
      input.seoTitle !== undefined ? emptyToNull(input.seoTitle) : existing.seoTitle,
    seoDescription:
      input.seoDescription !== undefined
        ? emptyToNull(input.seoDescription)
        : existing.seoDescription,
    ctaLabel:
      input.ctaLabel !== undefined ? emptyToNull(input.ctaLabel) : existing.ctaLabel,
    ctaHref:
      input.ctaHref !== undefined ? emptyToNull(input.ctaHref) : existing.ctaHref,
    publishedAt,
    updatedAt: now,
  };

  await db.update(guides).set(patch).where(eq(guides.id, id));
  return getGuideById(id);
}

export async function deleteGuide(id: string): Promise<boolean> {
  const db = await getDb();
  const [result] = await db.delete(guides).where(eq(guides.id, id));
  const header = result as ResultSetHeader;
  return header.affectedRows > 0;
}
