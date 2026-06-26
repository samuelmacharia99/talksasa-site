import type { PlatformService } from "@/lib/billing-types";

/** Slugs aligned with expected billing API `tech_stack` values. */
export type AppTechStack =
  | "laravel"
  | "nodejs"
  | "python"
  | "wordpress"
  | "ghost"
  | "strapi";

export const APP_TECH_STACK_ORDER: AppTechStack[] = [
  "laravel",
  "nodejs",
  "python",
  "wordpress",
  "ghost",
  "strapi",
];

export const APP_TECH_STACK_LABELS: Record<AppTechStack, string> = {
  laravel: "Laravel",
  nodejs: "Node.js",
  python: "Python",
  wordpress: "WordPress",
  ghost: "Ghost",
  strapi: "Strapi",
};

const NAME_PREFIXES: [RegExp, AppTechStack][] = [
  [/^wordpress\s/i, "wordpress"],
  [/^ghost\s/i, "ghost"],
  [/^lara\s/i, "laravel"],
  [/^node\s/i, "nodejs"],
  [/^py\s/i, "python"],
  [/^strapi\s/i, "strapi"],
];

export function isAppTechStack(value: string | null | undefined): value is AppTechStack {
  return !!value && APP_TECH_STACK_ORDER.includes(value as AppTechStack);
}

/** Prefer API `tech_stack`, fall back to plan name until the billing API exposes the field. */
export function getServiceTechStack(plan: PlatformService): AppTechStack | null {
  if (plan.tech_stack && isAppTechStack(plan.tech_stack)) {
    return plan.tech_stack;
  }

  for (const [pattern, stack] of NAME_PREFIXES) {
    if (pattern.test(plan.name)) return stack;
  }

  return null;
}

export function listAvailableTechStacks(services: PlatformService[]): AppTechStack[] {
  const stacks = new Set<AppTechStack>();
  for (const service of services) {
    if (service.type !== "container_hosting") continue;
    const stack = getServiceTechStack(service);
    if (stack) stacks.add(stack);
  }
  return APP_TECH_STACK_ORDER.filter((stack) => stacks.has(stack));
}

export function filterServicesByTechStack(
  services: PlatformService[],
  stack: AppTechStack
): PlatformService[] {
  return services.filter(
    (service) => service.type === "container_hosting" && getServiceTechStack(service) === stack
  );
}
