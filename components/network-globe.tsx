"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MessageSquare, Server, Wifi } from "lucide-react";

const HUBS: { name: string; x: number; y: number; primary?: boolean }[] = [
  { name: "Nairobi", x: 54, y: 44, primary: true },
  { name: "Mombasa", x: 60, y: 50 },
  { name: "Kampala", x: 48, y: 42 },
  { name: "Dar es Salaam", x: 58, y: 54 },
  { name: "Kigali", x: 46, y: 48 },
  { name: "Addis Ababa", x: 52, y: 36 },
];

const STATS = [
  { label: "Active users", value: "7,000+" },
  { label: "Domains", value: "11,000+" },
  { label: "Uptime", value: "99.9%" },
] as const;

function hubToHubPath(x1: number, y1: number, x2: number, y2: number) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 - 8;
  return `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
}

export function NetworkGlobe() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const primary = HUBS.find((h) => h.primary)!;
  const spokes = HUBS.filter((h) => !h.primary);

  return (
    <div ref={ref} className="relative w-full max-w-md mx-auto lg:max-w-none aspect-square">
      {/* Ambient glow */}
      <div className="absolute inset-[8%] rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute inset-[18%] rounded-full bg-violet-500/10 blur-2xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative w-full h-full [perspective:900px]"
      >
        <motion.div
          animate={{ rotateY: [0, 360] }}
          transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 [transform-style:preserve-3d]"
        >
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full drop-shadow-[0_0_40px_rgba(139,92,246,0.25)]"
            aria-hidden
          >
            <defs>
              <radialGradient id="globe-fill" cx="40%" cy="35%" r="65%">
                <stop offset="0%" stopColor="rgba(99,102,241,0.35)" />
                <stop offset="55%" stopColor="rgba(30,27,75,0.85)" />
                <stop offset="100%" stopColor="rgba(3,7,18,0.95)" />
              </radialGradient>
              <linearGradient id="arc-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#a855f7" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.2" />
              </linearGradient>
              <clipPath id="globe-clip">
                <circle cx="100" cy="100" r="78" />
              </clipPath>
            </defs>

            {/* Sphere */}
            <circle cx="100" cy="100" r="78" fill="url(#globe-fill)" stroke="rgba(139,92,246,0.35)" strokeWidth="0.8" />

            {/* Latitude rings */}
            {[0, 1, 2, 3].map((i) => (
              <ellipse
                key={i}
                cx="100"
                cy="100"
                rx={78 - i * 6}
                ry={28 + i * 14}
                fill="none"
                stroke="rgba(148,163,184,0.12)"
                strokeWidth="0.6"
                transform={`rotate(${i * 18} 100 100)`}
              />
            ))}

            {/* Meridian lines */}
            {[0, 30, 60, 90, 120, 150].map((deg) => (
              <ellipse
                key={deg}
                cx="100"
                cy="100"
                rx="18"
                ry="78"
                fill="none"
                stroke="rgba(148,163,184,0.1)"
                strokeWidth="0.5"
                transform={`rotate(${deg} 100 100)`}
              />
            ))}

            <g clipPath="url(#globe-clip)">
              {/* Africa landmass dots */}
              {Array.from({ length: 120 }, (_, i) => {
                const angle = (i / 120) * Math.PI * 2;
                const r = 20 + (i % 7) * 8;
                const cx = 100 + Math.cos(angle) * r * 0.55;
                const cy = 95 + Math.sin(angle) * r * 0.45;
                if (cx < 55 || cx > 145 || cy < 50 || cy > 145) return null;
                return (
                  <circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r={0.9}
                    fill="rgba(139,92,246,0.35)"
                  />
                );
              })}

              {/* Network arcs from Nairobi */}
              {spokes.map((hub, i) => {
                const x1 = primary.x * 2;
                const y1 = primary.y * 2;
                const x2 = hub.x * 2;
                const y2 = hub.y * 2;
                return (
                  <motion.path
                    key={hub.name}
                    d={hubToHubPath(x1, y1, x2, y2)}
                    fill="none"
                    stroke="url(#arc-gradient)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={inView ? { pathLength: 1, opacity: [0.4, 0.9, 0.4] } : {}}
                    transition={{
                      pathLength: { duration: 1.2, delay: 0.3 + i * 0.1 },
                      opacity: { duration: 2.5, repeat: Infinity, delay: i * 0.35 },
                    }}
                  />
                );
              })}

              {/* Hub nodes */}
              {HUBS.map((hub, i) => {
                const cx = hub.x * 2;
                const cy = hub.y * 2;
                return (
                  <g key={hub.name}>
                    {hub.primary && (
                      <motion.circle
                        cx={cx}
                        cy={cy}
                        r="14"
                        fill="none"
                        stroke="rgba(139,92,246,0.5)"
                        strokeWidth="0.8"
                        initial={{ r: 8, opacity: 0.8 }}
                        animate={{ r: 22, opacity: 0 }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
                      />
                    )}
                    <motion.circle
                      cx={cx}
                      cy={cy}
                      r={hub.primary ? 4.5 : 3}
                      fill={hub.primary ? "#a855f7" : "#6366f1"}
                      initial={{ scale: 0 }}
                      animate={inView ? { scale: 1 } : {}}
                      transition={{ delay: 0.2 + i * 0.08, type: "spring", stiffness: 260 }}
                    />
                    <circle cx={cx} cy={cy} r={hub.primary ? 7 : 5} fill="rgba(139,92,246,0.15)" />
                  </g>
                );
              })}
            </g>

            {/* Orbit ring */}
            <motion.circle
              cx="100"
              cy="100"
              r="88"
              fill="none"
              stroke="rgba(99,102,241,0.2)"
              strokeWidth="0.6"
              strokeDasharray="4 6"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: "100px 100px" }}
            />
          </svg>
        </motion.div>

        {/* Floating badges */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="absolute top-[8%] right-0 sm:right-[4%] rounded-xl glass border border-primary/25 px-3 py-2 shadow-lg"
        >
          <div className="flex items-center gap-2">
            <MessageSquare className="h-3.5 w-3.5 text-primary" />
            <span className="text-[10px] sm:text-xs font-medium">SMS routes live</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.65 }}
          className="absolute bottom-[18%] left-0 sm:left-[2%] rounded-xl glass border border-border/80 px-3 py-2 shadow-lg"
        >
          <div className="flex items-center gap-2">
            <Server className="h-3.5 w-3.5 text-primary" />
            <span className="text-[10px] sm:text-xs font-medium">Cloud edge</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="absolute bottom-[6%] right-[8%] rounded-xl glass border border-emerald-500/30 bg-emerald-500/5 px-3 py-2 shadow-lg"
        >
          <div className="flex items-center gap-2">
            <Wifi className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-[10px] sm:text-xs font-medium text-emerald-600 dark:text-emerald-400">
              99.9% uptime
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Stats strip */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.9 }}
        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[92%] flex justify-center gap-2 sm:gap-4"
      >
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg glass border border-border/60 px-2.5 sm:px-3 py-1.5 text-center min-w-0 flex-1"
          >
            <p className="text-xs sm:text-sm font-bold gradient-text truncate">{stat.value}</p>
            <p className="text-[9px] sm:text-[10px] text-muted-foreground truncate">{stat.label}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
