"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, Check } from "lucide-react";
import { IllustrationFrame } from "./illustration-frame";

type Phase = "prompt" | "pin" | "success";

export function MpesaStkDesign({ compact }: { compact?: boolean }) {
  const [phase, setPhase] = useState<Phase>("prompt");

  useEffect(() => {
    const order: Phase[] = ["prompt", "pin", "success"];
    let i = 0;
    const timer = setInterval(() => {
      i = (i + 1) % order.length;
      setPhase(order[i]);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  return (
    <IllustrationFrame compact={compact}>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ rotateY: [-8, 8, -8], rotateX: [2, 5, 2] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="relative [transform-style:preserve-3d]"
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="relative z-10 w-36 sm:w-40 rounded-[2rem] border-2 border-border glass p-2 shadow-2xl"
            style={{ transform: "translateZ(35px)" }}
          >
            <div className="rounded-[1.5rem] bg-background/90 p-4 min-h-[160px] flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <Smartphone className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold">M-Pesa STK</span>
              </div>
              <AnimatePresence mode="wait">
                {phase === "prompt" && (
                  <motion.div
                    key="prompt"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-3"
                  >
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                      Pay KES 2,500
                    </p>
                    <p className="text-xs mt-1 text-muted-foreground">Talksasa Cloud invoice</p>
                  </motion.div>
                )}
                {phase === "pin" && (
                  <motion.div
                    key="pin"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex-1 flex flex-col items-center justify-center gap-2"
                  >
                    <p className="text-xs text-muted-foreground">Enter PIN</p>
                    <div className="flex gap-2">
                      {[0, 1, 2, 3].map((d) => (
                        <motion.span
                          key={d}
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ delay: d * 0.15, duration: 0.4 }}
                          className="h-2.5 w-2.5 rounded-full bg-primary"
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
                {phase === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col items-center justify-center text-emerald-500"
                  >
                    <Check className="h-8 w-8" />
                    <p className="text-xs font-medium mt-2">Payment received</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-emerald-500/20 blur-2xl -z-10"
            style={{ transform: "translateZ(-15px)" }}
          />
        </motion.div>
      </div>
    </IllustrationFrame>
  );
}
