import type { Metadata } from "next";
import Script from "next/script";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ContactForm } from "@/components/contact-form";
import { Mail, MapPin, Phone } from "lucide-react";

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
    {
      "@type": "ListItem",
      position: 2,
      name: "Contact",
      item: `${SITE_URL}/contact`,
    },
  ],
};

const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  mainEntity: {
    "@type": "Organization",
    name: "TalkSasa",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Nairobi",
      addressCountry: "KE",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+254712295880",
        contactType: "customer service",
        areaServed: "KE",
        availableLanguage: ["English", "Swahili"],
      },
      {
        "@type": "ContactPoint",
        telephone: "+254781000403",
        contactType: "sales",
        areaServed: "KE",
        availableLanguage: ["English", "Swahili"],
      },
    ],
    email: "info@talksasa.com",
  },
};

export const metadata: Metadata = {
  title: "Contact Us - TalkSasa | Nairobi, Kenya",
  description:
    "Contact TalkSasa in Nairobi, Kenya. Phone: +254 712 295 880, +254 781 000 403. Email: info@talksasa.com, sales@talksasa.com. 24/7 support for bulk SMS, web hosting, VPS, and cloud solutions across Kenya & East Africa.",
  keywords: [
    "contact TalkSasa",
    "TalkSasa Nairobi",
    "TalkSasa phone number",
    "TalkSasa email",
    "hosting support Kenya",
    "SMS support Kenya",
    "Nairobi hosting contact",
  ],
  openGraph: {
    title: "Contact TalkSasa - Nairobi, Kenya",
    description:
      "Contact TalkSasa in Nairobi, Kenya. Phone, email, and 24/7 support for bulk SMS and hosting services.",
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://talksasa.com"}/contact`,
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "https://talksasa.com"}/contact`,
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Script
        id="breadcrumb-schema-contact"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id="contact-page-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      <Navbar />
      <main id="main-content" className="pt-24 pb-20">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-center">
            Get in <span className="gradient-text">touch</span>
          </h1>
          <p className="mt-4 text-center text-muted-foreground max-w-xl mx-auto">
            Fill out the form below or use our support channels. We respond within 24 hours.
          </p>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <aside className="lg:col-span-1 space-y-6 order-2 lg:order-1">
            <div className="rounded-2xl glass border border-border p-6">
              <Mail className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-semibold text-foreground">Email</h3>
              <div className="space-y-1">
                <a href="mailto:info@talksasa.com" className="block text-muted-foreground hover:text-primary">
                  info@talksasa.com
                </a>
                <a href="mailto:sales@talksasa.com" className="block text-muted-foreground hover:text-primary">
                  sales@talksasa.com
                </a>
              </div>
            </div>
            <div className="rounded-2xl glass border border-border p-6">
              <Phone className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-semibold text-foreground">Phone</h3>
              <div className="space-y-1">
                <a href="tel:+254712295880" className="block text-muted-foreground hover:text-primary">
                  +254 712 295 880
                </a>
                <a href="tel:+254781000403" className="block text-muted-foreground hover:text-primary">
                  +254 781 000 403
                </a>
                <a href="tel:+254116723188" className="block text-muted-foreground hover:text-primary">
                  +254 116 723 188
                </a>
              </div>
            </div>
            <div className="rounded-2xl glass border border-border p-6">
              <MapPin className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-semibold text-foreground">Office</h3>
              <p className="text-muted-foreground">Nairobi, Kenya</p>
            </div>
          </aside>
          <div className="lg:col-span-2 order-1 lg:order-2">
            <ContactForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
