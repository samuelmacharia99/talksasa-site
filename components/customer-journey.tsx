"use client";

import { motion } from "framer-motion";
import { CUSTOMER_JOURNEY, CUSTOMER_TRUST } from "@/lib/cloud-content";
import { Check, ArrowRight } from "lucide-react";

export function CustomerJourneySection() {
  return (
    <section className="section-py border-y border-border bg-muted/15">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            From browse to <span className="gradient-text">live in minutes</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Self-service ordering with automated provisioning — built for customers who want to move fast.
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 max-w-4xl mx-auto mb-14">
          {CUSTOMER_JOURNEY.map((step, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-2 sm:gap-3"
            >
              <span className="rounded-full glass border border-border px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-foreground">
                {step}
              </span>
              {i < CUSTOMER_JOURNEY.length - 1 && (
                <ArrowRight className="h-4 w-4 text-primary/50 hidden sm:block" aria-hidden />
              )}
            </motion.div>
          ))}
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
          {CUSTOMER_TRUST.map((text, i) => (
            <motion.li
              key={text}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="flex items-start gap-2 text-sm text-muted-foreground"
            >
              <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" aria-hidden />
              {text}
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
