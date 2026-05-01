"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASupport() {
  return (
    <section className="py-16 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Still have questions?
          </h2>
          <p className="mt-2 text-muted-foreground">
            We&apos;re here to help.
          </p>
          <Button asChild size="lg" variant="outline" className="mt-6 group">
            <Link href="#contact" className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Contact our 24/7 support team
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
