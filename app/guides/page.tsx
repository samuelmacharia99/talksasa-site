import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { listPublishedGuides } from "@/lib/admin/guides-query";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://talksasa.com";

export const metadata: Metadata = {
  title: "Guides — Hosting, Domains & Bulk SMS in Kenya",
  description:
    "Practical TalkSasa guides on .co.ke domains, bulk SMS, M-Pesa hosting payments, VPS, and reseller setup for Kenyan and East African businesses.",
  openGraph: {
    title: "Guides — Hosting, Domains & Bulk SMS in Kenya",
    description:
      "How-to guides for domains, bulk SMS, hosting, and reseller growth with TalkSasa.",
    url: `${SITE_URL}/guides`,
  },
  alternates: {
    canonical: `${SITE_URL}/guides`,
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Guides", item: `${SITE_URL}/guides` },
  ],
};

function formatGuideDate(iso: string | null) {
  if (!iso) return null;
  try {
    return new Intl.DateTimeFormat("en-KE", {
      dateStyle: "medium",
      timeZone: "Africa/Nairobi",
    }).format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
}

export default async function GuidesIndexPage() {
  const guides = await listPublishedGuides();

  return (
    <div className="min-h-screen bg-background">
      <Script
        id="breadcrumb-schema-guides"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Navbar />
      <main id="main-content" className="pt-24 pb-20">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            TalkSasa <span className="gradient-text">Guides</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            Practical how-tos for domains, bulk SMS, hosting, and growing your digital business in Kenya.
          </p>

          {guides.length === 0 ? (
            <div className="mt-12 rounded-2xl border border-border bg-muted/10 p-8 text-center">
              <p className="text-muted-foreground">
                Guides are coming soon. In the meantime, explore{" "}
                <Link href="/bulk-sms" className="text-primary hover:underline">
                  bulk SMS
                </Link>
                ,{" "}
                <Link href="/domains" className="text-primary hover:underline">
                  domains
                </Link>
                , or{" "}
                <Link href="/web-hosting" className="text-primary hover:underline">
                  web hosting
                </Link>
                .
              </p>
            </div>
          ) : (
            <ul className="mt-12 space-y-4">
              {guides.map((guide) => {
                const date = formatGuideDate(guide.publishedAt || guide.updatedAt);
                return (
                  <li key={guide.id}>
                    <Link
                      href={`/guides/${guide.slug}`}
                      className="block rounded-2xl border border-border bg-muted/10 p-6 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
                        <h2 className="text-xl font-semibold text-foreground">{guide.title}</h2>
                        {date && (
                          <time className="text-xs text-muted-foreground whitespace-nowrap" dateTime={guide.publishedAt || guide.updatedAt}>
                            {date}
                          </time>
                        )}
                      </div>
                      <p className="mt-2 text-muted-foreground">{guide.excerpt}</p>
                      <span className="mt-3 inline-block text-sm text-primary">Read guide →</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
