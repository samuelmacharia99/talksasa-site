"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  platformPillars,
  deployPipelineSteps,
  PLATFORM_HUB,
  type PlatformPillarId,
} from "@/lib/platform-menu";
import { cn } from "@/lib/utils";
import { IllustrationFrame } from "./illustration-frame";

const HUB_PATH = `M ${PLATFORM_HUB.x} ${PLATFORM_HUB.y}`;

function DeployPipelineBadge() {
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setActiveIndex((i) => (i + 1) % deployPipelineSteps.length), 2200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-8 z-20 rounded-xl glass border border-primary/25 px-2.5 py-1.5 sm:px-4 sm:py-2.5 shadow-glow-sm overflow-hidden max-w-[calc(100%-5rem)] sm:max-w-none">
      <div className="sm:hidden font-mono text-xs text-primary px-1 py-0.5">
        {deployPipelineSteps[activeIndex]}
      </div>
      <div className="hidden sm:flex items-center gap-1.5 sm:gap-2 font-mono text-xs">
        {deployPipelineSteps.map((step, i) => (
          <span key={step} className="flex items-center gap-1.5 sm:gap-2">
            {i > 0 && <span className="text-primary/60">→</span>}
            <motion.span
              animate={{
                color: activeIndex === i ? "rgb(139, 92, 246)" : "rgb(148, 163, 184)",
                scale: activeIndex === i ? 1.05 : 1,
              }}
              className={cn("relative px-1.5 py-0.5 rounded", activeIndex === i && "bg-primary/15")}
            >
              {step}
            </motion.span>
          </span>
        ))}
      </div>
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"
        animate={{ width: ["0%", "100%"] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

function PillarCard({
  pillar,
  isActive,
  index,
}: {
  pillar: (typeof platformPillars)[number];
  isActive: boolean;
  index: number;
}) {
  const Icon = pillar.icon;
  const isExternal = pillar.href.startsWith("http");
  const Comp = isExternal ? "a" : Link;
  const floatY = pillar.id === "applications" ? [0, -3, 0] : [0, -6, 0];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: floatY }}
      transition={{
        opacity: { duration: 0.5, delay: 0.2 + index * 0.15 },
        scale: { duration: 0.5, delay: 0.2 + index * 0.15, type: "spring", stiffness: 280 },
        y: { duration: 3.2 + pillar.floatOffset, repeat: Infinity, ease: "easeInOut", delay: pillar.floatOffset },
      }}
      style={{ zIndex: isActive ? 30 : 10 + index }}
      className={cn("absolute", pillar.positionClass)}
    >
      <Comp
        href={pillar.href}
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className={cn(
          "block rounded-xl glass border px-2.5 py-2 sm:px-4 sm:py-3 min-w-[108px] sm:min-w-[148px] shadow-lg transition-all duration-300 hover:scale-[1.03]",
          isActive ? "border-primary/50 shadow-[0_0_24px_-4px_rgba(139,92,246,0.45)]" : "border-border/80"
        )}
      >
        <div className="flex items-center gap-2">
          <motion.div
            animate={isActive ? { scale: [1, 1.12, 1] } : { scale: 1 }}
            transition={{ duration: 1.2, repeat: isActive ? Infinity : 0 }}
            className={cn("rounded-lg p-1.5", isActive ? "bg-primary/25 text-primary" : "bg-primary/15 text-primary")}
          >
            <Icon className="h-4 w-4" aria-hidden />
          </motion.div>
          <div>
            <div className="text-xs sm:text-sm font-semibold text-foreground">{pillar.label}</div>
            <div className="text-[10px] sm:text-xs text-muted-foreground">{pillar.detail}</div>
          </div>
        </div>
        <AnimatePresence mode="popLayout" initial={false}>
          {isActive && (
            <motion.div
              key={`${pillar.id}-bar`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ scaleX: 0 }}
              className="mt-2 h-0.5 origin-left rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
            />
          )}
        </AnimatePresence>
      </Comp>
    </motion.div>
  );
}

export function HubNetworkDesign() {
  const [activePillar, setActivePillar] = useState<PlatformPillarId>("messaging");

  useEffect(() => {
    let i = 0;
    const order: PlatformPillarId[] = ["messaging", "hosting", "applications"];
    const timer = setInterval(() => {
      i = (i + 1) % order.length;
      setActivePillar(order[i]);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const linePaths = platformPillars.map((p) => `${HUB_PATH} L ${p.lineEnd.x} ${p.lineEnd.y}`);

  return (
    <IllustrationFrame>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] sm:w-[260px] sm:h-[260px] rounded-full border border-dashed border-primary/15 pointer-events-none"
      />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[5]">
        <motion.div
          animate={{ boxShadow: ["0 0 0 0 rgba(139,92,246,0.35)", "0 0 0 14px rgba(139,92,246,0)", "0 0 0 0 rgba(139,92,246,0)"] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl glass border border-primary/40 flex flex-col items-center justify-center"
        >
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">TalkSasa</span>
          <span className="text-[10px] sm:text-xs text-muted-foreground mt-1">Platform</span>
        </motion.div>
      </div>

      <svg viewBox="0 0 400 380" className="absolute inset-0 w-full h-full z-0 pointer-events-none" aria-hidden>
        <defs>
          <linearGradient id="hub-line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.35" />
          </linearGradient>
        </defs>
        {linePaths.map((d, i) => {
          const pillar = platformPillars[i];
          const isActive = activePillar === pillar.id;
          return (
            <motion.path
              key={pillar.id}
              d={d}
              stroke="url(#hub-line-gradient)"
              strokeWidth={isActive ? 2.5 : 1.5}
              fill="none"
              strokeDasharray="8 6"
              animate={{ opacity: isActive ? 0.9 : 0.45, strokeDashoffset: [0, -28] }}
              transition={{ strokeDashoffset: { duration: 1.2, repeat: Infinity, ease: "linear" } }}
            />
          );
        })}
      </svg>

      {platformPillars.map((pillar, index) => (
        <PillarCard key={pillar.id} pillar={pillar} isActive={activePillar === pillar.id} index={index} />
      ))}
      <DeployPipelineBadge />
    </IllustrationFrame>
  );
}
