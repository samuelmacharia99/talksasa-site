import Script from "next/script";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Services } from "@/components/services";
import { TrustIndicators } from "@/components/trust-indicators";
import { CustomerJourneySection } from "@/components/customer-journey";
import { Features } from "@/components/features";
import { UseCases } from "@/components/use-cases";
import { ResellerProgram } from "@/components/reseller-program";
import { Pricing } from "@/components/pricing";
import { CloudFaqSection } from "@/components/cloud-faq";
import { CTA } from "@/components/cta";
import { CTASupport } from "@/components/cta-support";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";
import { SITE_URL } from "@/lib/urls";
import { FAQ_ITEMS, faqJsonLd } from "@/lib/cloud-content";

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL }],
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "TalkSasa",
  description:
    "Talksasa Cloud hosting, domains, cloud apps, and reseller platform — plus Kenya's trusted bulk SMS gateway and API.",
  provider: {
    "@type": "Organization",
    name: "TalkSasa",
    url: SITE_URL,
    address: { "@type": "PostalAddress", addressLocality: "Nairobi", addressCountry: "KE" },
  },
  areaServed: ["Kenya", "Tanzania", "Uganda", "Rwanda"],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "TalkSasa Services",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Bulk SMS Gateway", description: "Marketing, alerts, OTP/2FA, and REST API" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Shared Web Hosting", description: "DirectAdmin shared hosting with auto-provisioning" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Domain Registration", description: ".co.ke, .com and global TLD registration" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Cloud App Hosting", description: "Laravel, Node.js container hosting" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "VPS and Dedicated Servers", description: "Root access servers" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "White-Label Reseller Hosting", description: "Branded hosting reseller platform" } },
    ],
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Script id="breadcrumb-schema-home" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Script id="service-schema-home" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <Script id="faq-schema-home" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQ_ITEMS)) }} />
      <Navbar />
      <main id="main-content" role="main">
        <Hero />
        <Services />
        <CustomerJourneySection />
        <TrustIndicators />
        <Features />
        <UseCases />
        <ResellerProgram />
        <Pricing />
        <CloudFaqSection />
        <CTA />
        <CTASupport />
        <ContactSection />
        <Footer />
      </main>
    </div>
  );
}
