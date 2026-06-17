"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductHeroIllustration } from "@/components/product-hero-illustration";
import { CLOUD_BRAND, type ProductPageContent, type ProductPageSlug } from "@/lib/cloud-content";

function eyebrowFor(slug: string) {
  if (slug === "bulk-sms") return "TalkSasa Bulk SMS";
  if (slug === "sms-reseller") return "TalkSasa SMS Reseller";
  if (slug === "reseller-hosting") return "Talksasa Cloud Reseller";
  if (slug === "reseller") return "TalkSasa Reseller Program";
  if (slug === "mpesa") return "M-Pesa Billing";
  return CLOUD_BRAND;
}

export function ProductPageHero({ page }: { page: ProductPageContent }) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_20%,rgba(99,102,241,0.18),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_60%,rgba(139,92,246,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-muted/10" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 text-center lg:text-left max-w-2xl"
          >
            <p className="text-sm font-medium uppercase tracking-wider text-primary">
              {eyebrowFor(page.slug)}
            </p>
            <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] text-balance">
              {page.headline}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">{page.subheadline}</p>
            <p className="mt-5 text-sm sm:text-base text-muted-foreground leading-relaxed line-clamp-4 sm:line-clamp-none">
              {page.intro}
            </p>
            {page.seoNote && (
              <p className="mt-3 text-xs text-muted-foreground/80 italic">{page.seoNote}</p>
            )}
            <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-3 justify-center lg:justify-start">
              <Button asChild size="lg" className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 border-0">
                {page.ctaPrimary.external ? (
                  <a href={page.ctaPrimary.href} target="_blank" rel="noopener noreferrer">
                    <span className="flex items-center gap-2">
                      {page.ctaPrimary.label}
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </a>
                ) : (
                  <Link href={page.ctaPrimary.href}>
                    <span className="flex items-center gap-2">
                      {page.ctaPrimary.label}
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                )}
              </Button>
              {page.ctaSecondary && (
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                  {page.ctaSecondary.external ? (
                    <a href={page.ctaSecondary.href} target="_blank" rel="noopener noreferrer">
                      {page.ctaSecondary.label}
                    </a>
                  ) : (
                    <Link href={page.ctaSecondary.href}>{page.ctaSecondary.label}</Link>
                  )}
                </Button>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex-1 w-full flex items-center justify-center"
          >
            <ProductHeroIllustration slug={page.slug as ProductPageSlug} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
