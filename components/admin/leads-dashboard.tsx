"use client";

import { useState } from "react";
import { Loader2, Lock, LogOut, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LeadListItem, LeadsListResult } from "@/lib/admin/leads-query";

const TYPE_LABELS: Record<string, string> = {
  contact: "Contact",
  demo: "Demo",
  exit_intent: "Exit offer",
};

const STATUSES = ["new", "contacted", "converted"] as const;

export function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }
      window.location.reload();
    } catch {
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-border glass p-6 sm:p-8 space-y-5"
      >
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-3">
            <Lock className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-xl font-semibold">Leads admin</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to view captured leads</p>
        </div>
        <div>
          <label htmlFor="admin-password" className="block text-sm font-medium mb-1.5">
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg bg-background/50 border border-border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
    </div>
  );
}

type LeadsDashboardProps = {
  initial: LeadsListResult;
};

export function LeadsDashboard({ initial }: LeadsDashboardProps) {
  const [data, setData] = useState(initial);
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function fetchLeads(page = data.page, type = typeFilter) {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (type) params.set("type", type);
      const res = await fetch(`/api/admin/leads?${params}`);
      if (res.status === 401) {
        window.location.reload();
        return;
      }
      const json = (await res.json()) as LeadsListResult;
      setData(json);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(lead: LeadListItem, status: string) {
    setUpdatingId(lead.id);
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: lead.id, status }),
      });
      if (!res.ok) return;
      setData((prev) => ({
        ...prev,
        leads: prev.leads.map((row) => (row.id === lead.id ? { ...row, status } : row)),
      }));
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  }

  const totalPages = Math.max(1, Math.ceil(data.total / data.pageSize));

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold">Leads</h1>
            <p className="text-sm text-muted-foreground">{data.total} total captured</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                fetchLeads(1, e.target.value);
              }}
              className="rounded-lg bg-background border border-border px-3 py-2 text-sm"
            >
              <option value="">All types</option>
              <option value="contact">Contact</option>
              <option value="demo">Demo</option>
              <option value="exit_intent">Exit offer</option>
            </select>
            <Button type="button" variant="outline" size="sm" onClick={() => fetchLeads()} disabled={loading}>
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left">
                <th className="px-3 py-3 font-medium">When</th>
                <th className="px-3 py-3 font-medium">Type</th>
                <th className="px-3 py-3 font-medium">Contact</th>
                <th className="px-3 py-3 font-medium">Service</th>
                <th className="px-3 py-3 font-medium">Campaign</th>
                <th className="px-3 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.leads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-muted-foreground">
                    No leads yet.
                  </td>
                </tr>
              ) : (
                data.leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-border/60 align-top">
                    <td className="px-3 py-3 whitespace-nowrap text-muted-foreground">
                      {formatDate(lead.createdAt)}
                    </td>
                    <td className="px-3 py-3">
                      <span className="inline-flex rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs font-medium">
                        {TYPE_LABELS[lead.type] ?? lead.type}
                      </span>
                    </td>
                    <td className="px-3 py-3 min-w-[200px]">
                      <div className="font-medium text-foreground">{lead.name || "—"}</div>
                      <a href={`mailto:${lead.email}`} className="text-primary hover:underline block">
                        {lead.email}
                      </a>
                      {lead.phone && (
                        <a href={`tel:${lead.phone}`} className="text-muted-foreground hover:text-foreground block">
                          {lead.phone}
                        </a>
                      )}
                      {lead.message && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{lead.message}</p>
                      )}
                      {lead.metadata && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {Object.entries(lead.metadata)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(" · ")}
                        </p>
                      )}
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{lead.service || "—"}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground min-w-[120px]">
                      {lead.gclid && <div>gclid: {truncate(lead.gclid, 16)}</div>}
                      {lead.utmSource && <div>{lead.utmSource}{lead.utmMedium ? ` / ${lead.utmMedium}` : ""}</div>}
                      {lead.utmCampaign && <div>{lead.utmCampaign}</div>}
                      {!lead.gclid && !lead.utmSource && !lead.utmCampaign && "—"}
                    </td>
                    <td className="px-3 py-3">
                      <select
                        value={lead.status}
                        disabled={updatingId === lead.id}
                        onChange={(e) => handleStatusChange(lead, e.target.value)}
                        className="rounded-md bg-background border border-border px-2 py-1 text-xs"
                      >
                        {STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={data.page <= 1 || loading}
              onClick={() => fetchLeads(data.page - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {data.page} of {totalPages}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={data.page >= totalPages || loading}
              onClick={() => fetchLeads(data.page + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-KE", {
      dateStyle: "short",
      timeStyle: "short",
      timeZone: "Africa/Nairobi",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function truncate(value: string, max: number) {
  return value.length > max ? `${value.slice(0, max)}…` : value;
}
