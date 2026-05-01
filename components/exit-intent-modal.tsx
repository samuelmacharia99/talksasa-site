"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const EXIT_SHOWN_KEY = "talksasa_exit_intent_shown";
const CTA_INTERACTED_KEY = "talksasa_cta_interacted";

export function ExitIntentModal() {
  const [open, setOpen] = useState(false);

  const shouldShow = useCallback(() => {
    if (typeof window === "undefined") return false;
    if (window.localStorage.getItem(EXIT_SHOWN_KEY) === "1") return false;
    if (window.localStorage.getItem(CTA_INTERACTED_KEY) === "1") return false;
    return true;
  }, []);

  // Desktop: mouse leaves at top
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onMouseOut = (e: MouseEvent) => {
      if (!shouldShow()) return;
      if ((e.relatedTarget === null || (e as any).toElement === null) && e.clientY <= 0) {
        window.localStorage.setItem(EXIT_SHOWN_KEY, "1");
        setOpen(true);
      }
    };
    window.addEventListener("mouseout", onMouseOut);
    return () => window.removeEventListener("mouseout", onMouseOut);
  }, [shouldShow]);

  // Mobile / general: 30s timer (simple version)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const timer = window.setTimeout(() => {
      if (shouldShow()) {
        window.localStorage.setItem(EXIT_SHOWN_KEY, "1");
        setOpen(true);
      }
    }, 30000);
    return () => window.clearTimeout(timer);
  }, [shouldShow]);

  // ESC key
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emailInput = e.currentTarget.elements.namedItem("exit-email") as HTMLInputElement | null;
    if (!emailInput || !emailInput.value.includes("@")) {
      emailInput?.focus();
      return;
    }
    // TODO: hook into FormSpree/Web3Forms or your API here
    // data-form attribute added for external tools
    setOpen(false);
    alert("Check your email for your free credits!");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[110] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={close}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="exit-intent-title"
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative max-w-lg w-full md:w-[500px] rounded-3xl glass gradient-border border border-border p-6 sm:p-8 shadow-2xl bg-background/80"
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close offer"
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
            <div className="text-center">
              <div className="text-4xl mb-2" aria-hidden>
                🎁
              </div>
              <h2
                id="exit-intent-title"
                className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground"
              >
                Wait! Don&apos;t Miss Out on This Offer
              </h2>
              <p className="mt-3 text-muted-foreground">
                Get 1,000 FREE SMS Credits When You Sign Up Today
              </p>
              <ul className="mt-5 space-y-1 text-sm text-muted-foreground text-left inline-block">
                <li>✓ No credit card required</li>
                <li>✓ Instant activation</li>
                <li>✓ 24/7 support included</li>
                <li>✓ Cancel anytime</li>
              </ul>
              <form
                className="mt-6 space-y-3"
                onSubmit={handleSubmit}
                data-form="exit-intent-email"
              >
                <input
                  type="email"
                  name="exit-email"
                  required
                  placeholder="Enter your email"
                  className="w-full rounded-lg bg-background/40 border border-border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Email address to receive free SMS credits"
                />
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 border-0"
                >
                  Claim My Free SMS Credits
                </Button>
              </form>
              <button
                type="button"
                onClick={close}
                className="mt-3 text-xs text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
              >
                No thanks, I&apos;ll pay full price
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

