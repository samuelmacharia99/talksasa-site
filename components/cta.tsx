"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackCTAClick } from "@/components/analytics";

export function CTA() {
  return (
    <section className="section-py relative overflow-hidden">
      <div className="absolute inset-0 cta-mesh" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,var(--background)_100%)] opacity-60 pointer-events-none" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl border border-white/10 p-6 sm:p-12 lg:p-20 text-center"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight max-w-3xl mx-auto">
            Ready for Talksasa SMS, Mail, or Cloud?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Compare plans, book a demo with sales, or start with the product that fits your team —
            M-Pesa billing across all three brands.
          </p>
          <div className="mt-8 sm:mt-10 flex flex-col md:flex-row flex-wrap gap-3 md:gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="w-full md:w-auto group bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 border-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Link href="/pricing" onClick={() => trackCTAClick("cta_view_pricing")}>
                <span className="flex items-center gap-2">
                  View pricing
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                </span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full md:w-auto">
              <Link href="/book-demo">Talk to sales</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full md:w-auto">
              <Link href="/bulk-sms">Explore Bulk SMS</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
