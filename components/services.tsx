"use client";

import { useRef, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Server,
  Globe,
  Container,
  Layers,
  CreditCard,
  Headphones,
  ArrowRight,
  Check,
  MessageSquare,
} from "lucide-react";
type ServiceCard = {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href: string;
  features: string[];
  colSpan?: 1 | 2;
};

const services: ServiceCard[] = [
  {
    id: "bulk-sms",
    icon: MessageSquare,
    title: "Bulk SMS",
    description:
      "Kenya's trusted SMS gateway for marketing, alerts, OTP/2FA, and API integrations. M-Pesa top-up, delivery reports, and reseller options.",
    href: "/bulk-sms",
    features: ["REST API & portal", "Sender ID support", "2,100+ businesses"],
    colSpan: 2,
  },
  {
    id: "shared-hosting",
    icon: Server,
    title: "Shared hosting",
    description:
      "DirectAdmin-powered hosting with automatic provisioning after payment. DNS, email, SSL, and backups included.",
    href: "/web-hosting",
    features: ["DirectAdmin on port 2222", "Auto-provision after M-Pesa", "Let's Encrypt SSL"],
    colSpan: 2,
  },
  {
    id: "cloud-apps",
    icon: Container,
    title: "Cloud apps",
    description:
      "Deploy Laravel, Node.js, Python and more. Git deploy, web terminal, logs, metrics, and custom domains.",
    href: "/cloud-hosting",
    features: ["Container auto-deploy", "Git & Laravel helpers", "Web terminal"],
    colSpan: 2,
  },
  {
    id: "domains",
    icon: Globe,
    title: "Domains",
    description:
      "Register and renew .co.ke, .com, .org. Transfer with EPP codes, manage DNS, and bundle with hosting at checkout.",
    href: "/domains",
    features: [".co.ke & global TLDs", "DNS management", "Transfer support"],
    colSpan: 1,
  },
  {
    id: "servers",
    icon: Layers,
    title: "VPS & dedicated",
    description:
      "Full root access for custom stacks, high-traffic sites, and enterprise workloads.",
    href: "/servers",
    features: ["VPS & bare metal", "Secure credentials", "Scalable resources"],
    colSpan: 1,
  },
  {
    id: "billing",
    icon: CreditCard,
    title: "Smart billing",
    description:
      "PDF invoices, M-Pesa STK push, cards, PayPal, wallet credits, and automatic renewal reminders.",
    href: "/payments/mpesa",
    features: ["M-Pesa STK push", "PDF invoices", "Wallet credits"],
    colSpan: 1,
  },
  {
    id: "support",
    icon: Headphones,
    title: "Support tickets",
    description:
      "Open, reply, and track issues in one thread. Service dashboard with renewal dates at a glance.",
    href: "/contact",
    features: ["Built-in ticketing", "Service dashboard", "24/7 team"],
    colSpan: 1,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function ServiceCardComponent({ service }: { service: ServiceCard }) {
  const Icon = service.icon;
  const isExternal = service.href.startsWith("http");
  const cardRef = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty("--tilt-x", `${y * -6}deg`);
    el.style.setProperty("--tilt-y", `${x * 6}deg`);
  }, []);

  const onMouseLeave = useCallback(() => {
    cardRef.current?.style.setProperty("--tilt-x", "0deg");
    cardRef.current?.style.setProperty("--tilt-y", "0deg");
  }, []);

  return (
    <motion.div
      ref={cardRef}
      variants={item}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`card-tilt h-full flex flex-col rounded-2xl p-6 sm:p-8 glass border border-border transition-all duration-300 hover:border-primary/40 hover:shadow-glow-sm hover:-translate-y-1 group relative overflow-hidden
        ${service.colSpan === 2 ? "md:col-span-2 lg:col-span-2" : ""}
        ${service.id === "support" ? "lg:col-span-3" : ""}`}
    >
      <div className="relative flex flex-col h-full">
        <div className="rounded-xl bg-primary/10 w-fit p-3 text-primary group-hover:bg-primary/20 transition-colors">
          <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
        </div>
        <h3 className="mt-4 text-xl sm:text-2xl font-semibold text-foreground">{service.title}</h3>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed flex-1">
          {service.description}
        </p>
        <ul className="mt-4 space-y-2">
          {service.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="h-4 w-4 shrink-0 text-primary" />
              {feature}
            </li>
          ))}
        </ul>
        <Link
          href={service.href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/90 transition-colors"
        >
          Learn more
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </motion.div>
  );
}

export function Services() {
  return (
    <section id="services" className="section-py relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-10 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            <span className="gradient-text">TalkSasa</span> — cloud hosting & bulk SMS
          </h2>
          <p className="mt-4 text-muted-foreground">
            Talksasa Cloud for hosting, domains, and apps — plus a bulk SMS gateway trusted across East Africa.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 auto-rows-fr"
        >
          {services.map((service) => (
            <ServiceCardComponent key={service.id} service={service} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
