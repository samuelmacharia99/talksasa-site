import type { Metadata } from "next";
import Script from "next/script";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BookDemoForm } from "@/components/book-demo-form";
import { CalendarCheck, MessageCircle, Video } from "lucide-react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://talksasa.com";

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    { "@type": "ListItem", position: 2, name: "Book a Demo", item: `${SITE_URL}/book-demo` },
  ],
};

export const metadata: Metadata = {
  title: "Book a Demo | Bulk SMS, Hosting & Cloud",
  description:
    "Schedule a free TalkSasa product demo. Pick your preferred date and time, choose bulk SMS, hosting, application hosting, or reseller products, and send your request via WhatsApp.",
  keywords: [
    "book TalkSasa demo",
    "TalkSasa demo Kenya",
    "bulk SMS demo",
    "hosting demo Nairobi",
    "schedule product demo",
  ],
  openGraph: {
    title: "Book a Demo",
    description:
      "Choose your product, pick a date and time, and send your demo request to our team on WhatsApp.",
    url: `${SITE_URL}/book-demo`,
  },
  alternates: {
    canonical: `${SITE_URL}/book-demo`,
  },
};

const highlights = [
  {
    icon: Video,
    title: "Live walkthrough",
    text: "See the portal, APIs, and billing flow tailored to your product choice.",
  },
  {
    icon: CalendarCheck,
    title: "Pick your slot",
    text: "Choose month, day, and time that works for you — we confirm on WhatsApp.",
  },
  {
    icon: MessageCircle,
    title: "Instant handoff",
    text: "Your details are sent straight to our sales team — no waiting for callbacks.",
  },
];

export default function BookDemoPage() {
  return (
    <div className="min-h-screen bg-background">
      <Script
        id="breadcrumb-schema-book-demo"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Navbar />
      <main id="main-content" className="pt-24 pb-20">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Book a <span className="gradient-text">demo</span>
            </h1>
            <p className="mt-4 text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
              Tell us which TalkSasa product you want to explore, pick your preferred date and time,
              and send the request to our team on WhatsApp.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="rounded-xl glass border border-border p-4 text-center sm:text-left"
              >
                <item.icon className="h-5 w-5 text-primary mx-auto sm:mx-0 mb-2" />
                <h2 className="text-sm font-semibold text-foreground">{item.title}</h2>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <BookDemoForm />
        </section>
      </main>
      <Footer />
    </div>
  );
}
