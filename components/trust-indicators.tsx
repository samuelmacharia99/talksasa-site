"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";

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

function LogoPlaceholder({ name }: { name: string }) {
  return (
    <div className="group flex shrink-0 min-w-[7.5rem] max-w-[11rem] h-14 sm:h-16 rounded-xl glass border border-border/80 grayscale hover:grayscale-0 transition-all duration-300 items-center justify-center mx-3 sm:mx-4 px-4 hover:border-primary/30 hover:shadow-glow-sm">
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
      <div className="flex w-max animate-marquee motion-reduce:animate-none shrink-0">
        {track.map((name, i) => (
          <LogoPlaceholder key={`${name}-${i}`} name={name} />
        ))}
      </div>
    </div>
  );
}

const testimonials = [
  {
    quote:
      "TalkSasa's bulk SMS API is rock-solid. We've sent millions of messages with zero downtime. Their support team actually responds.",
    name: "James Mwangi",
    company: "Jambo Pay",
    initials: "JM",
  },
  {
    quote:
      "We moved our infrastructure to TalkSasa — email, apps, and VPS. One dashboard, one bill, and 99.9% uptime as promised.",
    name: "Sarah Ochieng",
    company: "Savannah Tech",
    initials: "SO",
  },
  {
    quote:
      "The dedicated server setup was done in 24 hours. Full root access, great docs, and when we had questions, 24/7 support was there.",
    name: "David Kamau",
    company: "Nairobi Dev Studio",
    initials: "DK",
  },
  {
    quote:
      "Best value for SMS in the region. Delivery reports are accurate and the API is easy to integrate. Highly recommend for any scale.",
    name: "Grace Wanjiku",
    company: "HealthAlert Kenya",
    initials: "GW",
  },
];

function TestimonialsCarouselSimple() {
  const [index, setIndex] = useState(0);

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
    <div className="relative">
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
            type="button"
            aria-label={`Go to testimonial ${i + 1}`}
            onClick={() => setIndex(i)}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200",
              i === index ? "bg-primary/20" : "bg-transparent hover:bg-muted-foreground/10"
            )}
          >
            <span
              className={cn(
                "rounded-full transition-all duration-200",
                i === index ? "w-3 h-3 bg-primary" : "w-2 h-2 bg-muted-foreground/40"
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export function TrustIndicators() {
  return (
    <section className="section-py relative border-y border-border/60 bg-muted/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-10"
        >
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Trusted across <span className="gradient-text">East Africa</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            Enterprises and growing teams rely on TalkSasa for communications and cloud — with Nairobi
            support and 99.9% uptime targets.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl glass border border-border p-8 sm:p-10 mb-12"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <Counter value={7000} suffix="+" label="Businesses" />
            <Counter value={11000} suffix="+" label="Domains managed" />
            <CounterDecimal label="Uptime" />
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text">24/7</div>
              <div className="mt-1 text-sm text-muted-foreground">Nairobi support</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="text-center text-sm text-muted-foreground mb-6">Trusted by teams across the region</p>
          <LogosMarquee />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h3 className="text-lg sm:text-xl font-semibold text-center text-foreground mb-6">
            What our customers say
          </h3>
          <TestimonialsCarouselSimple />
        </motion.div>
      </div>
    </section>
  );
}
