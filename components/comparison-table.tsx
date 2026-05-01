"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const features = [
  "99.9% uptime SLA",
  "24/7 support",
  "Free SSL",
  "Bulk SMS API",
  "Local payment (M-Pesa)",
  "No lock-in contracts",
];

const competitors = [
  { name: "TalkSasa", us: true, comp: false },
  { name: "Competitor A", us: false, comp: true },
  { name: "Competitor B", us: false, comp: true },
];

function Cell({ yes }: { yes: boolean }) {
  return yes ? (
    <Check className="h-5 w-5 text-emerald-500 mx-auto" aria-hidden />
  ) : (
    <X className="h-5 w-5 text-muted-foreground/50 mx-auto" aria-hidden />
  );
}

export function ComparisonTable() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="py-24"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            TalkSasa vs <span className="gradient-text">Competitors</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            See why 2,100+ businesses choose us for SMS and hosting.
          </p>
        </div>
        <div className="overflow-x-auto rounded-2xl glass border border-border">
          <table className="w-full min-w-[400px]" role="table">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 font-semibold text-foreground">Feature</th>
                <th className="p-4 font-semibold text-primary">TalkSasa</th>
                <th className="p-4 font-semibold text-muted-foreground">Others</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, i) => (
                <tr key={feature} className="border-b border-border/50 hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 text-foreground">{feature}</td>
                  <td className="p-4">
                    <Cell yes={true} />
                  </td>
                  <td className="p-4">
                    <Cell yes={i % 3 !== 0} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.section>
  );
}
