"use client";

import { CTAModalProvider } from "@/components/cta-modal";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/toast";
import { CurrencyProvider } from "@/lib/currency-provider";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { ScrollProgress } from "@/components/scroll-progress";
import { ServiceWorkerRegister } from "@/components/service-worker-register";
import { ExitIntentModal } from "@/components/exit-intent-modal";
import { AttributionCapture } from "@/components/attribution-capture";
import { CookieConsent } from "@/components/cookie-consent";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <CurrencyProvider>
        <ToastProvider>
          <CTAModalProvider>
            <AttributionCapture />
            <ScrollProgress />
            {children}
            <ExitIntentModal />
            <WhatsAppFab />
            <CookieConsent />
            <ServiceWorkerRegister />
          </CTAModalProvider>
        </ToastProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
}
