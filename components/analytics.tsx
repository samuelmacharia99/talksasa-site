"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const ADS_LEAD_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL;

export const CONSENT_KEY = "talksasa_cookie_consent";

type GtagFn = (...args: unknown[]) => void;
type FbqFn = (...args: unknown[]) => void;

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

export function trackEvent(eventName: string, params?: Record<string, unknown>) {
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

  if (ADS_ID && ADS_LEAD_LABEL) {
    const gtag = getGtag();
    gtag?.("event", "conversion", {
      send_to: `${ADS_ID}/${ADS_LEAD_LABEL}`,
      event_callback: () => undefined,
    });
  }

  const fbq = getFbq();
  if (FB_PIXEL_ID && fbq) {
    fbq("track", "Lead", { content_name: label });
  }
}

export function trackLeadCaptured(type: string, leadId: string) {
  trackEvent("generate_lead", {
    lead_type: type,
    lead_id: leadId,
    method: "server_saved",
  });

  if (ADS_ID && ADS_LEAD_LABEL) {
    const gtag = getGtag();
    gtag?.("event", "conversion", {
      send_to: `${ADS_ID}/${ADS_LEAD_LABEL}`,
      value: 1,
      currency: "KES",
    });
  }

  const fbq = getFbq();
  if (FB_PIXEL_ID && fbq) {
    fbq("track", "Lead", { content_name: type, content_ids: [leadId] });
  }
}

export function trackBeginCheckout(label: string) {
  trackEvent("begin_checkout", { item_id: label });
  trackCTAClick(label);
}

export function Analytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(hasAnalyticsConsent());

    const onConsent = (event: Event) => {
      const detail = (event as CustomEvent<{ status: string }>).detail;
      setEnabled(detail?.status === "accepted");
    };

    window.addEventListener("talksasa:consent", onConsent);
    return () => window.removeEventListener("talksasa:consent", onConsent);
  }, []);

  if (!enabled) return null;

  return (
    <>
      {GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-config" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', {
                page_path: window.location.pathname,
                allow_google_signals: true
              });
              ${ADS_ID ? `gtag('config', '${ADS_ID}');` : ""}
            `}
          </Script>
        </>
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
