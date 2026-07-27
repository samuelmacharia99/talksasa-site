import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ClientProviders } from "@/components/client-providers";
import { Analytics } from "@/components/analytics";
import { GTM_ID, CONSENT_KEY } from "@/lib/google-ads";
import "./globals.css";
import { DEFAULT_SEO, BRAND } from "@/lib/cloud-content";
import { CONTACT, PRIMARY_PHONE, SALES_PHONE } from "@/lib/contact";
import { SOCIAL_LINKS } from "@/lib/social";

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
  preload: false,
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://talksasa.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_SEO.title,
    template: `%s | ${BRAND}`,
  },
  description: DEFAULT_SEO.description,
  keywords: [...DEFAULT_SEO.keywords],
  authors: [{ name: BRAND, url: SITE_URL }],
  creator: BRAND,
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: SITE_URL,
    siteName: BRAND,
    title: DEFAULT_SEO.title,
    description: DEFAULT_SEO.description,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Talksasa Cloud — Business Email, App Hosting and Domains in Kenya",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_SEO.title,
    description: DEFAULT_SEO.description,
    images: ["/og-image.png"],
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
  },
  other: {
    "geo.region": "KE",
    "geo.placename": "Nairobi",
    "geo.position": "-1.2921;36.8219",
    "ICBM": "-1.2921, 36.8219",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#030712",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness"],
  name: "Talksasa Cloud",
  url: SITE_URL,
  logo: `${SITE_URL}/st.png`,
  image: `${SITE_URL}/og-image.png`,
  description: DEFAULT_SEO.description,
  address: {
    "@type": "PostalAddress",
    streetAddress: CONTACT.address.streetAddress,
    addressLocality: CONTACT.address.city,
    addressRegion: "Nairobi County",
    postalCode: CONTACT.address.postalCode,
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
      telephone: PRIMARY_PHONE.tel,
      availableLanguage: ["English", "Swahili"],
      areaServed: ["KE", "TZ", "UG", "RW"],
      url: `${SITE_URL}/contact`,
    },
    {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: SALES_PHONE.tel,
      availableLanguage: ["English", "Swahili"],
      areaServed: ["KE", "TZ", "UG", "RW"],
      url: `${SITE_URL}/contact`,
    },
  ],
  priceRange: "KES 380 - KES 16,800",
  paymentAccepted: "M-Pesa, Airtel Money, Bank Transfer, Credit Card",
  currenciesAccepted: "KES, USD, EUR",
  sameAs: [
    SOCIAL_LINKS.twitter,
    SOCIAL_LINKS.facebook,
    SOCIAL_LINKS.linkedin,
    SOCIAL_LINKS.instagram,
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
          name: "Business Email Hosting",
          description: "Mailcow business email on your domain with webmail, aliases, and DKIM/SPF",
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
          name: "Application Hosting",
          description: "Container-based application hosting with Git deploys and managed SSL",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Reseller Hosting",
          description: "White-label portal to resell email, apps, and domains under your brand",
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
        {/* Consent defaults — must load before GTM / Google tags */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                ad_storage: 'denied',
                analytics_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                wait_for_update: 500
              });
              if (typeof localStorage !== 'undefined' && localStorage.getItem('${CONSENT_KEY}') === 'accepted') {
                gtag('consent', 'update', {
                  ad_storage: 'granted',
                  analytics_storage: 'granted',
                  ad_user_data: 'granted',
                  ad_personalization: 'granted'
                });
              }
            `,
          }}
        />
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('talksasa-theme');document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark');})();`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
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
            }),
          }}
        />
        <ClientProviders>{children}</ClientProviders>
        <Analytics />
      </body>
    </html>
  );
}
