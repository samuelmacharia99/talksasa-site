"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Globe, Loader2, Search, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CheckoutButton } from "@/components/checkout-button";
import { cn } from "@/lib/utils";
import type { DomainExtension, DomainSearchResult } from "@/lib/billing-types";
import { formatBillingPrice, parseDomainQuery, sortDomainResults } from "@/lib/billing-utils";

type SearchState = "idle" | "loading" | "done" | "error";

export function DomainSearchPanel({
  compact = false,
  prominent = false,
}: {
  compact?: boolean;
  prominent?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [period, setPeriod] = useState(1);
  const [state, setState] = useState<SearchState>("idle");
  const [error, setError] = useState("");
  const [results, setResults] = useState<DomainSearchResult[]>([]);
  const [exactMatchDomain, setExactMatchDomain] = useState<string | null>(null);
  const [extensions, setExtensions] = useState<DomainExtension[]>([]);
  const [extensionsLoading, setExtensionsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/billing/domains/extensions?period=${period}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.extensions) setExtensions(data.extensions);
      })
      .catch(() => {})
      .finally(() => setExtensionsLoading(false));
  }, [period]);

  const sortedResults = useMemo(
    () => sortDomainResults(results, exactMatchDomain),
    [results, exactMatchDomain]
  );
  const availableCount = useMemo(
    () => sortedResults.filter((r) => r.available).length,
    [sortedResults]
  );

  const runSearch = useCallback(async () => {
    const parsed = parseDomainQuery(query);
    if (parsed.label.length < 2) {
      setError("Enter at least 2 characters");
      setState("error");
      return;
    }

    setState("loading");
    setError("");
    setExactMatchDomain(parsed.exactFullDomain);

    try {
      const res = await fetch(
        `/api/billing/domains/search?${new URLSearchParams({ q: parsed.label, period: String(period) })}`,
        { signal: AbortSignal.timeout(65_000) }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Search failed");
      setResults(data.results || []);
      setState("done");
    } catch (err) {
      if (err instanceof Error && err.name === "TimeoutError") {
        setError("Search timed out. The registry can be slow — please try again.");
      } else {
        setError(err instanceof Error ? err.message : "Search failed");
      }
      setState("error");
    }
  }, [query, period]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    runSearch();
  }

  const popular = extensions
    .filter((e) => [".co.ke", ".com", ".org", ".net", ".xyz"].includes(e.extension))
    .sort((a, b) => a.price - b.price);

  const inputClass = cn(
    "w-full rounded-xl border border-border bg-background/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary",
    prominent ? "pl-12 pr-4 py-4 text-base sm:text-lg" : "pl-10 pr-4 py-3"
  );

  return (
    <div className={cn("w-full", compact ? "max-w-xl mx-auto" : prominent ? "max-w-none" : "max-w-4xl mx-auto")}>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground",
              prominent ? "h-5 w-5" : "h-4 w-4"
            )}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={prominent ? "yourbrand — we'll check .co.ke, .com & more" : "Find your domain — e.g. mybusiness"}
            className={inputClass}
            autoComplete="off"
            spellCheck={false}
            aria-label="Domain name to search"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(Number(e.target.value))}
            className={cn(
              "rounded-xl border border-border bg-background/60 px-3 text-sm min-h-[48px]",
              prominent && "py-4 text-base"
            )}
            aria-label="Registration period in years"
          >
            <option value={1}>1 year</option>
            <option value={2}>2 years</option>
            <option value={3}>3 years</option>
          </select>
          <Button
            type="submit"
            size="lg"
            className={cn("min-h-[48px] px-6 sm:px-8", prominent && "text-base font-semibold")}
            disabled={state === "loading"}
          >
            {state === "loading" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching…
              </>
            ) : (
              "Search"
            )}
          </Button>
        </div>
      </form>

      {state === "loading" && (
        <p className="mt-3 text-xs sm:text-sm text-muted-foreground">
          Checking registries across Kenya & global TLDs — usually 15–30 seconds.
        </p>
      )}

      {!compact && !extensionsLoading && popular.length > 0 && !prominent && (
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Globe className="h-4 w-4 text-primary" />
          <span>Popular from</span>
          {popular.map((ext) => (
            <span
              key={ext.extension}
              className="rounded-full border border-border bg-background/40 px-2.5 py-0.5 text-xs font-medium text-foreground"
            >
              {ext.extension}{" "}
              <span className="text-muted-foreground">{formatBillingPrice(ext.price, ext.currency)}</span>
            </span>
          ))}
        </div>
      )}

      {error && (
        <p className="mt-3 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      <AnimatePresence mode="wait">
        {state === "done" && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6"
          >
            {sortedResults.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No results found.</p>
            ) : (
              <>
                {availableCount > 0 && (
                  <p className="mb-4 text-sm font-medium text-emerald-500 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    {availableCount} extension{availableCount !== 1 ? "s" : ""} available — grab yours before they&apos;re gone
                  </p>
                )}
                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                  {sortedResults.map((result) => {
                    const isExactMatch =
                      exactMatchDomain !== null &&
                      result.full_domain.toLowerCase() === exactMatchDomain.toLowerCase();

                    return (
                    <div
                      key={result.full_domain}
                      className={cn(
                        "flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border p-4 transition-colors",
                        isExactMatch
                          ? "border-primary/50 bg-primary/10 ring-1 ring-primary/30 shadow-md"
                          : result.available
                            ? "border-emerald-500/40 bg-emerald-500/10 shadow-sm"
                            : "border-border bg-background/40 opacity-80"
                      )}
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-mono font-semibold text-foreground truncate text-base sm:text-lg">
                            {result.full_domain}
                          </p>
                          {isExactMatch && (
                            <span className="inline-flex items-center rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-primary">
                              Exact match
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {formatBillingPrice(result.price, result.currency)} / {result.period_years} yr
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {result.available ? (
                          <>
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-500 uppercase tracking-wide">
                              <Check className="h-3.5 w-3.5" />
                              Available
                            </span>
                            <CheckoutButton
                              items={[
                                {
                                  type: "domain",
                                  full_domain: result.full_domain,
                                  years: result.period_years,
                                },
                              ]}
                              label="Register now"
                              className="w-auto min-w-[130px] bg-gradient-to-r from-indigo-500 to-purple-600 border-0 hover:opacity-90"
                              trackId="domain_register_checkout"
                            />
                          </>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                            <X className="h-3.5 w-3.5" />
                            Taken
                          </span>
                        )}
                      </div>
                    </div>
                    );
                  })}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
