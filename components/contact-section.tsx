"use client";

import { motion } from "framer-motion";
import { ContactForm } from "@/components/contact-form";

export function ContactSection() {
  return (
    <section id="contact" className="py-24 relative scroll-mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Get in <span className="gradient-text">touch</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Tell us what you need and we&apos;ll get back to you within 24 hours.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="max-w-xl mx-auto"
        >
          <ContactForm />
        </motion.div>
      </div>
    </section>
  );
}
