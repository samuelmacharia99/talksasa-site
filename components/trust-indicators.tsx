"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import {
  Shield,
  Lock,
  Activity,
  Award,
  Quote,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* Animated counter (integer) */
function Counter({ value, suffix = "", label }: { value: number; suffix?: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const motionValue = useMotionValue(0);
  const display = useTransform(motionValue, (v) => `${Math.round(v).toLocaleString()}${suffix}`);

  useEffect(() => {
    if (!inView) return;
    const c = animate(motionValue, value, { duration: 1.8, ease: [0.25, 0.46, 0.45, 0.94] });
    return c.stop;
  }, [inView, value, motionValue]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text">
        <motion.span>{display}</motion.span>
      </div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

/* Animated counter (decimal for 99.9%) */
function CounterDecimal({ label }: { label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const motionValue = useMotionValue(0);
  const display = useTransform(motionValue, (v) => `${v.toFixed(1)}%`);

  useEffect(() => {
    if (!inView) return;
    const c = animate(motionValue, 99.9, { duration: 1.8, ease: [0.25, 0.46, 0.45, 0.94] });
    return c.stop;
  }, [inView, motionValue]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text">
        <motion.span>{display}</motion.span>
      </div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

/* Client logo pill for marquee */
function LogoPlaceholder({ name }: { name: string }) {
  return (
    <div className="group flex shrink-0 min-w-[7.5rem] max-w-[11rem] h-14 sm:h-16 rounded-xl glass border border-border/80 grayscale hover:grayscale-0 transition-all duration-300 flex items-center justify-center mx-3 sm:mx-4 px-4 hover:border-primary/30 hover:shadow-glow-sm">
      <span className="text-[11px] sm:text-xs font-semibold text-muted-foreground group-hover:text-foreground text-center leading-tight">
        {name}
      </span>
    </div>
  );
}

const LOGOS = [
  "Naitech",
  "Alinpay",
  "Centipid",
  "SmartPay",
  "Jaemnet",
  "SasaPay",
  "Isuzu",
  "Onfon Media",
  "Advanta",
  "Hostraha",
  "Riven Corp",
  "Bingwa Sokoni",
  "The Future Billing",
  "Moriasi3D",
  "Beam Networks",
  "Ekinpay",
  "Payless",
];

function LogosMarquee() {
  const track = [...LOGOS, ...LOGOS];
  return (
    <div className="relative overflow-hidden py-4">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-20 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-20 bg-gradient-to-l from-background to-transparent z-10" />
      <div className="flex w-max animate-marquee shrink-0">
        {track.map((name, i) => (
          <LogoPlaceholder key={`${name}-${i}`} name={name} />
        ))}
      </div>
    </div>
  );
}

const testimonials = [
  {
    quote: "TalkSasa's bulk SMS API is rock-solid. We've sent millions of messages with zero downtime. Their support team actually responds.",
    name: "James Mwangi",
    company: "Jambo Pay",
    initials: "JM",
  },
  {
    quote: "We moved our entire infrastructure to TalkSasa — hosting, domains, and VPS. One dashboard, one bill, and 99.9% uptime as promised.",
    name: "Sarah Ochieng",
    company: "Savannah Tech",
    initials: "SO",
  },
  {
    quote: "The dedicated server setup was done in 24 hours. Full root access, great docs, and when we had questions, 24/7 support was there.",
    name: "David Kamau",
    company: "Nairobi Dev Studio",
    initials: "DK",
  },
  {
    quote: "Best value for SMS in the region. Delivery reports are accurate and the API is easy to integrate. Highly recommend for any scale.",
    name: "Grace Wanjiku",
    company: "HealthAlert Kenya",
    initials: "GW",
  },
];

/* Carousel: single card at a time, auto-rotate + touch swipe */
function TestimonialsCarouselSimple() {
  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 5000);
    return () => clearInterval(id);
  }, []);

  const t = testimonials[index];

  const handleDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    if (info.offset.x < -50 || info.velocity.x < -200) {
      setIndex((i) => (i + 1) % testimonials.length);
    } else if (info.offset.x > 50 || info.velocity.x > 200) {
      setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <motion.div
        key={index}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.15}
        onDragEnd={handleDragEnd}
        className="rounded-2xl glass border border-border p-6 sm:p-8 touch-pan-y cursor-grab active:cursor-grabbing"
      >
        <Quote className="h-8 w-8 text-primary/50 mb-4" />
        <p className="text-muted-foreground leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
        <div className="mt-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
            {t.initials}
          </div>
          <div>
            <div className="font-medium text-foreground">{t.name}</div>
            <div className="text-sm text-muted-foreground">{t.company}</div>
          </div>
        </div>
      </motion.div>

      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to testimonial ${i + 1}`}
            onClick={() => setIndex(i)}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200",
              i === index ? "bg-primary/20" : "bg-transparent hover:bg-muted-foreground/10"
            )}
          >
            <span className={cn("rounded-full transition-all duration-200", i === index ? "w-3 h-3 bg-primary" : "w-2 h-2 bg-muted-foreground/40")} />
          </button>
        ))}
      </div>
    </div>
  );
}

const badges = [
  { icon: Shield, label: "SSL Certified" },
  { icon: Lock, label: "Data Protected" },
  { icon: Activity, label: "24/7 Monitored" },
  { icon: Award, label: "ISO Compliant" },
];

function SecurityBadges() {
  return (
    <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
      {badges.map(({ icon: Icon, label }) => (
        <div
          key={label}
          className="flex items-center gap-3 rounded-xl glass border border-border px-4 py-3 sm:px-5 sm:py-3"
        >
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <span className="text-sm font-medium text-foreground">{label}</span>
        </div>
      ))}
    </div>
  );
}

export function TrustIndicators() {
  return (
    <section className="section-py relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* 1. Stats counter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl glass border border-border p-8 sm:p-12 mb-16"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <Counter value={7000} suffix="+" label="Active Users" />
            <Counter value={11000} suffix="+" label="Domains Managed" />
            <CounterDecimal label="Uptime" />
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold gradient-text">24/7</div>
              <div className="mt-1 text-sm text-muted-foreground">Support</div>
            </div>
          </div>
        </motion.div>

        {/* 2. Client logos marquee */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="text-center text-sm text-muted-foreground mb-6">
            Trusted by innovative companies
          </p>
          <LogosMarquee />
        </motion.div>

        {/* 3. Testimonials carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 max-w-3xl mx-auto"
        >
          <h3 className="text-xl sm:text-2xl font-semibold text-center text-foreground mb-8">
            What our customers say
          </h3>
          <TestimonialsCarouselSimple />
        </motion.div>

        {/* 4. Security badges */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-center text-sm text-muted-foreground mb-6">
            Security & compliance
          </p>
          <SecurityBadges />
        </motion.div>
      </div>
    </section>
  );
}
