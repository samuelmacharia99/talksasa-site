import { NextResponse } from "next/server";
import { createCart } from "@/lib/billing-api";
import type { CartRequest } from "@/lib/billing-types";
import { HOSTING_URL } from "@/lib/urls";

export const dynamic = "force-dynamic";

function isValidCart(body: unknown): body is CartRequest {
  if (!body || typeof body !== "object" || !("items" in body)) return false;
  const items = (body as CartRequest).items;
  if (!Array.isArray(items) || items.length === 0) return false;
  return items.every((item) => {
    if (item.type === "domain") {
      return typeof item.full_domain === "string" && typeof item.years === "number";
    }
    if (item.type === "service") {
      return typeof item.product_id === "number" && typeof item.billing_cycle === "string";
    }
    return false;
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!isValidCart(body)) {
      return NextResponse.json({ success: false, error: "Invalid cart items" }, { status: 400 });
    }

    const { checkoutUrl } = await createCart(body);
    return NextResponse.json({ success: true, checkoutUrl });
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
