"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitLead } from "@/lib/submit-lead";
import { trackCTAClick } from "@/components/analytics";

const EXIT_SHOWN_KEY = "talksasa_exit_intent_shown";
const CTA_INTERACTED_KEY = "talksasa_cta_interacted";

export function ExitIntentModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  const shouldShow = useCallback(() => {
    if (typeof window === "undefined") return false;
    if (window.localStorage.getItem(EXIT_SHOWN_KEY) === "1") return false;
    if (window.localStorage.getItem(CTA_INTERACTED_KEY) === "1") return false;
    return true;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onMouseOut = (e: MouseEvent) => {
      if (!shouldShow()) return;
      if (
        (e.relatedTarget === null || (e as unknown as { toElement: Node | null }).toElement === null) &&
        e.clientY <= 0
      ) {
        window.localStorage.setItem(EXIT_SHOWN_KEY, "1");
        setOpen(true);
      }
    };
    window.addEventListener("mouseout", onMouseOut);
    return () => window.removeEventListener("mouseout", onMouseOut);
  }, [shouldShow]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const timer = window.setTimeout(() => {
      if (shouldShow()) {
        window.localStorage.setItem(EXIT_SHOWN_KEY, "1");
        setOpen(true);
      }
    }, 45000);
    return () => window.clearTimeout(timer);
  }, [shouldShow]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (!email.includes("@")) {
      setError("Enter a valid email address");
      return;
    }
    if (!phone.trim()) {
      setError("Enter your phone number");
      return;
    }

    setStatus("loading");
    const saved = await submitLead({
      type: "exit_intent",
      email: email.trim(),
      phone: phone.trim(),
      service: "Bulk SMS",
      metadata: { offer: "100_free_sms_units" },
    });

    if (!saved.ok) {
      setStatus("error");
      setError(saved.error);
      return;
    }

    trackCTAClick("exit_intent_email_submit");
    setOpen(false);
    router.push(saved.redirect);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[110] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} aria-hidden />
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
                Wait! Get 100 free SMS units
              </h2>
              <p className="mt-3 text-muted-foreground">
                Leave your email and phone — we&apos;ll send your signup offer. No credit card required.
              </p>
              <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
                <input
                  type="email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full rounded-lg bg-background/40 border border-border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Email address"
                />
                <input
                  type="tel"
                  name="phone"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0712 345 678"
                  className="w-full rounded-lg bg-background/40 border border-border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Phone number"
                />
                {error && <p className="text-xs text-red-400 text-left">{error}</p>}
                <Button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 border-0"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving…
                    </>
                  ) : (
                    "Claim 100 free SMS units"
                  )}
                </Button>
              </form>
              <button
                type="button"
                onClick={close}
                className="mt-3 text-xs text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
              >
                No thanks
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
