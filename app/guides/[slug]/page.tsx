import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { MarkdownContent } from "@/components/guides/markdown-content";
import { getGuideBySlug } from "@/lib/admin/guides-query";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://talksasa.com";

type PageProps = {
  params: { slug: string };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const guide = await getGuideBySlug(params.slug, { publishedOnly: true });
  if (!guide) {
    return { title: "Guide not found", robots: { index: false } };
  }

  const title = guide.seoTitle || guide.title;
  const description = guide.seoDescription || guide.excerpt;
  const url = `${SITE_URL}/guides/${guide.slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: guide.publishedAt || undefined,
      modifiedTime: guide.updatedAt,
    },
    alternates: {
      canonical: url,
    },
  };
}

function formatGuideDate(iso: string | null) {
  if (!iso) return null;
  try {
    return new Intl.DateTimeFormat("en-KE", {
      dateStyle: "long",
      timeZone: "Africa/Nairobi",
    }).format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
}

export default async function GuideArticlePage({ params }: PageProps) {
  const guide = await getGuideBySlug(params.slug, { publishedOnly: true });
  if (!guide) notFound();

  const url = `${SITE_URL}/guides/${guide.slug}`;
  const published = guide.publishedAt || guide.createdAt;
  const dateLabel = formatGuideDate(published);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Guides", item: `${SITE_URL}/guides` },
      { "@type": "ListItem", position: 3, name: guide.title, item: url },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.seoDescription || guide.excerpt,
    datePublished: published,
    dateModified: guide.updatedAt,
    author: {
      "@type": "Organization",
      name: "TalkSasa",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "TalkSasa",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/st.png`,
      },
    },
    mainEntityOfPage: url,
  };

  const ctaIsExternal = Boolean(guide.ctaHref?.startsWith("http"));

  return (
    <div className="min-h-screen bg-background">
      <Script
        id="breadcrumb-schema-guide"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id="article-schema-guide"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Navbar />
      <main id="main-content" className="pt-24 pb-20">
        <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 max-w-3xl">
          <nav className="text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/guides" className="hover:text-foreground">
              Guides
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{guide.title}</span>
          </nav>

          <header className="mb-10">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-balance">
              {guide.title}
            </h1>
            {dateLabel && (
              <p className="mt-4 text-sm text-muted-foreground">
                Updated{" "}
                <time dateTime={published}>{dateLabel}</time>
              </p>
            )}
            <p className="mt-4 text-lg text-muted-foreground">{guide.excerpt}</p>
          </header>

          <MarkdownContent content={guide.body} />

          {guide.ctaLabel && guide.ctaHref && (
            <div className="mt-12 rounded-2xl border border-border bg-muted/10 p-6 text-center">
              <Button asChild size="lg">
                {ctaIsExternal ? (
                  <a href={guide.ctaHref} target="_blank" rel="noopener noreferrer">
                    {guide.ctaLabel}
                  </a>
                ) : (
                  <Link href={guide.ctaHref}>{guide.ctaLabel}</Link>
                )}
              </Button>
            </div>
          )}

          <div className="mt-10 pt-6 border-t border-border">
            <Link href="/guides" className="text-sm text-primary hover:underline">
              ← All guides
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
