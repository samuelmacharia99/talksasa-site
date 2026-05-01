import Script from "next/script";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Services } from "@/components/services";
import { TrustIndicators } from "@/components/trust-indicators";
import { Features } from "@/components/features";
import { UseCases } from "@/components/use-cases";
import { ResellerProgram } from "@/components/reseller-program";
import { SMSCalculator } from "@/components/sms-calculator";
import { ComparisonTable } from "@/components/comparison-table";
import { Pricing } from "@/components/pricing";
import { CTA } from "@/components/cta";
import { CTASupport } from "@/components/cta-support";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://talksasa.com";

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE_URL,
    },
  ],
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Digital Infrastructure Services",
  provider: {
    "@type": "LocalBusiness",
    name: "TalkSasa",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Nairobi",
      addressCountry: "KE",
    },
  },
  areaServed: {
    "@type": "Country",
    name: ["Kenya", "Tanzania", "Uganda", "Rwanda"],
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "TalkSasa Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Bulk SMS Gateway",
          description: "Reliable SMS gateway for Kenya and East Africa",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Web Hosting",
          description: "Fast SSD web hosting with cPanel and free SSL",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Domain Registration",
          description: "Register .co.ke, .com, and 100+ TLDs",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "VPS Hosting",
          description: "Scalable cloud VPS with dedicated resources",
        },
      },
    ],
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Script
        id="breadcrumb-schema-home"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id="service-schema-home"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <Navbar />
      <main id="main-content" role="main">
        <Hero />
        <Services />
        <TrustIndicators />
        <Features />
        <UseCases />
        <ResellerProgram />
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                SMS <span className="gradient-text">Cost Calculator</span>
              </h2>
              <p className="mt-2 text-muted-foreground">
                Estimate your monthly cost based on volume.
              </p>
            </div>
            <SMSCalculator />
          </div>
        </section>
        <ComparisonTable />
        <Pricing />
        <CTA />
        <CTASupport />
        <ContactSection />
        <Footer />
      </main>
    </div>
  );
}
