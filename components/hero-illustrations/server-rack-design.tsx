"use client";

import { motion } from "framer-motion";
import { IllustrationFrame } from "./illustration-frame";

const units = [
  { load: 72, color: "bg-emerald-500" },
  { load: 45, color: "bg-primary" },
  { load: 88, color: "bg-amber-500" },
  { load: 34, color: "bg-sky-500" },
];

export function ServerRackDesign({ compact }: { compact?: boolean }) {
  return (
    <IllustrationFrame compact={compact}>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ rotateY: [-14, 14, -14], rotateX: [2, 6, 2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="relative [transform-style:preserve-3d]"
        >
          <div
            className="rounded-2xl glass border border-border p-3 sm:p-4 shadow-2xl"
            style={{ transform: "translateZ(20px)" }}
          >
            <div className="flex gap-1 mb-3">
              <span className="h-2 w-2 rounded-full bg-red-400/80" />
              <span className="h-2 w-2 rounded-full bg-amber-400/80" />
              <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
            </div>
            <div className="space-y-2 w-[180px] sm:w-[200px]">
              {units.map((unit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-lg border border-border/60 bg-background/50 px-3 py-2"
                  style={{ transform: `translateZ(${i * 8}px)` }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono text-muted-foreground">node-0{i + 1}</span>
                    <motion.span
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.25 }}
                      className={`h-1.5 w-1.5 rounded-full ${unit.color}`}
                    />
                  </div>
                  <div className="h-1 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className={`h-full ${unit.color}`}
                      animate={{ width: [`${unit.load - 10}%`, `${unit.load}%`, `${unit.load - 10}%`] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -right-8 top-4 rounded-lg glass border border-primary/30 px-2.5 py-1.5 text-[10px] font-mono text-primary"
            style={{ transform: "translateZ(45px)" }}
          >
            root@server
          </motion.div>
        </motion.div>
      </div>
    </IllustrationFrame>
  );
}
