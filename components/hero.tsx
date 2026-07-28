"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackCTAClick } from "@/components/analytics";
import { UptimeStatus } from "@/components/uptime-status";
import { HeroPlatformIllustration } from "@/components/hero-platform-illustration";
import { HERO } from "@/lib/cloud-content";
import { useReducedMotion, useIsCoarsePointer } from "@/lib/use-reduced-motion";

function ParticleBackground({ count }: { count: number }) {
  if (count === 0) return null;

  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1.5 + Math.random() * 2,
    delay: Math.random() * 5,
    duration: 8 + Math.random() * 6,
  }));

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
  const reducedMotion = useReducedMotion();
  const isCoarsePointer = useIsCoarsePointer();
  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const [particleCount, setParticleCount] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 600], [0, 150]);

  useEffect(() => {
    if (reducedMotion) {
      setParticleCount(0);
      return;
    }
    const update = () => setParticleCount(window.innerWidth < 768 ? 8 : 16);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [reducedMotion]);

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (isCoarsePointer || reducedMotion || !sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMouse({ x, y });
  };

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-0 lg:min-h-[90vh] flex flex-col items-center justify-center overflow-hidden pt-20 sm:pt-24 pb-16 sm:pb-20"
      onMouseMove={onMouseMove}
      onMouseLeave={() => setMouse({ x: 50, y: 50 })}
    >
      <div className="absolute inset-0 -z-10">
        <motion.div style={{ y: reducedMotion ? 0 : parallaxY }} className="absolute inset-0">
          <motion.div
            animate={
              reducedMotion
                ? undefined
                : { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }
            }
            transition={{ duration: 20, repeat: reducedMotion ? 0 : Infinity, ease: "linear" }}
            className="absolute inset-0 opacity-90"
            style={{
              background:
                "linear-gradient(135deg, #312e81 0%, #3730a3 20%, #4338ca 40%, #6366f1 50%, #7c3aed 70%, #8b5cf6 85%, #6366f1 100%)",
              backgroundSize: "200% 200%",
            }}
          />
        </motion.div>
        {!isCoarsePointer && !reducedMotion && (
          <div
            className="absolute inset-0 opacity-40 pointer-events-none transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${mouse.x}% ${mouse.y}%, rgba(99,102,241,0.4) 0%, transparent 50%)`,
            }}
          />
        )}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_80%_50%,rgba(139,92,246,0.2),transparent)]" />
        <div className="absolute inset-0 bg-background/50" />
        <ParticleBackground count={particleCount} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
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
            <span className="gradient-text">{HERO.headline}</span>{" "}
            {HERO.headlineAccent}
          </motion.h1>
          <motion.p
            variants={item}
            className="mt-6 text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0"
          >
            {HERO.subheadline}
          </motion.p>

          <motion.div
            variants={item}
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start"
          >
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto group bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 border-0 shadow-lg shadow-primary/25"
            >
              <Link href="/pricing" onClick={() => trackCTAClick("hero_view_pricing")}>
                <span className="flex items-center gap-2">
                  View pricing
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                </span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/book-demo" onClick={() => trackCTAClick("hero_talk_to_sales")}>
                Talk to sales
              </Link>
            </Button>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-6 flex flex-wrap justify-center lg:justify-start gap-x-3 gap-y-2 text-xs sm:text-sm text-muted-foreground"
          >
            {HERO.trust.map((text, i) => (
              <span key={text} className="flex items-center gap-3">
                {i > 0 && <span className="text-border" aria-hidden>·</span>}
                <span>{text}</span>
              </span>
            ))}
          </motion.div>

          <motion.div variants={item} className="mt-8 flex justify-center lg:justify-start">
            <UptimeStatus />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 w-full flex items-center justify-center"
        >
          <HeroPlatformIllustration />
        </motion.div>
      </div>

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
