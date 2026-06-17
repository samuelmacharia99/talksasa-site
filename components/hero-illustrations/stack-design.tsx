"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { platformPillars } from "@/lib/platform-menu";
import { IllustrationFrame } from "./illustration-frame";

const stackOffsets = [
  { y: 0, scale: 1, rotate: 0, z: 30 },
  { y: 14, scale: 0.96, rotate: -2, z: 20 },
  { y: 28, scale: 0.92, rotate: 2, z: 10 },
];

export function StackDesign() {
  const [frontIndex, setFrontIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setFrontIndex((i) => (i + 1) % platformPillars.length), 2400);
    return () => clearInterval(timer);
  }, []);

  const ordered = platformPillars.map((_, i) => {
    const idx = (frontIndex + i) % platformPillars.length;
    return { pillar: platformPillars[idx], stackPos: i };
  });

  return (
    <IllustrationFrame>
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="relative w-full max-w-[300px] h-[220px] sm:h-[240px]">
          <AnimatePresence mode="popLayout">
            {ordered.map(({ pillar, stackPos }) => {
              const offset = stackOffsets[stackPos];
              const Icon = pillar.icon;
              const isExternal = pillar.href.startsWith("http");
              const Comp = isExternal ? "a" : Link;
              const isFront = stackPos === 0;

              return (
                <motion.div
                  key={pillar.id}
                  layout
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  animate={{
                    opacity: 1,
                    y: offset.y,
                    scale: offset.scale,
                    rotate: offset.rotate,
                    zIndex: offset.z,
                  }}
                  exit={{ opacity: 0, y: -30, scale: 0.85 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  className="absolute inset-x-0 top-8"
                  style={{ zIndex: offset.z }}
                >
                  <Comp
                    href={pillar.href}
                    {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="block"
                  >
                    <motion.div
                      className={`rounded-2xl glass border p-5 sm:p-6 shadow-xl ${
                        isFront ? "border-primary/40 shadow-[0_0_32px_-8px_rgba(139,92,246,0.5)]" : "border-border/60"
                      }`}
                      animate={isFront ? { boxShadow: ["0 0 24px -8px rgba(139,92,246,0.35)", "0 0 36px -4px rgba(139,92,246,0.55)", "0 0 24px -8px rgba(139,92,246,0.35)"] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="flex items-center gap-3">
                        <motion.div
                          animate={isFront ? { scale: [1, 1.08, 1] } : {}}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="rounded-xl bg-primary/15 p-3 text-primary"
                        >
                          <Icon className="h-6 w-6" />
                        </motion.div>
                        <div>
                          <p className="text-base sm:text-lg font-semibold text-foreground">{pillar.label}</p>
                          <p className="text-sm text-muted-foreground">{pillar.detail}</p>
                        </div>
                      </div>
                      {isFront && (
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          className="mt-4 h-1 origin-left rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500"
                        />
                      )}
                    </motion.div>
                  </Comp>
                </motion.div>
              );
            })}
          </AnimatePresence>

          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -bottom-2 left-0 right-0 text-center text-xs text-muted-foreground"
          >
            Full stack on one platform
          </motion.p>
        </div>
      </div>
    </IllustrationFrame>
  );
}
