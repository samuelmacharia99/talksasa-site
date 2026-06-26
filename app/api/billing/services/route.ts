import { NextRequest, NextResponse } from "next/server";
import { fetchServices } from "@/lib/billing-api";
import {
  getServiceTechStack,
  isAppTechStack,
} from "@/lib/container-stacks";
import type { PlatformService } from "@/lib/billing-types";

export const dynamic = "force-dynamic";

function applyLocalFilters(
  services: PlatformService[],
  type: string | null,
  techStack: string | null
): PlatformService[] {
  let filtered = services;

  if (type) {
    filtered = filtered.filter((service) => service.type === type);
  }

  if (techStack && isAppTechStack(techStack)) {
    filtered = filtered.filter(
      (service) =>
        service.type !== "container_hosting" || getServiceTechStack(service) === techStack
    );
  }

  return filtered;
}

export async function GET(request: NextRequest) {
  try {
    const type = request.nextUrl.searchParams.get("type");
    const techStack = request.nextUrl.searchParams.get("tech_stack");

    const data = await fetchServices({
      type: type ?? undefined,
      tech_stack: techStack ?? undefined,
    });

    const services = applyLocalFilters(data.services ?? [], type, techStack);

    return NextResponse.json({ ...data, services });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load services";
    const status = message.includes("not configured") ? 503 : 502;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
