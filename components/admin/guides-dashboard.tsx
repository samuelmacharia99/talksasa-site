"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Eye,
  Loader2,
  LogOut,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  slugify,
  type GuideItem,
  type GuidesListResult,
} from "@/lib/admin/guides-shared";
import { MarkdownContent } from "@/components/guides/markdown-content";
import { formatDate } from "./shared";

type EditorState = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  status: "draft" | "published";
  seoTitle: string;
  seoDescription: string;
  ctaLabel: string;
  ctaHref: string;
  slugTouched: boolean;
};

const EMPTY_EDITOR: EditorState = {
  title: "",
  slug: "",
  excerpt: "",
  body: "",
  status: "draft",
  seoTitle: "",
  seoDescription: "",
  ctaLabel: "",
  ctaHref: "",
  slugTouched: false,
};

type GuidesDashboardProps = {
  initial: GuidesListResult;
};

export function GuidesDashboard({ initial }: GuidesDashboardProps) {
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  async function fetchGuides(page = 1, opts?: { status?: string; search?: string }) {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page) });
      const status = opts?.status ?? statusFilter;
      const q = opts?.search ?? search;
      if (status) params.set("status", status);
      if (q.trim()) params.set("search", q.trim());
      const res = await fetch(`/api/admin/guides?${params}`);
      if (res.status === 401) {
        window.location.reload();
        return;
      }
      if (!res.ok) throw new Error("Failed to load guides");
      setData(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load guides");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditor({ ...EMPTY_EDITOR });
    setShowPreview(false);
    setError(null);
  }

  function openEdit(guide: GuideItem) {
    setEditor({
      id: guide.id,
      title: guide.title,
      slug: guide.slug,
      excerpt: guide.excerpt,
      body: guide.body,
      status: guide.status,
      seoTitle: guide.seoTitle || "",
      seoDescription: guide.seoDescription || "",
      ctaLabel: guide.ctaLabel || "",
      ctaHref: guide.ctaHref || "",
      slugTouched: true,
    });
    setShowPreview(false);
    setError(null);
  }

  function updateField<K extends keyof EditorState>(key: K, value: EditorState[K]) {
    setEditor((prev) => {
      if (!prev) return prev;
      const next = { ...prev, [key]: value };
      if (key === "title" && !prev.slugTouched && typeof value === "string") {
        next.slug = slugify(value);
      }
      if (key === "slug") {
        next.slugTouched = true;
      }
      return next;
    });
  }

  async function saveGuide(nextStatus?: "draft" | "published") {
    if (!editor) return;
    if (!editor.title.trim() || !editor.excerpt.trim() || !editor.body.trim()) {
      setError("Title, excerpt, and body are required");
      return;
    }

    setSaving(true);
    setError(null);
    const payload = {
      title: editor.title.trim(),
      slug: editor.slug.trim() || slugify(editor.title),
      excerpt: editor.excerpt.trim(),
      body: editor.body,
      status: nextStatus || editor.status,
      seoTitle: editor.seoTitle.trim() || null,
      seoDescription: editor.seoDescription.trim() || null,
      ctaLabel: editor.ctaLabel.trim() || null,
      ctaHref: editor.ctaHref.trim() || null,
    };

    try {
      const res = await fetch(
        editor.id ? `/api/admin/guides/${editor.id}` : "/api/admin/guides",
        {
          method: editor.id ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (res.status === 401) {
        window.location.reload();
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setEditor({
        id: data.id,
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        body: data.body,
        status: data.status,
        seoTitle: data.seoTitle || "",
        seoDescription: data.seoDescription || "",
        ctaLabel: data.ctaLabel || "",
        ctaHref: data.ctaHref || "",
        slugTouched: true,
      });
      await fetchGuides(data.page ?? 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this guide permanently?")) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/guides/${id}`, { method: "DELETE" });
      if (res.status === 401) {
        window.location.reload();
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Delete failed");
      }
      setEditor(null);
      await fetchGuides(1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  }

  const totalPages = Math.max(1, Math.ceil(data.total / data.pageSize));
  const previewBody = useMemo(() => editor?.body || "", [editor?.body]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Guides CMS
            </h1>
            <p className="text-sm text-muted-foreground">
              {data.total} guide{data.total === 1 ? "" : "s"} · Markdown publishing
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild type="button" variant="outline" size="sm">
              <Link href="/admin/leads">
                <Users className="h-4 w-4 mr-1" /> Leads CRM
              </Link>
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {editor ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setEditor(null)}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to list
              </Button>
              <div className="flex-1" />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowPreview((v) => !v)}
              >
                {showPreview ? <Pencil className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                {showPreview ? "Edit" : "Preview"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={saving}
                onClick={() => saveGuide("draft")}
              >
                {saving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : null}
                Save draft
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={saving}
                onClick={() => saveGuide("published")}
              >
                Publish
              </Button>
              {editor.id && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={saving}
                  className="text-red-400 border-red-500/30"
                  onClick={() => handleDelete(editor.id!)}
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              )}
            </div>

            {showPreview ? (
              <article className="rounded-2xl border border-border bg-muted/10 p-6 sm:p-8 space-y-4">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  {editor.status} preview
                </div>
                <h2 className="text-3xl font-bold tracking-tight">{editor.title || "Untitled"}</h2>
                {editor.excerpt && (
                  <p className="text-muted-foreground text-lg">{editor.excerpt}</p>
                )}
                <MarkdownContent content={previewBody || "*No content yet*"} />
              </article>
            ) : (
              <div className="grid lg:grid-cols-2 gap-4">
                <div className="space-y-3 rounded-2xl border border-border bg-muted/10 p-4">
                  <Field label="Title">
                    <input
                      value={editor.title}
                      onChange={(e) => updateField("title", e.target.value)}
                      className="w-full rounded-lg bg-background border border-border px-3 py-2 text-sm"
                      placeholder="How to register a .co.ke domain"
                    />
                  </Field>
                  <Field label="Slug">
                    <input
                      value={editor.slug}
                      onChange={(e) => updateField("slug", e.target.value)}
                      className="w-full rounded-lg bg-background border border-border px-3 py-2 text-sm font-mono"
                      placeholder="how-to-register-co-ke-domain"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Public URL: /guides/{editor.slug || "slug"}
                    </p>
                  </Field>
                  <Field label="Excerpt">
                    <textarea
                      value={editor.excerpt}
                      onChange={(e) => updateField("excerpt", e.target.value)}
                      rows={3}
                      className="w-full rounded-lg bg-background border border-border px-3 py-2 text-sm"
                      placeholder="Short summary for listings and meta description"
                    />
                  </Field>
                  <Field label="Markdown body">
                    <textarea
                      value={editor.body}
                      onChange={(e) => updateField("body", e.target.value)}
                      rows={18}
                      className="w-full rounded-lg bg-background border border-border px-3 py-2 text-sm font-mono"
                      placeholder={"## Introduction\n\nWrite your guide in Markdown..."}
                    />
                  </Field>
                </div>

                <div className="space-y-3 rounded-2xl border border-border bg-muted/10 p-4">
                  <Field label="SEO title (optional)">
                    <input
                      value={editor.seoTitle}
                      onChange={(e) => updateField("seoTitle", e.target.value)}
                      className="w-full rounded-lg bg-background border border-border px-3 py-2 text-sm"
                      placeholder="Overrides page title if set"
                    />
                  </Field>
                  <Field label="SEO description (optional)">
                    <textarea
                      value={editor.seoDescription}
                      onChange={(e) => updateField("seoDescription", e.target.value)}
                      rows={3}
                      className="w-full rounded-lg bg-background border border-border px-3 py-2 text-sm"
                      placeholder="Defaults to excerpt"
                    />
                  </Field>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Field label="CTA label">
                      <input
                        value={editor.ctaLabel}
                        onChange={(e) => updateField("ctaLabel", e.target.value)}
                        className="w-full rounded-lg bg-background border border-border px-3 py-2 text-sm"
                        placeholder="Get bulk SMS"
                      />
                    </Field>
                    <Field label="CTA link">
                      <input
                        value={editor.ctaHref}
                        onChange={(e) => updateField("ctaHref", e.target.value)}
                        className="w-full rounded-lg bg-background border border-border px-3 py-2 text-sm"
                        placeholder="/bulk-sms"
                      />
                    </Field>
                  </div>
                  <Field label="Status">
                    <select
                      value={editor.status}
                      onChange={(e) =>
                        updateField("status", e.target.value as "draft" | "published")
                      }
                      className="w-full rounded-lg bg-background border border-border px-3 py-2 text-sm"
                    >
                      <option value="draft">draft</option>
                      <option value="published">published</option>
                    </select>
                  </Field>
                  <div className="rounded-xl border border-border bg-background/50 p-4">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
                      Live preview
                    </p>
                    <MarkdownContent content={previewBody || "*Start writing...*"} />
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search title or slug..."
                className="flex-1 rounded-lg bg-background border border-border px-3 py-2 text-sm"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg bg-background border border-border px-3 py-2 text-sm"
              >
                <option value="">All statuses</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={loading}
                onClick={() => fetchGuides(1)}
              >
                <RefreshCw className={cn("h-4 w-4 mr-1", loading && "animate-spin")} />
                Refresh
              </Button>
              <Button type="button" size="sm" onClick={openCreate}>
                <Plus className="h-4 w-4 mr-1" /> New guide
              </Button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30 text-left">
                    <th className="px-3 py-3 font-medium">Title</th>
                    <th className="px-3 py-3 font-medium">Status</th>
                    <th className="px-3 py-3 font-medium">Updated</th>
                    <th className="px-3 py-3 font-medium">Published</th>
                  </tr>
                </thead>
                <tbody>
                  {data.guides.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-3 py-10 text-center text-muted-foreground">
                        No guides yet. Create your first Markdown guide.
                      </td>
                    </tr>
                  ) : (
                    data.guides.map((guide) => (
                      <tr
                        key={guide.id}
                        className="border-b border-border/60 hover:bg-muted/20 cursor-pointer"
                        onClick={() => openEdit(guide)}
                      >
                        <td className="px-3 py-3">
                          <div className="font-medium">{guide.title}</div>
                          <div className="text-xs text-muted-foreground font-mono">
                            /guides/{guide.slug}
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <span
                            className={cn(
                              "inline-flex rounded-md border px-2 py-0.5 text-xs capitalize",
                              guide.status === "published"
                                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                                : "bg-amber-500/15 text-amber-400 border-amber-500/30"
                            )}
                          >
                            {guide.status}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-muted-foreground text-xs">
                          {formatDate(guide.updatedAt)}
                        </td>
                        <td className="px-3 py-3 text-muted-foreground text-xs">
                          {guide.publishedAt ? formatDate(guide.publishedAt) : "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={data.page <= 1 || loading}
                  onClick={() => fetchGuides(data.page - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {data.page} of {totalPages}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={data.page >= totalPages || loading}
                  onClick={() => fetchGuides(data.page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </span>
      {children}
    </label>
  );
}
