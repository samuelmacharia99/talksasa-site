"use client";

import { useRef, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Server,
  Globe,
  Layers,
  Boxes,
  Cloud,
  ArrowRight,
  Check,
} from "lucide-react";

type ServiceCard = {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href: string;
  features: string[];
  /** Bento: col-span on lg (1 or 2) */
  colSpan?: 1 | 2;
  /** Bento: row-span on lg (1 or 2) */
  rowSpan?: 1 | 2;
};

const services: ServiceCard[] = [
  {
    id: "bulk-sms",
    icon: MessageSquare,
    title: "Bulk SMS",
    description:
      "Send millions of messages instantly with our reliable SMS gateway. Perfect for marketing, notifications, and 2FA.",
    href: "https://bulksms.talksasa.com",
    features: ["API Access", "Delivery Reports", "Sender ID customization"],
    colSpan: 2,
    rowSpan: 1,
  },
  {
    id: "web-hosting",
    icon: Server,
    title: "Web Hosting",
    description:
      "Lightning-fast SSD hosting with cPanel, 99.9% uptime guarantee, and free SSL certificates.",
    href: "https://servers.talksasa.com",
    features: ["Free SSL", "Daily Backups", "cPanel included"],
    colSpan: 1,
    rowSpan: 1,
  },
  {
    id: "domains",
    icon: Globe,
    title: "Domain Registration",
    description:
      "Search and register your perfect domain. Over 3,000 domains already trusted to us.",
    features: ["Free WHOIS Privacy", "Easy DNS Management", "Bulk discounts"],
    href: "#",
    colSpan: 1,
    rowSpan: 1,
  },
  {
    id: "vps",
    icon: Layers,
    title: "VPS Hosting",
    description:
      "Scalable virtual private servers with full root access and your choice of OS.",
    features: ["SSD Storage", "Dedicated Resources", "Instant Setup"],
    href: "#",
    colSpan: 2,
    rowSpan: 1,
  },
  {
    id: "dedicated",
    icon: Boxes,
    title: "Dedicated Servers",
    description:
      "Enterprise-grade bare metal servers for maximum performance and control.",
    features: ["Full Control", "Custom Configs", "Premium Support"],
    href: "#",
    colSpan: 1,
    rowSpan: 1,
  },
  {
    id: "cloud",
    icon: Cloud,
    title: "Cloud Solutions",
    description:
      "Flexible cloud infrastructure that grows with your business needs.",
    href: "https://servers.talksasa.com",
    features: ["Scalable", "Managed", "Pay as you grow"],
    colSpan: 2,
    rowSpan: 1,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
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
      className={`card-tilt h-full flex flex-col rounded-2xl p-6 sm:p-8 glass border border-border transition-all duration-300 hover:border-primary/40 hover:shadow-glow-sm hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(99,102,241,0.15)] group relative overflow-hidden
        ${service.colSpan === 2 ? "md:col-span-2 lg:col-span-2" : ""}
        ${service.rowSpan === 2 ? "lg:row-span-2" : ""}
      `}
    >
      {/* Gradient border glow on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          padding: "1px",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      <div className="relative flex flex-col h-full">
        <div className="rounded-xl bg-primary/10 w-fit p-3 text-primary group-hover:bg-primary/20 transition-colors">
          <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
        </div>
        <h3 className="mt-4 text-xl sm:text-2xl font-semibold text-foreground">
          {service.title}
        </h3>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed flex-1">
          {service.description}
        </p>
        <ul className="mt-4 space-y-2">
          {service.features.map((feature) => (
            <li
              key={feature}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
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
          Learn More
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </motion.div>
  );
}

export function Services() {
  return (
    <section id="services" className="py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Everything you need to{" "}
            <span className="gradient-text">grow online</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            From messaging to infrastructure, we power businesses of every size.
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
