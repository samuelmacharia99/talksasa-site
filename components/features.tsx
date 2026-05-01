"use client";

import { motion } from "framer-motion";
import { Zap, Lock, Headphones, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning fast",
    description: "SSD storage, optimized stacks, and global CDN for minimal latency.",
  },
  {
    icon: Lock,
    title: "Secure by default",
    description: "Free SSL, DDoS protection, and automated backups on all plans.",
  },
  {
    icon: Headphones,
    title: "Expert support",
    description: "24/7 technical support from our team. Real humans, real solutions.",
  },
  {
    icon: BarChart3,
    title: "Scale on demand",
    description: "Upgrade resources anytime. No lock-in contracts or surprise fees.",
  },
];

export function Features() {
  return (
    <section id="solutions" className="py-24 relative scroll-mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Built for <span className="gradient-text">reliability</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Enterprise-grade infrastructure with a focus on simplicity and
            performance.
          </p>
        </motion.div>

        {/* Bento-style grid */}
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
                  <h3 className="font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
