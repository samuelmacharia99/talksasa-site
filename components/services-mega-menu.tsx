"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Container, Tag } from "lucide-react";
import { megaMenuGroups, deployPipelineSteps } from "@/lib/platform-menu";
import { cn } from "@/lib/utils";

type ServicesMegaMenuProps = {
  onNavigate?: () => void;
  onViewAll?: () => void;
};

function MegaMenuLinkItem({
  item,
  onNavigate,
}: {
  item: (typeof megaMenuGroups)[number]["items"][number];
  onNavigate?: () => void;
}) {
  const isExternal = item.href.startsWith("http");
  const Comp = isExternal ? "a" : Link;

  return (
    <Comp
      href={item.href}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onClick={onNavigate}
      className="flex gap-3 p-2.5 rounded-lg hover:bg-white/5 transition-colors group"
    >
      <div className="shrink-0 rounded-lg bg-primary/10 p-2 text-primary group-hover:bg-primary/20 transition-colors">
        <item.icon className="h-4 w-4" aria-hidden />
      </div>
      <div className="min-w-0">
        <div className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">
          {item.title}
        </div>
        <div className="text-xs text-muted-foreground mt-0.5 leading-snug">{item.description}</div>
      </div>
    </Comp>
  );
}

export function ServicesMegaMenu({ onNavigate, onViewAll }: ServicesMegaMenuProps) {
  const cloudGroup = megaMenuGroups.find((g) => g.id === "cloud");
  const messagingGroup = megaMenuGroups.find((g) => g.id === "messaging");
  const resellerGroup = megaMenuGroups.find((g) => g.id === "reseller");

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 w-[min(920px,calc(100vw-2rem))]"
    >
      <div className="rounded-2xl glass border border-border shadow-2xl overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr_1.05fr] gap-0">
        {cloudGroup && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 }}
            className={cn("p-5 border-b md:border-b-0 md:border-r border-border", `bg-gradient-to-b ${cloudGroup.accent}`)}
          >
            <div className="mb-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">{cloudGroup.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{cloudGroup.tagline}</p>
            </div>
            <div className="space-y-0.5">
              {cloudGroup.items.map((item) => (
                <MegaMenuLinkItem key={item.title} item={item} onNavigate={onNavigate} />
              ))}
            </div>
          </motion.div>
        )}

        {messagingGroup && (
          <motion.div
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 }}
            className={cn("p-5 border-b md:border-b-0 md:border-r border-border", `bg-gradient-to-b ${messagingGroup.accent}`)}
          >
            <div className="mb-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">{messagingGroup.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{messagingGroup.tagline}</p>
            </div>
            <div className="space-y-0.5">
              {messagingGroup.items.map((item) => (
                <MegaMenuLinkItem key={item.title} item={item} onNavigate={onNavigate} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Reseller featured column */}
        <motion.div
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.12 }}
          className="p-5 bg-gradient-to-br from-fuchsia-500/15 via-purple-500/10 to-indigo-500/5"
        >
          <div className="mb-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
              {resellerGroup?.label}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{resellerGroup?.tagline}</p>
          </div>

          <Link
            href="/reseller"
            onClick={onNavigate}
            className="block rounded-xl border border-primary/25 bg-background/40 p-4 hover:border-primary/40 hover:bg-background/60 transition-all group"
          >
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-primary/15 p-2.5 text-primary">
                <Tag className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <div className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                  White-label hosting business
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Your brand, your M-Pesa, wholesale domains, and automated billing.
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 font-mono text-xs text-muted-foreground">
              {deployPipelineSteps.map((step, i) => (
                <span key={step} className="flex items-center gap-2">
                  {i > 0 && <span className="text-primary/50">→</span>}
                  <motion.span
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.55 }}
                    className="px-1.5 py-0.5 rounded bg-primary/10 text-primary"
                  >
                    {step}
                  </motion.span>
                </span>
              ))}
            </div>
          </Link>

          <Link
            href="/cloud-hosting"
            onClick={onNavigate}
            className="mt-3 mr-4 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/90"
          >
            <Container className="h-3.5 w-3.5" />
            Application hosting
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>
      </div>

      <div className="border-t border-border px-5 py-3 flex items-center justify-between bg-background/30">
        <p className="text-xs text-muted-foreground hidden sm:block">
          TalkSasa — cloud hosting, bulk SMS, domains & M-Pesa billing
        </p>
        <Link
          href="/#services"
          onClick={(e) => {
            onNavigate?.();
            if (window.location.pathname === "/") {
              e.preventDefault();
              onViewAll?.();
            }
          }}
          className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/90 ml-auto"
        >
          View all services
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      </div>
    </motion.div>
  );
}
