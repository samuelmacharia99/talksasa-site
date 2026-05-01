"use client";

import { useRef, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, animate, useInView, useMotionValue, useTransform, useScroll } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCTAModal } from "@/components/cta-modal";
import { trackCTAClick } from "@/components/analytics";
import { DomainSearch } from "@/components/domain-search";
import { UptimeStatus } from "@/components/uptime-status";

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

/* Abstract network illustration: nodes + connecting lines */
function HeroIllustration() {
  const nodes = useMemo(
    () => [
      { id: 0, x: 50, y: 20, r: 12 },
      { id: 1, x: 20, y: 45, r: 8 },
      { id: 2, x: 80, y: 40, r: 10 },
      { id: 3, x: 35, y: 75, r: 6 },
      { id: 4, x: 65, y: 70, r: 9 },
      { id: 5, x: 50, y: 55, r: 14 },
      { id: 6, x: 10, y: 65, r: 5 },
      { id: 7, x: 90, y: 75, r: 7 },
    ],
    []
  );
  const links = useMemo(
    () => [
      [0, 5],
      [1, 5],
      [2, 5],
      [5, 3],
      [5, 4],
      [1, 3],
      [2, 4],
      [0, 1],
      [0, 2],
      [1, 6],
      [2, 7],
      [3, 4],
    ],
    []
  );

  return (
    <div className="relative w-full max-w-lg mx-auto h-[280px] sm:h-[320px] lg:h-[360px]">
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full text-primary"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="hero-node-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <filter id="hero-glow">
            <feGaussianBlur stdDeviation="0.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Connection lines */}
        <g stroke="url(#hero-node-gradient)" strokeOpacity="0.5" strokeWidth="0.35" fill="none">
          {links.map(([a, b], i) => (
            <motion.line
              key={`${a}-${b}`}
              x1={nodes[a].x}
              y1={nodes[a].y}
              x2={nodes[b].x}
              y2={nodes[b].y}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ duration: 0.6, delay: 0.4 + i * 0.04 }}
            />
          ))}
        </g>
        {/* Nodes */}
        {nodes.map((node, i) => (
          <motion.circle
            key={node.id}
            r={node.r}
            cx={node.x}
            cy={node.y}
            fill="url(#hero-node-gradient)"
            filter="url(#hero-glow)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.06 }}
            className="drop-shadow-lg"
          />
        ))}
      </svg>
      {/* Subtle radial glow behind illustration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,rgba(99,102,241,0.12),transparent_70%)] pointer-events-none" />
    </div>
  );
}

/* Particle dots for background */
function ParticleBackground() {
  const count = 60;
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

  // Scroll to domain search when landing with #domain-search (e.g. from Services menu)
  useEffect(() => {
    if (typeof window !== "undefined" && (window.location.hash === "#domain-search" || window.location.hash === "domain-search")) {
      const el = document.getElementById("domain-search");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

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
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24 pb-20"
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
          <motion.h1
            variants={item}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-bold tracking-tight leading-[1.1]"
          >
            Your Complete{" "}
            <span className="gradient-text">Digital Infrastructure</span> Partner
          </motion.h1>
          <motion.p
            variants={item}
            className="mt-6 text-lg sm:text-xl text-muted-foreground"
          >
            From bulk SMS to enterprise hosting — scale your business with
            reliable telecommunications solutions trusted by 2,100+ companies.
          </motion.p>
          <motion.div
            variants={item}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <Button size="lg" className="group bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 border-0 shadow-lg shadow-primary/25 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" onClick={() => { trackCTAClick("hero_start_free_trial"); openModal(); }}>
              <span className="flex items-center gap-2">
                Start Free Trial
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </span>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link href="#pricing">View Pricing</Link>
            </Button>
          </motion.div>

          {/* Floating stats cards */}
          <motion.div
            variants={item}
            className="mt-12 lg:mt-16 flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4"
          >
            <StatCard value={2100} suffix="+" label="Active Users" delay={0.1} />
            <StatCard value={3000} suffix="+" label="Domains Managed" delay={0.2} />
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
          <HeroIllustration />
        </motion.div>
      </div>

      {/* Domain search - full width below */}
      <motion.div
        id="domain-search"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full mt-12 px-4"
      >
        <p className="text-center text-sm text-muted-foreground mb-3">Search for your domain</p>
        <DomainSearch />
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
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
