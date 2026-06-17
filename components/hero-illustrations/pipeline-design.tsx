"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Server, Container, GitBranch, Rocket, Globe } from "lucide-react";
import { deployPipelineSteps } from "@/lib/platform-menu";
import { IllustrationFrame } from "./illustration-frame";

const pipelineNodes = [
  { icon: GitBranch, label: "git push", sub: "Connect repo" },
  { icon: Server, label: "build", sub: "Container image" },
  { icon: Rocket, label: "deploy", sub: "Roll out" },
  { icon: Globe, label: "live", sub: "Production URL" },
];

const inputs = [
  { icon: MessageSquare, label: "SMS API", href: "https://bulksms.talksasa.com" },
  { icon: Server, label: "Hosting", href: "https://servers.talksasa.com" },
  { icon: Container, label: "Apps", href: "/cloud-hosting" },
];

export function PipelineDesign({ compact }: { compact?: boolean } = {}) {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActiveStep((s) => (s + 1) % pipelineNodes.length), 1800);
    return () => clearInterval(timer);
  }, []);

  return (
    <IllustrationFrame compact={compact}>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-3 sm:px-8 gap-4 sm:gap-8 overflow-hidden">
        {/* Input sources */}
        <div className="flex justify-center gap-3 sm:gap-5 w-full">
          {inputs.map((input, i) => {
            const Icon = input.icon;
            const isExternal = input.href.startsWith("http");
            const Comp = isExternal ? "a" : Link;
            return (
              <motion.div
                key={input.label}
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Comp
                  href={input.href}
                  {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 2.5, delay: i * 0.3, repeat: Infinity }}
                    className="flex flex-col items-center gap-1.5 rounded-xl glass border border-border/70 px-3 py-2 sm:px-4 sm:py-2.5 hover:border-primary/30"
                  >
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="text-[10px] sm:text-xs font-medium text-muted-foreground">{input.label}</span>
                  </motion.div>
                </Comp>
              </motion.div>
            );
          })}
        </div>

        {/* Flow lines into pipeline */}
        <svg viewBox="0 0 320 40" className="w-full max-w-[280px] h-8 -my-4" aria-hidden>
          {[80, 160, 240].map((x, i) => (
            <motion.line
              key={x}
              x1={x}
              y1="0"
              x2="160"
              y2="40"
              stroke="url(#pipe-in-gradient)"
              strokeWidth="1.5"
              strokeDasharray="4 4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.5, strokeDashoffset: [0, -16] }}
              transition={{
                pathLength: { delay: 0.2 + i * 0.1 },
                strokeDashoffset: { duration: 1, repeat: Infinity, ease: "linear" },
              }}
            />
          ))}
          <defs>
            <linearGradient id="pipe-in-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>

        {/* Main pipeline */}
        <div className="relative w-full max-w-md">
          <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-border -translate-y-1/2" />
          <motion.div
            className="absolute top-1/2 left-4 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 -translate-y-1/2 origin-left"
            animate={{ width: `${(activeStep / (pipelineNodes.length - 1)) * 88}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
          <motion.div
            className="absolute top-1/2 w-3 h-3 rounded-full bg-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.8)] -translate-y-1/2"
            animate={{ left: `calc(1rem + ${(activeStep / (pipelineNodes.length - 1)) * 88}%)` }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
          />

          <div className="relative flex justify-between items-start pt-2">
            {pipelineNodes.map((node, i) => {
              const Icon = node.icon;
              const isActive = i === activeStep;
              const isDone = i < activeStep;
              return (
                <motion.div
                  key={node.label}
                  animate={{ scale: isActive ? 1.08 : 1, y: isActive ? -4 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="flex flex-col items-center gap-2 w-[56px] sm:w-[72px] md:w-[80px]"
                >
                  <div
                    className={`rounded-xl p-2.5 sm:p-3 border transition-colors ${
                      isActive
                        ? "bg-primary/20 border-primary/50 text-primary shadow-glow-sm"
                        : isDone
                          ? "bg-primary/10 border-primary/30 text-primary"
                          : "glass border-border/70 text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5 mx-auto" />
                  </div>
                  <div className="text-center">
                    <p className={`text-[11px] sm:text-xs font-mono font-medium text-center ${isActive ? "text-primary" : "text-foreground"}`}>
                      {node.label}
                    </p>
                    <p className="text-[9px] sm:text-[10px] text-muted-foreground hidden sm:block">{node.sub}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Terminal snippet */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full max-w-sm rounded-xl glass border border-border/80 p-3 sm:p-4 font-mono text-[10px] sm:text-xs overflow-hidden"
        >
          <div className="flex gap-1.5 mb-2">
            <span className="w-2 h-2 rounded-full bg-red-400/80" />
            <span className="w-2 h-2 rounded-full bg-amber-400/80" />
            <span className="w-2 h-2 rounded-full bg-emerald-400/80" />
          </div>
          <motion.p
            key={activeStep}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-primary"
          >
            $ {deployPipelineSteps[activeStep % deployPipelineSteps.length]}
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-1.5 h-3.5 ml-0.5 bg-primary align-middle"
            />
          </motion.p>
          <p className="text-muted-foreground mt-1">→ East Africa edge · SSL · auto-scale</p>
        </motion.div>
      </div>
    </IllustrationFrame>
  );
}
