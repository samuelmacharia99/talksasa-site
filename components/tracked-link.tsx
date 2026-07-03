"use client";

import Link from "next/link";
import { appendAttributionToUrl } from "@/lib/attribution";
import { trackCTAClick } from "@/components/analytics";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TrackedExternalLinkProps = {
  href: string;
  trackId: string;
  children: React.ReactNode;
  className?: string;
};

export function TrackedExternalLink({ href, trackId, children, className }: TrackedExternalLinkProps) {
  const url = appendAttributionToUrl(href);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => trackCTAClick(trackId)}
    >
      {children}
    </a>
  );
}

type ProductCtaSectionProps = {
  primaryLabel: string;
  primaryHref: string;
  primaryExternal?: boolean;
  trackId: string;
};

export function ProductCtaSection({
  primaryLabel,
  primaryHref,
  primaryExternal,
  trackId,
}: ProductCtaSectionProps) {
  const externalHref = appendAttributionToUrl(primaryHref);

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <h2 className="text-2xl font-bold tracking-tight">Ready to get started?</h2>
      <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
        Create your account, search your domain, or talk to our team about reseller packages.
      </p>
      <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center">
        {primaryExternal ? (
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 border-0"
          >
            <a
              href={externalHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCTAClick(trackId)}
            >
              {primaryLabel}
            </a>
          </Button>
        ) : (
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 border-0"
          >
            <Link href={primaryHref} onClick={() => trackCTAClick(trackId)}>
              {primaryLabel}
            </Link>
          </Button>
        )}
        <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
          <Link href="/contact" onClick={() => trackCTAClick(`${trackId}_contact_sales`)}>
            Contact sales
          </Link>
        </Button>
      </div>
    </section>
  );
}

type BulkSmsPlanButtonProps = {
  href: string;
  trackId: string;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline";
};

export function BulkSmsPlanButton({
  href,
  trackId,
  children,
  className,
  variant = "default",
}: BulkSmsPlanButtonProps) {
  return (
    <Button asChild size="default" variant={variant} className={cn("mt-8 w-full", className)}>
      <TrackedExternalLink href={href} trackId={trackId}>
        {children}
      </TrackedExternalLink>
    </Button>
  );
}
