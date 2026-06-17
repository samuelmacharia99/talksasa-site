"use client";

import { motion } from "framer-motion";
import { MessageSquare, Check } from "lucide-react";
import { IllustrationFrame } from "./illustration-frame";

const messages = [
  { text: "Order confirmed ✓", x: -70, y: -30, z: 40 },
  { text: "OTP: 482910", x: 75, y: -45, z: 55 },
  { text: "Pay via M-Pesa", x: -55, y: 50, z: 30 },
  { text: "Flash sale 20% off", x: 80, y: 35, z: 45 },
];

export function SmsBroadcastDesign({ compact }: { compact?: boolean }) {
  return (
    <IllustrationFrame compact={compact}>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ rotateY: [-8, 8, -8] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="relative [transform-style:preserve-3d]"
        >
          {/* Phone */}
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="relative z-20 w-28 sm:w-32 rounded-[1.75rem] border-2 border-border glass p-2 shadow-2xl"
            style={{ transform: "translateZ(30px)" }}
          >
            <div className="rounded-[1.25rem] bg-background/80 p-3 space-y-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold">Bulk SMS</span>
              </div>
              <motion.div
                animate={{ scaleX: [0, 1] }}
                transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 1.5 }}
                className="h-1.5 rounded-full bg-primary/60 origin-left"
              />
              <p className="text-[10px] text-muted-foreground">2,847 sent today</p>
            </div>
          </motion.div>

          {/* Floating bubbles */}
          {messages.map((msg, i) => (
            <motion.div
              key={msg.text}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: [0.6, 1, 0.6],
                y: [msg.y, msg.y - 8, msg.y],
                x: [msg.x, msg.x + (i % 2 ? 4 : -4), msg.x],
              }}
              transition={{ duration: 2.5 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
              style={{ transform: `translateZ(${msg.z}px)` }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl glass border border-primary/25 px-2.5 py-1.5 text-[10px] sm:text-xs font-medium whitespace-nowrap shadow-lg"
            >
              {msg.text}
            </motion.div>
          ))}

          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 -z-10 rounded-full bg-primary/20 blur-2xl"
            style={{ transform: "translateZ(-20px)" }}
          />
        </motion.div>
      </div>
    </IllustrationFrame>
  );
}

export function SmsResellerDesign({ compact }: { compact?: boolean }) {
  const clients = ["Agency A", "Shop B", "Bank C"];
  return (
    <IllustrationFrame compact={compact}>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ rotateY: [-10, 10, -10] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-[240px] h-[220px] [transform-style:preserve-3d]"
        >
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 rounded-2xl glass border border-primary/40 px-5 py-4 shadow-glow-sm text-center"
            style={{ transform: "translateZ(50px)" }}
          >
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Your brand</p>
            <p className="text-sm font-bold mt-1">SMS Reseller</p>
            <div className="mt-2 flex items-center justify-center gap-1 text-emerald-500">
              <Check className="h-3.5 w-3.5" />
              <span className="text-xs">Wholesale rates</span>
            </div>
          </motion.div>

          {clients.map((name, i) => {
            const angle = (i * 120 * Math.PI) / 180;
            const x = Math.cos(angle) * 90;
            const y = Math.sin(angle) * 70;
            return (
              <motion.div
                key={name}
                animate={{ y: [y, y - 5, y] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.35 }}
                className="absolute top-1/2 left-1/2 rounded-lg glass border border-border/70 px-3 py-2 text-xs font-medium"
                style={{
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) translateZ(${20 + i * 10}px)`,
                }}
              >
                <MessageSquare className="h-3.5 w-3.5 text-primary inline mr-1" />
                {name}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </IllustrationFrame>
  );
}
