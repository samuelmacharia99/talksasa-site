"use client";

import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

export function Analytics() {
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
              gtag('config', '${GA_ID}', { page_path: window.location.pathname });
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

/**
 * Call from CTA clicks for conversion tracking.
 * Requires GA_ID and/or FB_PIXEL_ID to be set.
 */
export function trackCTAClick(label: string) {
  if (typeof window === "undefined") return;
  const w = window as Window & { gtag?: (...a: unknown[]) => void; fbq?: (...a: unknown[]) => void };
  try {
    window.localStorage.setItem("talksasa_cta_interacted", "1");
  } catch {
    // ignore
  }
  if (GA_ID && typeof w.gtag === "function") {
    w.gtag("event", "conversion", { send_to: `${GA_ID}/cta_${label}` });
    w.gtag("event", "click", { event_category: "CTA", event_label: label });
  }
  if (FB_PIXEL_ID && typeof w.fbq === "function") {
    w.fbq("track", "Lead", { content_name: label });
  }
}
