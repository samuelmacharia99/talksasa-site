"use client";

import { motion } from "framer-motion";
import { CreditCard, Headphones, Zap } from "lucide-react";

const proofs = [
  {
    icon: CreditCard,
    title: "M-Pesa-native billing",
    description:
      "STK push, PDF invoices, and renewal reminders — finance-ready billing for Kenyan enterprises.",
  },
  {
    icon: Zap,
    title: "Automatic provisioning",
    description:
      "Talksasa Mail and Talksasa Cloud services activate after payment so your teams are not waiting on tickets.",
  },
  {
    icon: Headphones,
    title: "East Africa support",
    description:
      "Nairobi-based specialists for SMS, email, and cloud — available around the clock when production matters.",
  },
];

export function Features() {
  return (
    <section id="solutions" className="section-py relative scroll-mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Why enterprises choose <span className="gradient-text">TalkSasa</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Local payments, fast provisioning, and human support — without the complexity of juggling
            multiple vendors.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {proofs.map((proof, i) => (
            <motion.div
              key={proof.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl p-6 sm:p-8 glass border border-border hover:border-primary/20 transition-colors"
            >
              <div className="rounded-lg bg-primary/10 p-2.5 text-primary w-fit">
                <proof.icon className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="mt-4 font-semibold text-foreground">{proof.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{proof.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
