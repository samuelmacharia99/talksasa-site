"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCTAModal } from "@/components/cta-modal";
import { trackCTAClick } from "@/components/analytics";

export function CTA() {
  const { openModal } = useCTAModal();
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
            Ready for Talksasa Cloud or bulk SMS?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Host your site, sell hosting as a reseller, or send millions of messages — M-Pesa billing on both platforms.
          </p>
          <div className="mt-8 sm:mt-10 flex flex-col md:flex-row flex-wrap gap-3 md:gap-4 justify-center">
            <Button size="lg" className="w-full md:w-auto group bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 border-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" onClick={() => { trackCTAClick("cta_get_started_free"); openModal(); }}>
              <span className="flex items-center gap-2">
                Start as a customer
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </span>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full md:w-auto">
              <Link href="/bulk-sms">Explore bulk SMS</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full md:w-auto">
              <Link href="/reseller">Become a reseller</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
