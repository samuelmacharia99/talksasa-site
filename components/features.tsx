"use client";

import { motion } from "framer-motion";
import { Zap, CreditCard, Headphones, Shield } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Auto-provisioning",
    description: "Business email and application hosting provision automatically after payment — no manual setup delays.",
  },
  {
    icon: CreditCard,
    title: "M-Pesa & smart billing",
    description: "STK push, PDF invoices, wallet credits, renewal reminders, and transparent line-item billing.",
  },
  {
    icon: Shield,
    title: "Email & containers",
    description: "Mailcow business email plus isolated container apps with SSL, backups, and Git deploy.",
  },
  {
    icon: Headphones,
    title: "Support tickets",
    description: "Built-in ticketing, service dashboard, and 24/7 human support from our Nairobi team.",
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
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Built for <span className="gradient-text">Kenyan businesses</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Order. Pay. Provision. Manage. Renew. — automated billing and infrastructure on Talksasa Cloud.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl p-6 sm:p-8 glass border border-border hover:border-primary/20 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-primary/10 p-2.5 text-primary shrink-0">
                  <feature.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
