import Script from "next/script";
import type { ReactNode } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Check } from "lucide-react";
import type { ProductPageContent } from "@/lib/cloud-content";
import { BRAND, faqJsonLd } from "@/lib/cloud-content";
import { ProductPageHero } from "@/components/product-page-hero";
import { ProductCtaSection } from "@/components/tracked-link";
import { SITE_URL } from "@/lib/urls";

type ProductLandingProps = {
  page: ProductPageContent;
  relatedFaqs?: { question: string; answer: string }[];
  afterHero?: ReactNode;
};

export function ProductLanding({ page, relatedFaqs, afterHero }: ProductLandingProps) {
  const faqs = relatedFaqs ?? [];
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: page.headline, item: `${SITE_URL}${page.path}` },
    ],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.headline,
    description: page.metaDescription,
    provider: { "@type": "Organization", name: BRAND, url: SITE_URL },
    areaServed: "Kenya",
  };

  return (
    <div className="min-h-screen bg-background">
      <Script
        id={`breadcrumb-${page.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id={`service-${page.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      {faqs.length > 0 && (
        <Script
          id={`faq-${page.slug}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs)) }}
        />
      )}
      <Navbar />
      <main id="main-content" className="pb-20">
        <ProductPageHero page={page} />

        {afterHero}

        <section className="border-y border-border bg-muted/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-2xl font-bold tracking-tight mb-8">What you get</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
              {page.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 rounded-xl glass border border-border p-4"
                >
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" aria-hidden />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {faqs.length > 0 && (
          <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight mb-8">Common questions</h2>
            <dl className="space-y-6">
              {faqs.map((item) => (
                <div key={item.question}>
                  <dt className="font-semibold text-foreground">{item.question}</dt>
                  <dd className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <ProductCtaSection
          primaryLabel={page.ctaPrimary.label}
          primaryHref={page.ctaPrimary.href}
          primaryExternal={page.ctaPrimary.external}
          trackId={`product_${page.slug}_primary`}
        />
      </main>
      <Footer />
    </div>
  );
}
