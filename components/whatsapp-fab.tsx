"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const PHONE = "254712295880";
const MESSAGE =
  "Hi TalkSasa, I'm interested in learning more about your services.";

const WA_URL = `https://wa.me/${PHONE}?text=${encodeURIComponent(MESSAGE)}`;

export function WhatsAppFab() {
  return (
    <motion.a
      href={WA_URL}
      aria-label="Chat with us on WhatsApp"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2, duration: 0.4, ease: "easeOut" }}
      className="group whatsapp-fab fixed bottom-4 right-4 md:bottom-5 md:right-5 z-[9999]"
    >
      {/* Pulse background */}
      <span className="absolute inset-0 rounded-full bg-[#25D366]/40 blur-sm scale-100 group-hover:scale-110 transition-transform duration-200 pointer-events-none" />

      {/* Badge */}
      <div className="absolute -top-2 -right-2 flex items-center gap-1 rounded-full bg-emerald-500 text-[10px] font-medium text-white px-2 py-0.5 shadow-md">
        <span className="h-1.5 w-1.5 rounded-full bg-white" />
        Online
      </div>

      {/* Button */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.96 }}
        className="relative flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-[#25D366]/40"
      >
        {/* Inner subtle pulse */}
        <motion.span
          className="absolute inset-0 rounded-full border border-white/20"
          animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <MessageCircle className="relative h-7 w-7" aria-hidden />
      </motion.div>

      {/* Tooltip */}
      <div className="pointer-events-none absolute right-1/2 mr-2 bottom-full mb-2 hidden translate-y-1 rounded-md bg-black/80 px-3 py-1 text-xs text-white shadow-md transition-all duration-150 group-hover:block group-hover:translate-y-0">
        Chat with us on WhatsApp
      </div>
    </motion.a>
  );
}

