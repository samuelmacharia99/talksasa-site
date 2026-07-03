"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CONSENT_KEY } from "@/components/analytics";

function dispatchConsent(status: "accepted" | "rejected") {
  window.localStorage.setItem(CONSENT_KEY, status);
  window.dispatchEvent(new CustomEvent("talksasa:consent", { detail: { status } }));
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(CONSENT_KEY);
    if (!stored) setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 inset-x-0 z-[120] p-4 sm:p-6"
      style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
    >
      <div className="container mx-auto max-w-3xl rounded-2xl border border-border bg-background/95 backdrop-blur-md shadow-2xl p-4 sm:p-5">
        <p className="text-sm text-muted-foreground">
          We use cookies for analytics and to measure ad performance. See our{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            privacy policy
          </Link>
          .
        </p>
        <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full sm:w-auto"
            onClick={() => {
              dispatchConsent("rejected");
              setVisible(false);
            }}
          >
            Essential only
          </Button>
          <Button
            type="button"
            size="sm"
            className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 border-0"
            onClick={() => {
              dispatchConsent("accepted");
              setVisible(false);
            }}
          >
            Accept analytics
          </Button>
        </div>
      </div>
    </div>
  );
}
