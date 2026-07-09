"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { GOOGLE_ADS_ID, GOOGLE_ADS_LEAD_LABEL, CONSENT_KEY } from "@/lib/google-ads";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
const ADS_ID = GOOGLE_ADS_ID;
const ADS_LEAD_LABEL = GOOGLE_ADS_LEAD_LABEL;

export { CONSENT_KEY };

type GtagFn = (...args: unknown[]) => void;
type FbqFn = (...args: unknown[]) => void;

function pushDataLayer(event: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const w = window as Window & { dataLayer?: Record<string, unknown>[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push(event);
}

function getGtag(): GtagFn | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as Window & { gtag?: GtagFn }).gtag;
}

function getFbq(): FbqFn | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as Window & { fbq?: FbqFn }).fbq;
}

export function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(CONSENT_KEY) === "accepted";
}

/** Call when user accepts cookies — enables full Ads + GA measurement. */
export function grantGtagConsent() {
  const gtag = getGtag();
  gtag?.("consent", "update", {
    ad_storage: "granted",
    analytics_storage: "granted",
    ad_user_data: "granted",
    ad_personalization: "granted",
  });
}

export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  if (!hasAnalyticsConsent()) return;
  pushDataLayer({ event: eventName, ...params });
  const gtag = getGtag();
  if (GA_ID && gtag) {
    gtag("event", eventName, params);
  }
}

export function trackCTAClick(label: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem("talksasa_cta_interacted", "1");
  } catch {
    // ignore
  }

  trackEvent("select_content", {
    content_type: "cta",
    item_id: label,
  });

  if (!hasAnalyticsConsent()) return;

  const fbq = getFbq();
  if (FB_PIXEL_ID && fbq) {
    fbq("track", "Lead", { content_name: label });
  }
}

export function trackLeadCaptured(type: string, leadId: string) {
  if (!hasAnalyticsConsent()) return;

  trackEvent("generate_lead", {
    lead_type: type,
    lead_id: leadId,
    method: "server_saved",
  });

  fireGoogleAdsConversion({ value: 1, currency: "KES", transaction_id: leadId });

  const fbq = getFbq();
  if (FB_PIXEL_ID && fbq) {
    fbq("track", "Lead", { content_name: type, content_ids: [leadId] });
  }
}

/** Google Ads conversion: AW-18302658396 / Purchase (IhTeCI_T28wcENzOsZdE) */
function fireGoogleAdsConversion(opts?: {
  value?: number;
  currency?: string;
  transaction_id?: string;
}) {
  if (!ADS_ID || !ADS_LEAD_LABEL) return;

  pushDataLayer({
    event: "google_ads_conversion",
    send_to: `${ADS_ID}/${ADS_LEAD_LABEL}`,
    ...(opts?.value !== undefined ? { value: opts.value } : {}),
    ...(opts?.currency ? { currency: opts.currency } : {}),
    ...(opts?.transaction_id ? { transaction_id: opts.transaction_id } : {}),
  });

  const gtag = getGtag();
  gtag?.("event", "conversion", {
    send_to: `${ADS_ID}/${ADS_LEAD_LABEL}`,
    ...(opts?.value !== undefined ? { value: opts.value } : {}),
    ...(opts?.currency ? { currency: opts.currency } : {}),
    ...(opts?.transaction_id ? { transaction_id: opts.transaction_id } : {}),
    event_callback: () => undefined,
  });
}

export function trackBeginCheckout(label: string) {
  trackEvent("begin_checkout", { item_id: label });
  trackCTAClick(label);
}

/** GA4 + Meta Pixel — loaded only after cookie consent. */
export function Analytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const sync = () => {
      const accepted = hasAnalyticsConsent();
      setEnabled(accepted);
      if (accepted) grantGtagConsent();
    };
    sync();

    const onConsent = () => sync();
    window.addEventListener("talksasa:consent", onConsent);
    return () => window.removeEventListener("talksasa:consent", onConsent);
  }, []);

  if (!enabled) return null;

  const needsGtagLoader = GA_ID && !ADS_ID;

  return (
    <>
      {needsGtagLoader && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-gtag-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
            `}
          </Script>
        </>
      )}
      {GA_ID && (
        <Script id="ga-config" strategy="afterInteractive">
          {`
            gtag('config', '${GA_ID}', {
              page_path: window.location.pathname,
              allow_google_signals: true
            });
          `}
        </Script>
      )}
      {FB_PIXEL_ID && (
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${FB_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}
    </>
  );
}
