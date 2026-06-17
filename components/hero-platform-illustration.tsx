"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HubNetworkDesign } from "@/components/hero-illustrations/hub-network";
import { OrbitDesign } from "@/components/hero-illustrations/orbit-design";
import { StackDesign } from "@/components/hero-illustrations/stack-design";
import { PipelineDesign } from "@/components/hero-illustrations/pipeline-design";
import { DomainSearchDesign } from "@/components/hero-illustrations/domain-search-design";
import { cn } from "@/lib/utils";

const ROTATE_MS = 4000;

const heroDesigns = [
  { id: "hub", label: "Platform hub", Component: HubNetworkDesign },
  { id: "orbit", label: "Orbiting services", Component: OrbitDesign },
  { id: "stack", label: "Product stack", Component: StackDesign },
  { id: "pipeline", label: "Deploy pipeline", Component: PipelineDesign },
  { id: "domains", label: "Domain search", Component: DomainSearchDesign },
] as const;

const slideVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    scale: 0.94,
    x: direction > 0 ? 48 : -48,
    filter: "blur(6px)",
  }),
  center: {
    opacity: 1,
    scale: 1,
    x: 0,
    filter: "blur(0px)",
  },
  exit: (direction: number) => ({
    opacity: 0,
    scale: 0.96,
    x: direction > 0 ? -48 : 48,
    filter: "blur(6px)",
  }),
};

export function HeroPlatformIllustration() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((index: number) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
  }, [activeIndex]);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setDirection(1);
      setActiveIndex((i) => (i + 1) % heroDesigns.length);
    }, ROTATE_MS);
    return () => clearInterval(timer);
  }, [paused]);

  const ActiveComponent = heroDesigns[activeIndex].Component;

  return (
    <div
      className="relative w-full max-w-lg mx-auto h-[300px] sm:h-[360px] md:h-[380px] lg:h-[420px] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={heroDesigns[activeIndex].id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0 overflow-hidden"
        >
          <ActiveComponent />
        </motion.div>
      </AnimatePresence>

      {/* Design indicators */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-1 sm:gap-2 z-40 max-w-full px-2">
        {heroDesigns.map((design, i) => (
          <button
            key={design.id}
            type="button"
            aria-label={`Show ${design.label} illustration`}
            aria-current={i === activeIndex ? "true" : undefined}
            onClick={() => goTo(i)}
            className="group relative p-2 min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full"
          >
            <span className="relative block h-1.5 rounded-full overflow-hidden bg-muted-foreground/25">
              <span
                className={cn(
                  "block h-full rounded-full transition-all duration-300",
                  i === activeIndex ? "bg-primary w-6 sm:w-8" : "w-1.5 bg-muted-foreground/40 group-hover:bg-muted-foreground/70"
                )}
              />
              {i === activeIndex && !paused && (
                <motion.span
                  key={`progress-${activeIndex}`}
                  className="absolute inset-0 rounded-full bg-primary/30 origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: ROTATE_MS / 1000, ease: "linear" }}
                />
              )}
            </span>
          </button>
        ))}
      </div>

      {/* Active design label */}
      <motion.p
        key={heroDesigns[activeIndex].label}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-0 left-1/2 -translate-x-1/2 text-xs font-medium uppercase tracking-wider text-muted-foreground/80 pointer-events-none whitespace-nowrap px-2"
      >
        {heroDesigns[activeIndex].label}
      </motion.p>
    </div>
  );
}
