import { NextResponse } from "next/server";
import { createCart } from "@/lib/billing-api";
import type { CartItem, CartRequest } from "@/lib/billing-types";
import { appendAttributionParams } from "@/lib/leads/validate";
import type { Attribution } from "@/lib/leads/types";
import { HOSTING_URL } from "@/lib/urls";

export const runtime = "nodejs";

export const dynamic = "force-dynamic";

const BILLING_CYCLES = new Set(["monthly", "quarterly", "semi-annual", "annual"]);

function isValidCartItem(item: unknown): item is CartItem {
  if (!item || typeof item !== "object" || !("type" in item)) return false;

  const typed = item as CartItem;

  if (typed.type === "domain") {
    return typeof typed.full_domain === "string" && typeof typed.years === "number";
  }

  if (typed.type === "domain_transfer") {
    return (
      typeof typed.full_domain === "string" &&
      typeof typed.epp_code === "string" &&
      typeof typed.old_registrar === "string" &&
      (typed.old_registrar_url === undefined || typeof typed.old_registrar_url === "string")
    );
  }

  if (typed.type === "service") {
    if (typeof typed.product_id !== "number" || !BILLING_CYCLES.has(typed.billing_cycle)) {
      return false;
    }
    if (typed.location_key !== undefined && typeof typed.location_key !== "string") return false;
    if (typed.ip_count !== undefined && typeof typed.ip_count !== "number") return false;
    if (typed.operating_system !== undefined && typeof typed.operating_system !== "string") {
      return false;
    }
    return true;
  }

  if (typed.type === "reseller_package") {
    return typeof typed.reseller_package_id === "number";
  }

  return false;
}

function isValidCart(body: unknown): body is CartRequest & { attribution?: Attribution } {
  if (!body || typeof body !== "object" || !("items" in body)) return false;
  const items = (body as CartRequest).items;
  if (!Array.isArray(items) || items.length === 0) return false;
  if (!items.every(isValidCartItem)) return false;

  const resellerItems = items.filter((item) => item.type === "reseller_package");
  if (resellerItems.length > 0 && items.length !== 1) return false;

  return true;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!isValidCart(body)) {
      return NextResponse.json({ success: false, error: "Invalid cart items" }, { status: 400 });
    }

    const { attribution, ...cart } = body as CartRequest & { attribution?: Attribution };
    const { checkoutUrl } = await createCart(cart);
    const trackedUrl = appendAttributionParams(checkoutUrl, attribution);
    return NextResponse.json({ success: true, checkoutUrl: trackedUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed";
    const status = message.includes("not configured") ? 503 : 502;
    return NextResponse.json(
      {
        success: false,
        error: message,
        fallbackUrl: HOSTING_URL,
      },
      { status }
    );
  }
}
