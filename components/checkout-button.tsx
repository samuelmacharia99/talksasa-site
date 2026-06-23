"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackCTAClick } from "@/components/analytics";
import { useToast } from "@/components/toast";
import type { CartItem } from "@/lib/billing-types";
import { HOSTING_URL } from "@/lib/urls";
import { cn } from "@/lib/utils";

type CheckoutButtonProps = {
  items: CartItem[];
  label?: string;
  className?: string;
  variant?: "default" | "outline";
  trackId?: string;
};

export function CheckoutButton({
  items,
  label = "Order now",
  className,
  variant = "default",
  trackId = "billing_checkout",
}: CheckoutButtonProps) {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    trackCTAClick(trackId);

    try {
      const res = await fetch("/api/billing/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = (await res.json()) as {
        success?: boolean;
        checkoutUrl?: string;
        fallbackUrl?: string;
        error?: string;
      };

      if (res.ok && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      toast(data.error || "Could not start checkout", "error");
      if (data.fallbackUrl) {
        window.open(data.fallbackUrl, "_blank", "noopener,noreferrer");
      }
    } catch {
      toast("Checkout unavailable. Opening hosting portal.", "error");
      window.open(HOSTING_URL, "_blank", "noopener,noreferrer");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      className={cn("w-full", className)}
      disabled={loading || items.length === 0}
      onClick={handleCheckout}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Starting checkout…
        </>
      ) : (
        label
      )}
    </Button>
  );
}
