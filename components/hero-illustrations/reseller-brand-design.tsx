"use client";

import { motion } from "framer-motion";
import { Tag, Users, CreditCard, Globe } from "lucide-react";
import { IllustrationFrame } from "./illustration-frame";

const orbitItems = [
  { icon: Users, label: "Clients", angle: 0 },
  { icon: CreditCard, label: "M-Pesa", angle: 120 },
  { icon: Globe, label: "Domains", angle: 240 },
];

export function ResellerBrandDesign({ compact }: { compact?: boolean }) {
  return (
    <IllustrationFrame compact={compact}>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ rotateY: [-10, 10, -10] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-[240px] h-[220px] [transform-style:preserve-3d]"
        >
          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-32 rounded-2xl glass border border-primary/50 p-4 text-center shadow-glow-sm"
            style={{ transform: "translate(-50%, -50%) translateZ(40px)" }}
          >
            <Tag className="h-5 w-5 text-primary mx-auto" />
            <p className="text-xs text-muted-foreground mt-2 uppercase tracking-wider">Your logo</p>
            <p className="text-sm font-bold mt-0.5">Reseller</p>
          </motion.div>

          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          >
            {orbitItems.map((item) => {
              const Icon = item.icon;
              const rad = (item.angle * Math.PI) / 180;
              const x = Math.cos(rad) * 95;
              const y = Math.sin(rad) * 75;
              return (
                <motion.div
                  key={item.label}
                  animate={{ rotate: -360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute top-1/2 left-1/2 rounded-xl glass border border-border/70 px-3 py-2"
                  style={{
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) translateZ(25px)`,
                  }}
                >
                  <div className="flex items-center gap-1.5 text-xs font-medium">
                    <Icon className="h-3.5 w-3.5 text-primary" />
                    {item.label}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[160px] rounded-full border border-dashed border-primary/20"
            style={{ transform: "translateZ(10px)" }}
          />
        </motion.div>
      </div>
    </IllustrationFrame>
  );
}
