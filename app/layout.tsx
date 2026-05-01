import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ClientProviders } from "@/components/client-providers";
import { Analytics } from "@/components/analytics";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
  preload: true,
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
  preload: true,
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://talksasa.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "TalkSasa | Bulk SMS, Web Hosting & Cloud Solutions in Kenya",
    template: "%s | TalkSasa",
  },
  description:
    "Kenya's leading bulk SMS gateway, web hosting, domains, VPS & cloud solutions provider. Serving Nairobi, Mombasa, Kisumu, and across East Africa. Trusted by 2,100+ businesses. 99.9% uptime. 24/7 local support. Accept M-Pesa, Airtel Money, and bank transfers.",
  keywords: [
    "bulk SMS Kenya",
    "SMS gateway Kenya",
    "bulk SMS Nairobi",
    "bulk SMS East Africa",
    "SMS API Kenya",
    "web hosting Kenya",
    "web hosting Nairobi",
    "web hosting East Africa",
    "Kenya web hosting",
    "Tanzania web hosting",
    "Uganda web hosting",
    "Rwanda web hosting",
    "domain registration Kenya",
    ".co.ke domain",
    "domain registration Nairobi",
    "VPS hosting Kenya",
    "VPS Nairobi",
    "cloud VPS Kenya",
    "dedicated servers Kenya",
    "cloud solutions Kenya",
    "cloud hosting East Africa",
    "cPanel hosting Kenya",
    "WordPress hosting Kenya",
    "reseller hosting Kenya",
    "email hosting Kenya",
    "SSL certificate Kenya",
    "TalkSasa",
    "Talksasa Kenya",
    "Talksasa Nairobi",
    "Talksasa East Africa",
    "affordable hosting Kenya",
    "M-Pesa payment hosting",
    "local hosting provider Kenya",
    "business SMS Kenya",
    "marketing SMS Kenya",
    "SMS marketing East Africa",
  ],
  authors: [{ name: "TalkSasa", url: SITE_URL }],
  creator: "TalkSasa",
  openGraph: {
    type: "website",
    locale: "en_KE",
    alternateLocale: ["en_TZ", "en_UG", "en_RW", "sw_KE"],
    url: SITE_URL,
    siteName: "TalkSasa",
    title: "TalkSasa | Bulk SMS, Web Hosting & Cloud Solutions in Kenya & East Africa",
    description:
      "Kenya's leading bulk SMS gateway, web hosting, domains, VPS & cloud solutions provider. Serving Nairobi, Mombasa, Kisumu, and across East Africa. Trusted by 2,100+ businesses. 99.9% uptime. 24/7 local support.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TalkSasa - Digital Infrastructure Partner for Kenya & East Africa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TalkSasa | Bulk SMS, Web Hosting & Cloud Solutions in Kenya",
    description:
      "Reliable bulk SMS gateway, web hosting, domains, VPS & cloud solutions. Trusted by 2,100+ businesses.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      "en-KE": SITE_URL,
      "en-TZ": SITE_URL,
      "en-UG": SITE_URL,
      "en-RW": SITE_URL,
      "sw-KE": SITE_URL,
    },
  },
  other: {
    "geo.region": "KE",
    "geo.placename": "Nairobi",
    "geo.position": "-1.2921;36.8219",
    "ICBM": "-1.2921, 36.8219",
  },
  icons: {
    icon: "/st.png",
    shortcut: "/st.png",
    apple: "/st.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#030712",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness"],
  name: "TalkSasa",
  url: SITE_URL,
  logo: `${SITE_URL}/st.png`,
  image: `${SITE_URL}/og-image.png`,
  description:
    "Kenya's leading bulk SMS gateway, web hosting, domains, VPS & cloud solutions provider. Serving Nairobi, Mombasa, Kisumu, and across East Africa. Trusted by 2,100+ businesses.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Nairobi",
    addressLocality: "Nairobi",
    addressRegion: "Nairobi County",
    postalCode: "00100",
    addressCountry: "KE",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -1.2921,
    longitude: 36.8219,
  },
  areaServed: [
    {
      "@type": "Country",
      name: "Kenya",
    },
    {
      "@type": "Country",
      name: "Tanzania",
    },
    {
      "@type": "Country",
      name: "Uganda",
    },
    {
      "@type": "Country",
      name: "Rwanda",
    },
    {
      "@type": "City",
      name: "Nairobi",
    },
    {
      "@type": "City",
      name: "Mombasa",
    },
    {
      "@type": "City",
      name: "Kisumu",
    },
    {
      "@type": "City",
      name: "Dar es Salaam",
    },
    {
      "@type": "City",
      name: "Kampala",
    },
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: "+254712295880",
      availableLanguage: ["English", "Swahili"],
      areaServed: ["KE", "TZ", "UG", "RW"],
      url: `${SITE_URL}/contact`,
    },
    {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: "+254781000403",
      availableLanguage: ["English", "Swahili"],
      areaServed: ["KE", "TZ", "UG", "RW"],
      url: `${SITE_URL}/contact`,
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "2100",
  },
  priceRange: "KES 380 - KES 16,800",
  paymentAccepted: "M-Pesa, Airtel Money, Bank Transfer, Credit Card",
  currenciesAccepted: "KES, USD, EUR",
  sameAs: [
    "https://twitter.com/talksasa",
    "https://www.facebook.com/talksasa",
    "https://www.linkedin.com/company/talksasa",
    "https://www.instagram.com/talksasa",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "TalkSasa Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Bulk SMS Gateway",
          description: "Reliable SMS gateway for sending bulk messages across Kenya and East Africa",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Web Hosting",
          description: "Fast SSD web hosting with cPanel, free SSL, and unlimited bandwidth",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Domain Registration",
          description: "Register .co.ke, .com, .org, and 100+ TLDs",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "VPS Hosting",
          description: "Scalable cloud VPS with dedicated resources and full root access",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Dedicated Servers",
          description: "Bare metal servers for maximum performance and control",
        },
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('talksasa-theme');document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark');})();`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:outline-none focus:[width:auto] focus:[height:auto] focus:[padding:0.5rem_1rem] focus:[margin:0] focus:[overflow:visible] focus:[clip:auto]"
        >
          Skip to main content
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {/* Additional structured data for services */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "TalkSasa",
              url: SITE_URL,
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${SITE_URL}/?s={search_term_string}`,
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <ClientProviders>{children}</ClientProviders>
        <Analytics />
      </body>
    </html>
  );
}
