"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const WHATSAPP_URL =
  "https://wa.me/254712295880?text=" +
  encodeURIComponent(
    "Hi TalkSasa, I'm interested in learning more about your services."
  );

type UseCase = {
  icon: string;
  title: string;
  description: string;
  features: string[];
  stat: string;
  cta: string;
  accent: string;
};

const useCases: UseCase[] = [
  {
    icon: "🛒",
    title: "E-commerce & Online Stores",
    description:
      "Send order confirmations, delivery updates, and abandoned cart reminders automatically.",
    features: [
      "Automated order notifications",
      "Cart abandonment recovery",
      "Delivery tracking updates",
      "Customer feedback requests",
    ],
    stat: "Increase conversions by 35%",
    cta: "See E-commerce Solutions",
    accent: "from-sky-500 to-indigo-500",
  },
  {
    icon: "🎓",
    title: "Schools & Educational Institutions",
    description:
      "Keep parents informed with fee reminders, exam schedules, and important announcements.",
    features: [
      "Fee payment reminders",
      "Exam timetable alerts",
      "Parent-teacher meeting notices",
      "Emergency notifications",
    ],
    stat: "Used by 200+ schools",
    cta: "See Education Solutions",
    accent: "from-emerald-500 to-lime-500",
  },
  {
    icon: "💻",
    title: "SaaS & Tech Companies",
    description:
      "Secure your users with 2FA, password resets, and real-time notifications.",
    features: [
      "Two-factor authentication",
      "Password reset codes",
      "Account activity alerts",
      "API webhook notifications",
    ],
    stat: "99.9% delivery rate",
    cta: "See Developer Solutions",
    accent: "from-violet-500 to-fuchsia-500",
  },
  {
    icon: "📊",
    title: "Marketing Agencies",
    description:
      "Manage multiple client campaigns with our bulk SMS platform and detailed analytics.",
    features: [
      "Multi-client management",
      "Campaign scheduling",
      "Detailed analytics & reports",
      "White-label options",
    ],
    stat: "Manage 10+ clients easily",
    cta: "See Agency Solutions",
    accent: "from-orange-500 to-amber-500",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export function UseCases() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            See How Businesses Like <span className="gradient-text">Yours</span>{" "}
            Use TalkSasa
          </h2>
          <p className="mt-4 text-muted-foreground">
            Real solutions for real challenges.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
          {useCases.map((useCase) => (
            <motion.article
              key={useCase.title}
              variants={item}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="relative rounded-3xl glass gradient-border border border-border p-6 sm:p-8 overflow-hidden shadow-md hover:shadow-glow-md"
            >
              <div
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${useCase.accent}`}
                aria-hidden
              />
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl" aria-hidden>
                  {useCase.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground">
                  {useCase.title}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {useCase.description}
              </p>
              <ul className="space-y-1.5 text-sm text-muted-foreground mb-4">
                {useCase.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-primary" aria-hidden />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between mt-2">
                <span className="inline-flex items-center rounded-full bg-primary/10 text-xs font-medium text-primary px-3 py-1">
                  {useCase.stat}
                </span>
                <button
                  type="button"
                  className="text-xs text-primary hover:text-primary/90 inline-flex items-center gap-1 px-3 py-2"
                >
                  {useCase.cta}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </button>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-muted-foreground mb-4">
            Don&apos;t see your industry? We work with businesses of all types.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 border-0"
          >
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              Contact Sales
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

