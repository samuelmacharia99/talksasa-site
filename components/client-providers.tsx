"use client";

import { CTAModalProvider } from "@/components/cta-modal";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/toast";
import { CurrencyProvider } from "@/lib/currency-provider";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { ScrollProgress } from "@/components/scroll-progress";
import { ServiceWorkerRegister } from "@/components/service-worker-register";
import { LiveActivityFeed } from "@/components/live-activity-feed";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <ToastProvider>
          <CTAModalProvider>
            <ScrollProgress />
            {children}
            <LiveActivityFeed />
            <WhatsAppFab />
            <ServiceWorkerRegister />
          </CTAModalProvider>
        </ToastProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
}
