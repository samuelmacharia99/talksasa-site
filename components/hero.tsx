"use client";

import { useRef, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, animate, useInView, useMotionValue, useTransform, useScroll } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCTAModal } from "@/components/cta-modal";
import { trackCTAClick } from "@/components/analytics";
import { UptimeStatus } from "@/components/uptime-status";
import { HeroPlatformIllustration } from "@/components/hero-platform-illustration";

/* Animated counter for stats */
function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  duration = 1.5,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const motionValue = useMotionValue(0);
  const display = useTransform(motionValue, (v) =>
    `${prefix}${Math.round(v).toLocaleString()}${suffix}`
  );

  useEffect(() => {
    if (!inView) return;
    const controls = animate(motionValue, value, {
      duration,
      ease: [0.25, 0.46, 0.45, 0.94],
    });
    return controls.stop;
  }, [inView, value, motionValue, duration]);

  return <motion.span ref={ref}>{display}</motion.span>;
}

/* Floating stat card (integer values) */
function StatCard({
  value,
  label,
  delay,
  prefix = "",
  suffix = "",
}: {
  value: number;
  label: string;
  delay: number;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay }}
      className="rounded-xl glass border border-border/80 px-4 py-3 sm:px-5 sm:py-4 min-w-[140px] sm:min-w-[160px]"
    >
      <div className="text-xl sm:text-2xl font-bold gradient-text">
        {prefix}
        <AnimatedCounter value={value} suffix={suffix} duration={1.8} />
      </div>
      <div className="mt-0.5 text-xs sm:text-sm text-muted-foreground">{label}</div>
    </motion.div>
  );
}

/* Fix StatCard for decimal: use a single AnimatedCounter that goes to 99.9 */
function StatCardDecimal({ label, delay }: { label: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const motionValue = useMotionValue(0);
  const display = useTransform(motionValue, (v) => `${v.toFixed(1)}%`);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(motionValue, 99.9, {
      duration: 1.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    });
    return controls.stop;
  }, [inView, motionValue]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay }}
      className="rounded-xl glass border border-border/80 px-4 py-3 sm:px-5 sm:py-4 min-w-[140px] sm:min-w-[160px]"
    >
      <div className="text-xl sm:text-2xl font-bold gradient-text">
        <motion.span>{display}</motion.span>
      </div>
      <div className="mt-0.5 text-xs sm:text-sm text-muted-foreground">{label}</div>
    </motion.div>
  );
}

import { HERO } from "@/lib/cloud-content";
import { BULK_SMS_URL, HOSTING_URL } from "@/lib/urls";

/* Particle dots for background */
function ParticleBackground() {
  const count = 30;
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1.5 + Math.random() * 2,
        delay: Math.random() * 5,
        duration: 8 + Math.random() * 6,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary/40"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 10, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export function Hero() {
  const { openModal } = useCTAModal();
  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 600], [0, 150]);


  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMouse({ x, y });
  };

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-0 lg:min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 sm:pt-24 pb-16 sm:pb-20"
      onMouseMove={onMouseMove}
      onMouseLeave={() => setMouse({ x: 50, y: 50 })}
    >
      {/* Parallax + gradient background */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          style={{ y: parallaxY }}
          className="absolute inset-0"
        >
          <motion.div
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 opacity-90"
            style={{
              background:
                "linear-gradient(135deg, #312e81 0%, #3730a3 20%, #4338ca 40%, #6366f1 50%, #7c3aed 70%, #8b5cf6 85%, #6366f1 100%)",
              backgroundSize: "200% 200%",
            }}
          />
        </motion.div>
        {/* Gradient follows mouse */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${mouse.x}% ${mouse.y}%, rgba(99,102,241,0.4) 0%, transparent 50%)`,
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_80%_50%,rgba(139,92,246,0.2),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_20%_80%,rgba(168,85,247,0.15),transparent)]" />
        <div className="absolute inset-0 bg-background/50" />
        <ParticleBackground />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
        {/* Left: copy + CTAs + stats */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex-1 text-center lg:text-left max-w-2xl"
        >
          <motion.p
            variants={item}
            className="text-sm font-medium uppercase tracking-wider text-primary/90"
          >
            {HERO.eyebrow}
          </motion.p>
          <motion.h1
            variants={item}
            className="mt-3 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-balance"
          >
            {HERO.headline}{" "}
            <span className="gradient-text">{HERO.headlineAccent}</span>
          </motion.h1>
          <motion.p
            variants={item}
            className="mt-6 text-base sm:text-lg md:text-xl text-muted-foreground"
          >
            {HERO.subheadline}
          </motion.p>
          <motion.p variants={item} className="mt-3 text-sm text-primary/90 font-medium italic">
            {HERO.tagline}
          </motion.p>
          <motion.div
            variants={item}
            className="mt-8 sm:mt-10 flex flex-col md:flex-row flex-wrap gap-3 md:gap-4 justify-center lg:justify-start"
          >
            <Button size="lg" className="w-full md:w-auto group bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 border-0 shadow-lg shadow-primary/25 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" onClick={() => { trackCTAClick("hero_start_customer"); openModal(); }}>
              <span className="flex items-center gap-2">
                Start as a customer
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </span>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full md:w-auto">
              <Link href="/bulk-sms">Explore bulk SMS</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full md:w-auto">
              <Link href="/reseller">Become a reseller</Link>
            </Button>
          </motion.div>
          <motion.div variants={item} className="mt-4 flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 justify-center lg:justify-start">
            <Button asChild variant="ghost" size="sm" className="w-full sm:w-auto text-muted-foreground">
              <a href={HOSTING_URL} target="_blank" rel="noopener noreferrer">
                Open cloud portal →
              </a>
            </Button>
            <Button asChild variant="ghost" size="sm" className="w-full sm:w-auto text-muted-foreground">
              <a href={BULK_SMS_URL} target="_blank" rel="noopener noreferrer">
                Open bulk SMS portal →
              </a>
            </Button>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-6 flex flex-wrap justify-center lg:justify-start gap-x-4 gap-y-2 text-xs sm:text-sm text-muted-foreground"
          >
            {HERO.trust.map((text, i) => (
              <span key={text} className="flex items-center gap-4">
                {i > 0 && <span className="hidden sm:inline text-border" aria-hidden>·</span>}
                <span>{text}</span>
              </span>
            ))}
          </motion.div>

          {/* Floating stats cards */}
          <motion.div
            variants={item}
            className="mt-12 lg:mt-16 flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4"
          >
            <StatCard value={7000} suffix="+" label="Active Users" delay={0.1} />
            <StatCard value={11000} suffix="+" label="Domains Managed" delay={0.2} />
            <StatCardDecimal label="Uptime" delay={0.3} />
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="rounded-xl glass border border-border/80 px-4 py-3 sm:px-5 sm:py-4 min-w-[140px] sm:min-w-[160px]"
            >
              <div className="text-xl sm:text-2xl font-bold gradient-text">24/7</div>
              <div className="mt-0.5 text-xs sm:text-sm text-muted-foreground">Support</div>
            </motion.div>
          </motion.div>
          <motion.div variants={item} className="mt-6 flex justify-center lg:justify-start">
            <UptimeStatus />
          </motion.div>
        </motion.div>

        {/* Right: hero illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 w-full flex items-center justify-center"
        >
          <HeroPlatformIllustration />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1"
      >
        <span className="text-xs text-muted-foreground">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-6 w-6 text-muted-foreground" />
        </motion.div>
      </motion.div>
    </section>
  );
}
