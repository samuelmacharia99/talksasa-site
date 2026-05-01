"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCTAModal } from "@/components/cta-modal";
import { trackCTAClick } from "@/components/analytics";

export function CTA() {
  const { openModal } = useCTAModal();
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 cta-mesh" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,var(--background)_100%)] opacity-60 pointer-events-none" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl border border-white/10 p-12 sm:p-16 lg:p-20 text-center"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight max-w-3xl mx-auto">
            Ready to scale your business?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Join 2,100+ businesses already using TalkSasa.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="group bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 border-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" onClick={() => { trackCTAClick("cta_get_started_free"); openModal(); }}>
              <span className="flex items-center gap-2">
                Get Started Free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </span>
            </Button>
            <Button variant="outline" size="lg" onClick={() => { trackCTAClick("cta_talk_to_sales"); openModal(); }}>
              Talk to Sales
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
