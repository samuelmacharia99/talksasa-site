import Script from "next/script";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import type { ProductPageContent } from "@/lib/cloud-content";
import { BRAND, faqJsonLd } from "@/lib/cloud-content";
import { ProductPageHero } from "@/components/product-page-hero";
import { SITE_URL } from "@/lib/urls";

type ProductLandingProps = {
  page: ProductPageContent;
  relatedFaqs?: { question: string; answer: string }[];
};

export function ProductLanding({ page, relatedFaqs }: ProductLandingProps) {
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

        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl font-bold tracking-tight">Ready to get started?</h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Create your account, search your domain, or talk to our team about reseller packages.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center">
            <Button asChild size="lg" className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 border-0">
              {page.ctaPrimary.external ? (
                <a href={page.ctaPrimary.href} target="_blank" rel="noopener noreferrer">
                  {page.ctaPrimary.label}
                </a>
              ) : (
                <Link href={page.ctaPrimary.href}>{page.ctaPrimary.label}</Link>
              )}
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/contact">Contact sales</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
