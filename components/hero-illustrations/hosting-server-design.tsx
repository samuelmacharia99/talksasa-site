"use client";

import { motion } from "framer-motion";
import { Server, Database, Shield, Mail } from "lucide-react";
import { IllustrationFrame } from "./illustration-frame";

const layers = [
  { icon: Server, label: "SMTP", y: 0, rotateX: 8, delay: 0 },
  { icon: Database, label: "Storage", y: 28, rotateX: 12, delay: 0.15 },
  { icon: Mail, label: "Webmail", y: 56, rotateX: 16, delay: 0.3 },
];

export function HostingServerDesign({ compact }: { compact?: boolean }) {
  return (
    <IllustrationFrame compact={compact}>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ rotateY: [-12, 12, -12], rotateX: [4, 8, 4] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-[220px] sm:w-[260px] h-[200px] sm:h-[230px] [transform-style:preserve-3d]"
        >
          {layers.map((layer, i) => {
            const Icon = layer.icon;
            return (
              <motion.div
                key={layer.label}
                initial={{ opacity: 0, z: -40 }}
                animate={{ opacity: 1, z: i * 24, y: layer.y }}
                transition={{ delay: layer.delay, duration: 0.6 }}
                style={{ transform: `rotateX(${layer.rotateX}deg) translateZ(${i * 18}px)` }}
                className="absolute left-0 right-0 rounded-xl glass border border-border/80 px-4 py-3 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/15 p-2 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{layer.label}</p>
                    <p className="text-xs text-muted-foreground">Auto-provisioned</p>
                  </div>
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                    className="ml-auto h-2 w-2 rounded-full bg-emerald-500"
                  />
                </div>
              </motion.div>
            );
          })}

          <motion.div
            animate={{ y: [0, -6, 0], rotateZ: [0, 3, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -top-4 -right-4 rounded-xl glass border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 shadow-glow-sm"
            style={{ transform: "translateZ(60px)" }}
          >
            <div className="flex items-center gap-1.5 text-emerald-500">
              <Shield className="h-4 w-4" />
              <span className="text-xs font-medium">SSL active</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </IllustrationFrame>
  );
}
