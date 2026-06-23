import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://talksasa.com";

const PAGES: MetadataRoute.Sitemap = [
  { url: BASE_URL, changeFrequency: "weekly", priority: 1 },
  { url: `${BASE_URL}/bulk-sms`, changeFrequency: "weekly", priority: 0.95 },
  { url: `${BASE_URL}/web-hosting`, changeFrequency: "weekly", priority: 0.95 },
  { url: `${BASE_URL}/domains`, changeFrequency: "weekly", priority: 0.95 },
  { url: `${BASE_URL}/cloud-hosting`, changeFrequency: "weekly", priority: 0.95 },
  { url: `${BASE_URL}/vps`, changeFrequency: "weekly", priority: 0.95 },
  { url: `${BASE_URL}/dedicated`, changeFrequency: "weekly", priority: 0.95 },
  { url: `${BASE_URL}/servers`, changeFrequency: "weekly", priority: 0.85 },
  { url: `${BASE_URL}/reseller`, changeFrequency: "weekly", priority: 0.95 },
  { url: `${BASE_URL}/reseller-hosting`, changeFrequency: "weekly", priority: 0.95 },
  { url: `${BASE_URL}/sms-reseller`, changeFrequency: "weekly", priority: 0.95 },
  { url: `${BASE_URL}/payments/mpesa`, changeFrequency: "monthly", priority: 0.85 },
  { url: `${BASE_URL}/pricing`, changeFrequency: "weekly", priority: 0.9 },
  { url: `${BASE_URL}/book-demo`, changeFrequency: "monthly", priority: 0.85 },
  { url: `${BASE_URL}/contact`, changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE_URL}/privacy`, changeFrequency: "yearly", priority: 0.4 },
  { url: `${BASE_URL}/terms`, changeFrequency: "yearly", priority: 0.4 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return PAGES.map((page) => ({ ...page, lastModified: now }));
}
