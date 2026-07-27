"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquare, Cloud, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackCTAClick } from "@/components/analytics";
import { appendAttributionToUrl } from "@/lib/attribution";
import { BULK_SMS_URL } from "@/lib/urls";
import Link from "next/link";

type CTAModalContextType = {
  openModal: () => void;
};

type OptionWithHref = {
  icon: typeof MessageSquare | typeof Cloud | typeof MessageCircle;
  title: string;
  href: string;
  description: string;
};

type OptionWithAction = {
  icon: typeof MessageSquare | typeof Cloud | typeof MessageCircle;
  title: string;
  action: "contact";
  description: string;
};

type Option = OptionWithHref | OptionWithAction;

const CTAModalContext = createContext<CTAModalContextType | null>(null);

export function useCTAModal() {
  const ctx = useContext(CTAModalContext);
  return ctx ?? { openModal: () => {} };
}

const options: Option[] = [
  {
    icon: MessageSquare,
    title: "I need Bulk SMS",
    href: BULK_SMS_URL,
    description: "Send SMS at scale",
  },
  {
    icon: Cloud,
    title: "I need Talksasa Cloud",
    href: "/email-hosting",
    description: "Email, apps & domains",
  },
  {
    icon: MessageCircle,
    title: "I need both",
    action: "contact" as const,
    description: "We'll get in touch",
  },
];

function ModalContent({ onClose }: { onClose: () => void }) {
  const handleContact = () => {
    onClose();
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cta-modal-title"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="rounded-2xl glass border border-border p-6 sm:p-8 max-w-md w-full mx-4 shadow-xl"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 id="cta-modal-title" className="text-xl font-semibold text-foreground">How can we help?</h3>
        <button
          type="button"
          aria-label="Close modal"
          onClick={onClose}
          className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="space-y-3">
        {options.map((opt) =>
          "href" in opt ? (
            <Button key={opt.title} asChild variant="outline" className="w-full justify-start h-auto py-4 px-4">
              {opt.href.startsWith("http") ? (
                <a
                  href={appendAttributionToUrl(opt.href)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    trackCTAClick(opt.title.replace(/\s+/g, "_"));
                    onClose();
                  }}
                >
                  <opt.icon className="h-5 w-5 mr-3 shrink-0 text-primary" aria-hidden />
                  <span className="text-left">
                    <span className="font-medium block">{opt.title}</span>
                    <span className="text-xs text-muted-foreground">{opt.description}</span>
                  </span>
                </a>
              ) : (
                <Link
                  href={opt.href}
                  onClick={() => {
                    trackCTAClick(opt.title.replace(/\s+/g, "_"));
                    onClose();
                  }}
                >
                  <opt.icon className="h-5 w-5 mr-3 shrink-0 text-primary" aria-hidden />
                  <span className="text-left">
                    <span className="font-medium block">{opt.title}</span>
                    <span className="text-xs text-muted-foreground">{opt.description}</span>
                  </span>
                </Link>
              )}
            </Button>
          ) : (
            <Button
              key={opt.title}
              variant="outline"
              className="w-full justify-start h-auto py-4 px-4"
              onClick={() => { trackCTAClick("need_both"); handleContact(); }}
            >
              <opt.icon className="h-5 w-5 mr-3 shrink-0 text-primary" aria-hidden />
              <span className="text-left">
                <span className="font-medium block">{opt.title}</span>
                <span className="text-xs text-muted-foreground">{opt.description}</span>
              </span>
            </Button>
          )
        )}
      </div>
    </motion.div>
  );
}

export function CTAModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const openModal = useCallback(() => setOpen(true), []);

  return (
    <CTAModalContext.Provider value={{ openModal }}>
      {children}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <div className="relative flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <ModalContent onClose={() => setOpen(false)} />
            </div>
          </div>
        )}
      </AnimatePresence>
    </CTAModalContext.Provider>
  );
}
