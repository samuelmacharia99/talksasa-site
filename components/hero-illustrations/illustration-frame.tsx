"use client";

import { motion } from "framer-motion";

export function IllustrationFrame({
  children,
  compact = false,
}: {
  children: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div
      className={`relative w-full h-full overflow-hidden [perspective:1000px] ${
        compact
          ? "min-h-[240px] sm:min-h-[300px] lg:min-h-[340px]"
          : "min-h-[280px] sm:min-h-[340px] md:min-h-[380px] lg:min-h-[420px]"
      }`}
    >
      <motion.div
        animate={{ opacity: [0.35, 0.65, 0.35], scale: [1, 1.04, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,rgba(99,102,241,0.16),transparent_72%)] pointer-events-none"
      />
      <div className="absolute inset-0 scale-[0.88] sm:scale-95 md:scale-100 origin-center">
        {children}
      </div>
    </div>
  );
}
