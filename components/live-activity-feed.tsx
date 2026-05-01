"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Activity = {
  id: string;
  text: string;
  initials: string;
  timestamp: string;
};

const POOL: Array<Omit<Activity, "id">> = [
  { text: "James from Nairobi just purchased Business Hosting", initials: "J", timestamp: "2 min ago" },
  { text: "Sarah from Mombasa sent 5,000 SMS messages", initials: "S", timestamp: "5 min ago" },
  { text: "TechCorp registered 3 domains", initials: "TC", timestamp: "10 min ago" },
  { text: "Michael from Kisumu upgraded to Pro Hosting", initials: "M", timestamp: "8 min ago" },
  { text: "Grace from Nakuru sent 10,000 SMS", initials: "G", timestamp: "just now" },
  { text: "Innovation Ltd purchased VPS hosting", initials: "IL", timestamp: "3 min ago" },
  { text: "David from Eldoret registered 2 domains", initials: "D", timestamp: "6 min ago" },
  { text: "Mary from Thika activated Bulk SMS API", initials: "M", timestamp: "just now" },
  { text: "KE Solutions purchased Dedicated Server", initials: "KS", timestamp: "12 min ago" },
  { text: "Peter from Nairobi signed up for hosting", initials: "P", timestamp: "1 min ago" },
];

function getRandomActivity(): Omit<Activity, "id"> {
  const index = Math.floor(Math.random() * POOL.length);
  return POOL[index];
}

export function LiveActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth < 1024) return; // desktop only
    let timeoutId: number | undefined;

    const pushActivity = () => {
      const base = getRandomActivity();
      setActivities((prev) => {
        const next: Activity = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          ...base,
        };
        const updated = [next, ...prev];
        return updated.slice(0, 3);
      });
      scheduleNext();
    };

    const scheduleNext = () => {
      const delay = 8000 + Math.random() * 4000; // 8–12 seconds
      timeoutId = window.setTimeout(pushActivity, delay);
    };

    // First activity after 3 seconds
    timeoutId = window.setTimeout(pushActivity, 3000);

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="hidden lg:block fixed z-[1000] left-5 top-[30vh]">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-muted-foreground">Recent activity</span>
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className="text-xs text-primary hover:underline"
        >
          {collapsed ? "Show" : "Hide"}
        </button>
      </div>
      {!collapsed && (
        <div className="w-[300px] space-y-2">
          <AnimatePresence initial={false}>
            {activities.map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -40, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex items-start gap-3 rounded-2xl glass border border-border/80 px-3 py-3 shadow-md bg-white/5"
              >
                <div className="relative">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
                    {activity.initials}
                  </div>
                  <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 border border-background" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground leading-snug">
                    <span className="mr-1" aria-hidden>
                      🟢
                    </span>
                    {activity.text}
                  </p>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    {activity.timestamp}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

