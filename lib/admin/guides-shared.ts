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

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 160);
}
