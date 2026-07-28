import dynamic from "next/dynamic";
import Script from "next/script";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { BrandPillars } from "@/components/brand-pillars";
import { Features } from "@/components/features";
import { CloudFaqSection } from "@/components/cloud-faq";
import { CTA } from "@/components/cta";
import { CTASupport } from "@/components/cta-support";
import { Footer } from "@/components/footer";
import { SITE_URL } from "@/lib/urls";
import { CONTACT } from "@/lib/contact";
import { FAQ_ITEMS, faqJsonLd } from "@/lib/cloud-content";

function SectionFallback({ minHeight = "320px" }: { minHeight?: string }) {
  return (
    <div
      className="section-py container mx-auto px-4 sm:px-6 lg:px-8"
      style={{ minHeight }}
      aria-hidden
    />
  );
}

const TrustIndicators = dynamic(
  () => import("@/components/trust-indicators").then((m) => ({ default: m.TrustIndicators })),
  { loading: () => <SectionFallback minHeight="360px" /> }
);
const UseCases = dynamic(
  () => import("@/components/use-cases").then((m) => ({ default: m.UseCases })),
  { loading: () => <SectionFallback minHeight="400px" /> }
);
const ResellerProgram = dynamic(
  () => import("@/components/reseller-program").then((m) => ({ default: m.ResellerProgram })),
  { loading: () => <SectionFallback minHeight="480px" /> }
);
const Pricing = dynamic(
  () => import("@/components/pricing").then((m) => ({ default: m.Pricing })),
  { loading: () => <SectionFallback minHeight="520px" /> }
);
const ContactSection = dynamic(
  () => import("@/components/contact-section").then((m) => ({ default: m.ContactSection })),
  { loading: () => <SectionFallback minHeight="360px" /> }
);

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
    "Talksasa SMS, Talksasa Mail, and Talksasa Cloud — enterprise communications and cloud infrastructure for Kenya and East Africa.",
  provider: {
    "@type": "Organization",
    name: "TalkSasa",
    url: SITE_URL,
    address: {
      "@type": "PostalAddress",
      streetAddress: CONTACT.address.streetAddress,
      addressLocality: CONTACT.address.city,
      addressCountry: "KE",
    },
  },
  areaServed: ["Kenya", "Tanzania", "Uganda", "Rwanda"],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "TalkSasa Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Talksasa SMS",
          description: "Bulk SMS gateway for marketing, alerts, OTP/2FA, and REST API",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Talksasa Mail",
          description: "Business email on your domain with webmail and DKIM/SPF helpers",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Talksasa Cloud",
          description: "Application hosting, VPS, dedicated servers, and reseller platform",
        },
      },
    ],
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Script id="breadcrumb-schema-home" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Script id="service-schema-home" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <Script id="faq-schema-home" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQ_ITEMS)) }} />
      <Navbar />
      <main id="main-content" role="main">
        <Hero />
        <BrandPillars />
        <TrustIndicators />
        <Features />
        <UseCases />
        <Pricing />
        <ResellerProgram />
        <CloudFaqSection />
        <CTA />
        <CTASupport />
        <ContactSection />
        <Footer />
      </main>
    </div>
  );
}
