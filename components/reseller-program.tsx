"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  ArrowRight,
  Download,
  Mail,
  MessageCircle,
  ChevronDown,
  TrendingUp,
  Users,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONTACT, INFO_EMAIL, SALES_EMAIL } from "@/lib/contact";

const WHATSAPP_RESELLER_URL =
  `https://wa.me/${CONTACT.whatsapp}?text=` +
  encodeURIComponent(
    "Hi TalkSasa, I'm interested in your Reseller Program. Please share more details about the KES 5,000 bundle."
  );

const benefits = [
  {
    icon: "💰",
    title: "One-Time Low Investment",
    text: "Just KES 5,000 one-time - no monthly fees, no hidden costs",
  },
  {
    icon: "📈",
    title: "Unlimited Earning Potential",
    text: "Set your own prices and profit margins",
  },
  {
    icon: "🛠️",
    title: "All Tools Included",
    text: "Client portal, billing system, support materials",
  },
  {
    icon: "🤝",
    title: "We Handle the Tech",
    text: "We manage servers, delivery, and infrastructure",
  },
  {
    icon: "⚡",
    title: "Instant Activation",
    text: "Start selling within 24 hours",
  },
  {
    icon: "📊",
    title: "Real-Time Dashboard",
    text: "Track sales, clients, and revenue instantly",
  },
];

const perfectFor = [
  "Web Designers",
  "Digital Agencies",
  "Freelancers",
  "IT Consultants",
  "Entrepreneurs",
  "Marketing Experts",
  "Business Owners",
];

const faqs = [
  {
    q: "Is the KES 5,000 a monthly fee?",
    a: "No! It's a one-time investment. Pay once and you're set up for life. No monthly charges ever.",
  },
  {
    q: "Do I need technical knowledge?",
    a: "No! We provide complete training and handle all technical aspects. You focus on sales, we handle delivery.",
  },
  {
    q: "How do I get paid from my clients?",
    a: "Our automated system accepts M-Pesa, cards, and bank transfers. Payments go directly to your account.",
  },
  {
    q: "Can I use my own brand?",
    a: "Yes! White-label options available. Your clients see your brand, not TalkSasa.",
  },
  {
    q: "What support do I get?",
    a: "Dedicated reseller support via WhatsApp and email. Plus access to our reseller community and training materials.",
  },
  {
    q: "How quickly can I start?",
    a: "Within 24 hours. Sign up, complete setup, and start selling immediately.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border/50 last:border-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full py-4 flex items-center justify-between text-left"
      >
        <span className="font-medium text-foreground pr-4">{q}</span>
        <ChevronDown
          className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="pb-4 text-sm text-muted-foreground"
        >
          {a}
        </motion.p>
      )}
    </div>
  );
}

export function ResellerProgram() {
  return (
    <section className="py-20 sm:py-24 lg:py-32 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(99,102,241,0.15),transparent)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,transparent_0%,rgba(139,92,246,0.1)_50%,transparent_100%)]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-[55%_45%] lg:grid-cols-[60%_40%] gap-8 md:gap-6 lg:gap-12">
          {/* LEFT COLUMN */}
          <div className="space-y-8">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-1.5 text-xs font-semibold text-white">
                💼 RESELLER PROGRAM
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white"
            >
              Become a TalkSasa Reseller & Build Your Own Business
            </motion.h2>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="text-lg sm:text-xl text-white/90"
            >
              Start your own SMS business with zero infrastructure costs.
              Everything you need for just KES 5,000 (one-time investment).
            </motion.p>

            {/* Bundle Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="rounded-3xl glass gradient-border border border-white/20 p-6 sm:p-8 bg-background/90 shadow-2xl"
            >
              {/* Price Banner */}
              <div className="text-center mb-6 pb-6 border-b border-border">
                <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-3 py-1 text-xs font-bold text-black mb-3">
                  ⚡ Everything Included
                </div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                  COMPLETE RESELLER BUNDLE
                </div>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-4xl sm:text-5xl font-bold text-foreground">
                    KES 5,000
                  </span>
                  <span className="text-muted-foreground">One-time Fee</span>
                </div>
              </div>

              {/* What You Get */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  What You Get:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    {[
                      "1 Free Domain (.co.ke or .com)",
                      "13,000 FREE SMS Credits (KES 19,500 value)",
                      "Free SSL Certificate (Worth KES 2,000)",
                      "Free Complete Setup (Worth KES 5,000)",
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    {[
                      "Free Reseller Training (Video tutorials + live sessions)",
                      "Automated Payment System (M-Pesa, Card, Bank)",
                      "Dedicated Reseller Portal (Manage clients & billing)",
                      "White-Label Options (Your brand, our tech)",
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Total Value Badge */}
              <div className="rounded-xl bg-gradient-to-r from-emerald-500/20 to-lime-500/20 border border-emerald-500/30 p-4 text-center">
                <div className="text-sm font-semibold text-foreground">
                  Worth KES 26,500+ | You Pay Only KES 5,000
                </div>
                <div className="text-xs text-emerald-400 font-medium mt-1">SAVE 81%</div>
              </div>
            </motion.div>

            {/* How It Works */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold text-white">How It Works</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    step: "1️⃣",
                    title: "Sign Up",
                    text: "Register for the reseller program and get instant access",
                  },
                  {
                    step: "2️⃣",
                    title: "Get Your Portal",
                    text: "Access your dedicated dashboard to manage clients and services",
                  },
                  {
                    step: "3️⃣",
                    title: "Start Earning",
                    text: "Sell SMS, hosting, and domains at your own prices",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl glass border border-white/10 p-4 text-center"
                  >
                    <div className="text-2xl mb-2">{item.step}</div>
                    <div className="font-semibold text-foreground mb-1">{item.title}</div>
                    <div className="text-xs text-muted-foreground">{item.text}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Why Become Reseller */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-xl font-semibold text-white mb-4">
                Why Become a TalkSasa Reseller?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {benefits.map((b) => (
                  <div
                    key={b.title}
                    className="rounded-xl glass border border-white/10 p-4 flex items-start gap-3"
                  >
                    <span className="text-2xl shrink-0">{b.icon}</span>
                    <div>
                      <div className="font-semibold text-foreground text-sm mb-1">{b.title}</div>
                      <div className="text-xs text-muted-foreground">{b.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Perfect For */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35 }}
            >
              <h3 className="text-lg font-semibold text-white mb-3">Perfect For:</h3>
              <div className="flex flex-wrap gap-2">
                {perfectFor.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full glass border border-white/10 px-4 py-1.5 text-sm text-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                asChild
                size="lg"
                className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 border-0"
                data-track="reseller-cta-primary"
              >
                <a href={WHATSAPP_RESELLER_URL} target="_blank" rel="noopener noreferrer">
                  Start Your Reseller Business
                  <ArrowRight className="h-5 w-5 ml-2" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="flex-1"
                data-track="reseller-cta-guide"
              >
                <a href="#" onClick={(e) => e.preventDefault()}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Reseller Guide
                </a>
              </Button>
            </motion.div>

            {/* Limited Time Offer */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="rounded-xl bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 p-4 text-center"
            >
              <p className="text-sm font-medium text-foreground">
                🎯 Limited Time: First 20 resellers get 20,000 SMS credits (instead of 13,000)
              </p>
            </motion.div>

            {/* Trust Elements */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-wrap gap-4 text-xs text-muted-foreground"
            >
              <span className="flex items-center gap-1">
                <Check className="h-3 w-3 text-emerald-500" />
                No Lock-in Contract
              </span>
              <span className="flex items-center gap-1">
                <Check className="h-3 w-3 text-emerald-500" />
                Cancel Anytime
              </span>
              <span className="flex items-center gap-1">
                <Check className="h-3 w-3 text-emerald-500" />
                24/7 Support Included
              </span>
              <span className="flex items-center gap-1">
                <Check className="h-3 w-3 text-emerald-500" />
                Training Provided
              </span>
            </motion.div>

            {/* FAQ */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl glass border border-white/10 p-6"
            >
              <h3 className="text-xl font-semibold text-foreground mb-4">Frequently Asked Questions</h3>
              <div className="space-y-0">
                {faqs.map((faq) => (
                  <FAQItem key={faq.q} q={faq.q} a={faq.a} />
                ))}
              </div>
            </motion.div>

            {/* Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl glass border border-white/10 p-6"
            >
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Have questions about the reseller program?
              </h3>
              <div className="space-y-3">
                <a
                  href={`mailto:${INFO_EMAIL}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  data-track="reseller-email-info"
                >
                  <Mail className="h-4 w-4" />
                  {INFO_EMAIL}
                </a>
                <a
                  href={`mailto:${SALES_EMAIL}`}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  data-track="reseller-email-sales"
                >
                  <Mail className="h-4 w-4" />
                  {SALES_EMAIL}
                </a>
                <a
                  href={WHATSAPP_RESELLER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  data-track="reseller-whatsapp"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp: +254 712 295 880
                </a>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  data-track="reseller-whatsapp"
                >
                  <a href={WHATSAPP_RESELLER_URL} target="_blank" rel="noopener noreferrer">
                    Chat with our reseller team
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            {/* Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="hidden md:block relative rounded-2xl glass border border-white/20 p-6 bg-background/80 shadow-2xl"
            >
              <div className="aspect-[4/5] rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 p-4 flex flex-col gap-3">
                {/* Mock dashboard */}
                <div className="flex items-center justify-between mb-2">
                  <div className="h-6 w-24 rounded bg-primary/30" />
                  <div className="h-6 w-6 rounded-full bg-primary/30" />
                </div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-full rounded bg-white/10" />
                  <div className="h-4 w-3/4 rounded bg-white/10" />
                  <div className="h-4 w-5/6 rounded bg-white/10" />
                </div>
                <div className="h-24 rounded bg-gradient-to-br from-emerald-500/20 to-lime-500/20 border border-emerald-500/20" />
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-12 rounded bg-white/5" />
                  <div className="h-12 rounded bg-white/5" />
                  <div className="h-12 rounded bg-white/5" />
                </div>
              </div>
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-2 -right-2 rounded-lg glass border border-white/20 p-2 shadow-lg"
              >
                <TrendingUp className="h-5 w-5 text-emerald-400" />
              </motion.div>
            </motion.div>

            {/* Success Stats */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-3"
            >
              {[
                { icon: Users, label: "Active Resellers", value: "100+" },
                { icon: TrendingUp, label: "Partner Earnings", value: "KES 5M+" },
                { icon: Star, label: "Partner Rating", value: "4.9★" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-xl glass border border-white/10 p-4 flex items-center gap-3"
                >
                  <div className="rounded-lg bg-primary/20 p-2 text-primary">
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-foreground">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
