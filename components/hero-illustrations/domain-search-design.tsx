"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Search, Check, X, Loader2 } from "lucide-react";
import { IllustrationFrame } from "./illustration-frame";

const DOMAINS = [
  { query: "myshop.co.ke", available: true, price: "KES 1,200/yr" },
  { query: "acmestore.com", available: true, price: "KES 1,500/yr" },
  { query: "nairobi.tech", available: false },
] as const;

const TLDS = [".co.ke", ".com", ".org", ".africa"] as const;

const TYPE_MS = 72;
const PAUSE_AFTER_TYPE = 350;
const CHECK_MS = 550;
const RESULT_MS = 1100;

type Phase = "typing" | "checking" | "result";

export function DomainSearchDesign({ compact }: { compact?: boolean } = {}) {
  const [domainIndex, setDomainIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<Phase>("typing");

  const current = DOMAINS[domainIndex];

  useEffect(() => {
    setTyped("");
    setPhase("typing");
  }, [domainIndex]);

  useEffect(() => {
    if (phase === "typing") {
      if (typed.length < current.query.length) {
        const timer = setTimeout(
          () => setTyped(current.query.slice(0, typed.length + 1)),
          TYPE_MS
        );
        return () => clearTimeout(timer);
      }
      const timer = setTimeout(() => setPhase("checking"), PAUSE_AFTER_TYPE);
      return () => clearTimeout(timer);
    }

    if (phase === "checking") {
      const timer = setTimeout(() => setPhase("result"), CHECK_MS);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setDomainIndex((i) => (i + 1) % DOMAINS.length);
    }, RESULT_MS);
    return () => clearTimeout(timer);
  }, [phase, typed, current.query]);

  return (
    <IllustrationFrame compact={compact}>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-8 gap-5 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-primary"
        >
          <Globe className="h-4 w-4" />
          <span className="text-xs sm:text-sm font-medium uppercase tracking-wider">
            Domain search
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-sm"
        >
          <Link href="/domains" className="block group">
            <div className="rounded-2xl glass border border-border/80 p-1.5 shadow-xl group-hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-2 rounded-xl bg-background/60 px-3 py-2.5 sm:py-3">
                <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0 font-mono text-sm sm:text-base text-foreground truncate">
                  {typed}
                  <motion.span
                    animate={{ opacity: phase === "result" ? 0 : [1, 0, 1] }}
                    transition={{
                      duration: 0.75,
                      repeat: phase === "result" ? 0 : Infinity,
                    }}
                    className="inline-block w-0.5 h-4 sm:h-5 ml-0.5 bg-primary align-middle"
                  />
                </div>
                <motion.span
                  animate={phase === "checking" ? { scale: [1, 0.95, 1] } : {}}
                  transition={{ duration: 0.4, repeat: phase === "checking" ? Infinity : 0 }}
                  className="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-3 py-1.5 text-xs font-medium text-white shrink-0"
                >
                  Search
                </motion.span>
              </div>
            </div>
          </Link>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-2 max-w-sm">
          {TLDS.map((tld, i) => (
            <motion.span
              key={tld}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.06 }}
              className="rounded-full glass border border-border/60 px-2.5 py-1 text-[10px] sm:text-xs font-medium text-muted-foreground"
            >
              {tld}
            </motion.span>
          ))}
        </div>

        <div className="w-full max-w-sm min-h-[88px]">
          <AnimatePresence mode="wait">
            {phase === "checking" && (
              <motion.div
                key="checking"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex items-center justify-center gap-2 rounded-xl glass border border-border/70 px-4 py-4"
              >
                <Loader2 className="h-4 w-4 text-primary animate-spin" />
                <span className="text-sm text-muted-foreground">
                  Checking <span className="font-mono text-foreground">{typed}</span>…
                </span>
              </motion.div>
            )}

            {phase === "result" && (
              <motion.div
                key={`result-${domainIndex}`}
                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ type: "spring", stiffness: 320, damping: 26 }}
                className={`rounded-xl border px-4 py-3.5 ${
                  current.available
                    ? "glass border-emerald-500/30 bg-emerald-500/5"
                    : "glass border-amber-500/30 bg-amber-500/5"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`rounded-lg p-2 ${
                      current.available ? "bg-emerald-500/15 text-emerald-500" : "bg-amber-500/15 text-amber-500"
                    }`}
                  >
                    {current.available ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <X className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-sm sm:text-base font-medium text-foreground truncate">
                      {current.query}
                    </p>
                    <p
                      className={`text-xs sm:text-sm mt-0.5 ${
                        current.available ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {current.available ? "Available — register now" : "Already taken — try another"}
                    </p>
                    {current.available && "price" in current && (
                      <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">{current.price}</p>
                    )}
                  </div>
                  {current.available && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.15 }}
                      className="text-xs sm:text-sm font-medium text-emerald-600 dark:text-emerald-400 shrink-0"
                    >
                      Add to cart →
                    </motion.span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xs text-muted-foreground/80 text-center max-w-xs px-2"
        >
          .co.ke, .com & 100+ TLDs · DNS & auto-renew in Talksasa Cloud
        </motion.p>
      </div>
    </IllustrationFrame>
  );
}
