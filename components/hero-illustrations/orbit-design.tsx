"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { platformPillars } from "@/lib/platform-menu";
import { IllustrationFrame } from "./illustration-frame";

const ORBIT_RADIUS = 98;

export function OrbitDesign() {
  return (
    <IllustrationFrame>
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        {/* Orbit track */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute w-[220px] h-[220px] sm:w-[260px] sm:h-[260px] md:w-[300px] md:h-[300px] rounded-full border border-primary/20"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
          className="absolute w-[170px] h-[170px] sm:w-[200px] sm:h-[200px] md:w-[230px] md:h-[230px] rounded-full border border-dashed border-purple-500/20"
        />

        {/* Center */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 16 }}
          className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full glass border border-primary/40 flex flex-col items-center justify-center shadow-glow-sm"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-1 rounded-full border-t-2 border-primary/60"
          />
          <span className="text-xs font-bold text-primary uppercase">Core</span>
        </motion.div>

        {/* Satellites */}
        <motion.div
          className="absolute w-full h-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        >
          {platformPillars.map((pillar, i) => {
            const angle = (i * 120 * Math.PI) / 180;
            const x = Math.cos(angle) * ORBIT_RADIUS;
            const y = Math.sin(angle) * ORBIT_RADIUS;
            const Icon = pillar.icon;
            const isExternal = pillar.href.startsWith("http");
            const Comp = isExternal ? "a" : Link;

            return (
              <motion.div
                key={pillar.id}
                className="absolute top-1/2 left-1/2"
                style={{ x, y, translateX: "-50%", translateY: "-50%" }}
                animate={{ rotate: -360 }}
                transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
              >
                <Comp
                  href={pillar.href}
                  {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  <motion.div
                    whileHover={{ scale: 1.06 }}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ y: { duration: 2 + i * 0.4, repeat: Infinity, ease: "easeInOut" } }}
                    className="rounded-xl glass border border-border/80 px-2.5 py-2 sm:px-4 sm:py-3 shadow-lg min-w-[108px] sm:min-w-[150px] hover:border-primary/40"
                  >
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-primary/15 p-1.5 text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-[11px] sm:text-sm font-semibold">{pillar.label}</div>
                        <div className="text-xs text-muted-foreground hidden sm:block">{pillar.detail}</div>
                      </div>
                    </div>
                  </motion.div>
                </Comp>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </IllustrationFrame>
  );
}
