"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Building2, Check, Cloud, Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

type UseCase = {
  icon: typeof MessageSquare;
  title: string;
  brand: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
};

const useCases: UseCase[] = [
  {
    icon: MessageSquare,
    title: "Transactional & marketing SMS",
    brand: "Talksasa SMS",
    description:
      "Banks, SACCOs, and retailers send OTPs, alerts, and campaigns on a gateway built for Kenyan delivery.",
    features: [
      "OTP and 2FA at scale",
      "Campaign scheduling",
      "Delivery reports and API access",
    ],
    cta: "Explore Bulk SMS",
    href: "/bulk-sms",
  },
  {
    icon: Mail,
    title: "Corporate email on your domain",
    brand: "Talksasa Mail",
    description:
      "Give every team member a branded inbox — professional, secure webmail with DNS helpers at checkout.",
    features: [
      "you@yourcompany.co.ke",
      "Mailboxes and aliases",
      "Pair with .co.ke domains",
    ],
    cta: "Get business email",
    href: "/email-hosting",
  },
  {
    icon: Cloud,
    title: "Application & infrastructure cloud",
    brand: "Talksasa Cloud",
    description:
      "Deploy production apps, scale with VPS or dedicated servers, or resell under your own brand.",
    features: [
      "Container app hosting",
      "VPS and dedicated servers",
      "White-label reseller platform",
    ],
    cta: "Explore Cloud",
    href: "/cloud-hosting",
  },
  {
    icon: Building2,
    title: "Agencies & multi-brand ops",
    brand: "SMS + Mail + Cloud",
    description:
      "Run client messaging, branded email, and hosted apps from one local billing relationship.",
    features: [
      "Shared M-Pesa billing",
      "Reseller options for agencies",
      "Nairobi support for production issues",
    ],
    cta: "Talk to sales",
    href: "/book-demo",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export function UseCases() {
  return (
    <section className="section-py bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Built for <span className="gradient-text">enterprise workloads</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            How finance, product, and operations teams use Talksasa SMS, Mail, and Cloud together.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
        >
          {useCases.map((useCase) => {
            const Icon = useCase.icon;
            return (
              <motion.article
                key={useCase.title}
                variants={item}
                className="relative rounded-2xl glass border border-border p-6 sm:p-8 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="rounded-lg bg-primary/10 p-2.5 text-primary shrink-0">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-primary/90">
                      {useCase.brand}
                    </p>
                    <h3 className="mt-1 text-lg sm:text-xl font-semibold text-foreground">
                      {useCase.title}
                    </h3>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {useCase.description}
                </p>
                <ul className="space-y-1.5 text-sm text-muted-foreground mb-6">
                  {useCase.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-primary shrink-0" aria-hidden />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={useCase.href}
                  className="text-sm font-medium text-primary hover:text-primary/90 inline-flex items-center gap-1.5"
                >
                  {useCase.cta}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </motion.article>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 border-0"
          >
            <Link href="/book-demo">Book a demo</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
