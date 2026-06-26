"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { DomainExtension } from "@/lib/billing-types";
import { formatBillingPrice } from "@/lib/billing-utils";
import { cn } from "@/lib/utils";

const FEATURED = [".co.ke", ".com", ".org"];

export function DomainTldGrid({ onPickTld }: { onPickTld?: (ext: string) => void }) {
  const [extensions, setExtensions] = useState<DomainExtension[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/billing/domains/extensions?period=1")
      .then((r) => r.json())
      .then((data) => {
        const list: DomainExtension[] = data.extensions ?? [];
        setExtensions([...list].sort((a, b) => a.price - b.price));
      })
      .catch(() => setExtensions([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-muted/40 animate-pulse" />
        ))}
      </div>
    );
  }

  if (extensions.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {extensions.map((ext, i) => {
        const featured = FEATURED.includes(ext.extension);
        return (
          <motion.button
            key={ext.extension}
            type="button"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
            onClick={() => onPickTld?.(ext.extension)}
            className={cn(
              "relative text-left rounded-xl border p-4 sm:p-5 transition-all hover:-translate-y-0.5 hover:shadow-glow-sm",
              featured
                ? "border-primary/40 bg-primary/5 hover:border-primary/60"
                : "border-border glass hover:border-primary/30"
            )}
          >
            {featured && ext.extension === ".co.ke" && (
              <span className="absolute -top-2.5 left-3 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                <Sparkles className="h-3 w-3" />
                Kenya favourite
              </span>
            )}
            <p className="font-mono text-lg sm:text-xl font-bold text-foreground">{ext.extension}</p>
            <p className="mt-1 text-xs text-muted-foreground capitalize line-clamp-1">{ext.description}</p>
            <div className="mt-3 pt-3 border-t border-border/60 space-y-1.5">
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="text-muted-foreground text-xs">Register</span>
                <span className="font-semibold text-primary">
                  {formatBillingPrice(ext.price, ext.currency)}
                  <span className="text-muted-foreground font-normal text-[10px]"> /yr</span>
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="text-muted-foreground text-xs">Transfer</span>
                <span className="font-medium text-foreground text-xs">
                  {formatBillingPrice(ext.transfer_price, ext.currency)}
                </span>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
