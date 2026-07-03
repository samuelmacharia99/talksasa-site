"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, MessageCircle, Phone } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { CONTACT, PRIMARY_PHONE } from "@/lib/contact";

const COPY: Record<string, { title: string; body: string }> = {
  contact: {
    title: "Message received",
    body: "We've saved your inquiry. Tap the WhatsApp button below to reach our team instantly, or we'll follow up by email or phone within one business hour.",
  },
  demo: {
    title: "Demo request received",
    body: "Your preferred slot is saved. Continue on WhatsApp to confirm, or wait for our team to reach out.",
  },
  exit_intent: {
    title: "You're on the list",
    body: "We'll email your free SMS credits offer shortly. You can also sign up now and start sending in minutes.",
  },
};

type ThankYouClientProps = {
  type: string;
  openWhatsapp?: boolean;
};

export function ThankYouClient({ type, openWhatsapp }: ThankYouClientProps) {
  const content = COPY[type] ?? COPY.contact;

  useEffect(() => {
    if (!openWhatsapp) return;
    try {
      const pending = sessionStorage.getItem("talksasa_pending_wa");
      if (pending) {
        sessionStorage.removeItem("talksasa_pending_wa");
        window.location.href = pending;
      }
    } catch {
      // ignore
    }
  }, [openWhatsapp]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main id="main-content" className="pt-28 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-xl text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <CheckCircle2 className="h-8 w-8 text-emerald-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{content.title}</h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">{content.body}</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-indigo-500 to-purple-600 border-0">
              <Link href="/pricing">View pricing</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" />
                Chat on WhatsApp
              </a>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <a href={`tel:${PRIMARY_PHONE.tel}`}>
                <Phone className="mr-2 h-4 w-4" />
                Call us
              </a>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
