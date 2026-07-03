"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Download,
  Loader2,
  Lock,
  LogOut,
  RefreshCw,
  Search,
  Trash2,
  X,
  Users,
  TrendingUp,
  Calendar,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LeadListItem, LeadsListResult, LeadStats } from "@/lib/admin/leads-query";

const TYPE_LABELS: Record<string, string> = {
  contact: "Contact",
  demo: "Demo",
  exit_intent: "Exit offer",
};

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  contacted: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  converted: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
};

const SOURCE_BADGE: Record<string, { label: string; className: string }> = {
  google_ads: { label: "Google Ads", className: "bg-blue-500/15 text-blue-400" },
  organic: { label: "Organic", className: "bg-green-500/15 text-green-400" },
  direct: { label: "Direct", className: "bg-gray-500/15 text-gray-400" },
};

const STATUSES = ["new", "contacted", "converted"] as const;

// ─── Login ──────────────────────────────────────────────────────────

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
          <h1 className="text-xl font-semibold">TalkSasa Admin</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to manage leads</p>
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
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>
    </div>
  );
}

// ─── Stats cards ────────────────────────────────────────────────────

function StatsCards({ stats }: { stats: LeadStats | null }) {
  if (!stats) return null;

  const convRate =
    stats.total > 0 ? ((stats.byStatus.converted / stats.total) * 100).toFixed(1) : "0";

  const cards = [
    { label: "Total leads", value: stats.total, icon: Users, accent: "text-primary" },
    { label: "Today", value: stats.today, icon: Calendar, accent: "text-blue-400" },
    { label: "This week", value: stats.thisWeek, icon: TrendingUp, accent: "text-emerald-400" },
    { label: "Conv. rate", value: `${convRate}%`, icon: BarChart3, accent: "text-amber-400" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-xl border border-border bg-background/60 backdrop-blur-sm p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">{c.label}</span>
            <c.icon className={cn("h-4 w-4", c.accent)} />
          </div>
          <div className="text-2xl font-bold">{c.value}</div>
        </div>
      ))}
    </div>
  );
}

function SourceBreakdown({ stats }: { stats: LeadStats | null }) {
  if (!stats) return null;
  const sources = [
    { key: "google_ads", count: stats.bySource.google_ads },
    { key: "organic", count: stats.bySource.organic },
    { key: "direct", count: stats.bySource.direct },
  ];
  const hasAny = sources.some((s) => s.count > 0);
  if (!hasAny) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {sources.map((s) => {
        const badge = SOURCE_BADGE[s.key];
        return (
          <span
            key={s.key}
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
              badge.className
            )}
          >
            {badge.label}: {s.count}
          </span>
        );
      })}
    </div>
  );
}

// ─── Filters bar ────────────────────────────────────────────────────

type Filters = {
  type: string;
  status: string;
  search: string;
  dateFrom: string;
  dateTo: string;
};

function FiltersBar({
  filters,
  onChange,
  onRefresh,
  onExport,
  loading,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
  onRefresh: () => void;
  onExport: () => void;
  loading: boolean;
}) {
  const [searchInput, setSearchInput] = useState(filters.search);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    onChange({ ...filters, search: searchInput });
  }

  function clearSearch() {
    setSearchInput("");
    onChange({ ...filters, search: "" });
  }

  return (
    <div className="space-y-3 mb-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search name, email, phone, service..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full rounded-lg bg-background/50 border border-border pl-9 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {searchInput && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button type="submit" variant="outline" size="sm">
          Search
        </Button>
      </form>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={filters.type}
          onChange={(e) => onChange({ ...filters, type: e.target.value })}
          className="rounded-lg bg-background border border-border px-3 py-2 text-sm"
        >
          <option value="">All types</option>
          <option value="contact">Contact</option>
          <option value="demo">Demo</option>
          <option value="exit_intent">Exit offer</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) => onChange({ ...filters, status: e.target.value })}
          className="rounded-lg bg-background border border-border px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="converted">Converted</option>
        </select>

        <input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => onChange({ ...filters, dateFrom: e.target.value })}
          className="rounded-lg bg-background border border-border px-3 py-2 text-sm"
          title="From date"
        />

        <input
          type="date"
          value={filters.dateTo}
          onChange={(e) => onChange({ ...filters, dateTo: e.target.value })}
          className="rounded-lg bg-background border border-border px-3 py-2 text-sm"
          title="To date"
        />

        <Button type="button" variant="outline" size="sm" onClick={onRefresh} disabled={loading}>
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
        </Button>

        <Button type="button" variant="outline" size="sm" onClick={onExport}>
          <Download className="h-4 w-4 mr-1" />
          CSV
        </Button>
      </div>
    </div>
  );
}

// ─── Lead detail drawer ─────────────────────────────────────────────

function getLeadSource(lead: LeadListItem): keyof typeof SOURCE_BADGE {
  if (lead.gclid) return "google_ads";
  if (lead.utmSource) return "organic";
  return "direct";
}

function LeadDrawer({
  lead,
  onClose,
  onStatusChange,
  onDelete,
}: {
  lead: LeadListItem;
  onClose: () => void;
  onStatusChange: (status: string) => void;
  onDelete: () => void;
}) {
  const [notes, setNotes] = useState<{ id: string; content: string; createdAt: string }[]>([]);
  const [newNote, setNewNote] = useState("");
  const [notesLoading, setNotesLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const fetchNotes = useCallback(async () => {
    setNotesLoading(true);
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}/notes`);
      if (res.ok) {
        setNotes(await res.json());
      }
    } finally {
      setNotesLoading(false);
    }
  }, [lead.id]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  async function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    if (!newNote.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newNote.trim() }),
      });
      if (res.ok) {
        const note = await res.json();
        setNotes((prev) => [note, ...prev]);
        setNewNote("");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteNote(noteId: string) {
    const res = await fetch(`/api/admin/leads/${lead.id}/notes?noteId=${noteId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
    }
  }

  const source = getLeadSource(lead);
  const badge = SOURCE_BADGE[source];

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg bg-background border-l border-border overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-background/90 backdrop-blur-sm border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-semibold">Lead details</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Contact info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={cn(
                  "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                  "bg-primary/10 text-primary"
                )}
              >
                {TYPE_LABELS[lead.type] ?? lead.type}
              </span>
              <span
                className={cn(
                  "inline-flex rounded-full border px-2 py-0.5 text-xs font-medium",
                  STATUS_COLORS[lead.status]
                )}
              >
                {lead.status}
              </span>
              <span
                className={cn(
                  "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                  badge.className
                )}
              >
                {badge.label}
              </span>
            </div>

            <div>
              <h3 className="text-xl font-semibold">{lead.name || "No name"}</h3>
              <p className="text-sm text-muted-foreground">{formatDate(lead.createdAt)}</p>
            </div>

            <div className="grid gap-2 text-sm">
              <InfoRow label="Email">
                <a href={`mailto:${lead.email}`} className="text-primary hover:underline">
                  {lead.email}
                </a>
              </InfoRow>
              {lead.phone && (
                <InfoRow label="Phone">
                  <a href={`tel:${lead.phone}`} className="text-primary hover:underline">
                    {lead.phone}
                  </a>
                </InfoRow>
              )}
              {lead.service && <InfoRow label="Service">{lead.service}</InfoRow>}
              {lead.message && <InfoRow label="Message">{lead.message}</InfoRow>}
              {lead.pageUrl && (
                <InfoRow label="Page">
                  <span className="text-xs break-all">{lead.pageUrl}</span>
                </InfoRow>
              )}
            </div>
          </div>

          {/* Attribution */}
          {(lead.gclid || lead.utmSource || lead.utmCampaign) && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Attribution
              </h4>
              <div className="rounded-lg border border-border bg-muted/20 p-3 text-sm space-y-1">
                {lead.gclid && <InfoRow label="GCLID">{lead.gclid}</InfoRow>}
                {lead.utmSource && <InfoRow label="Source">{lead.utmSource}</InfoRow>}
                {lead.utmMedium && <InfoRow label="Medium">{lead.utmMedium}</InfoRow>}
                {lead.utmCampaign && <InfoRow label="Campaign">{lead.utmCampaign}</InfoRow>}
              </div>
            </div>
          )}

          {/* Metadata */}
          {lead.metadata && Object.keys(lead.metadata).length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Extra data
              </h4>
              <div className="rounded-lg border border-border bg-muted/20 p-3 text-sm space-y-1">
                {Object.entries(lead.metadata).map(([k, v]) => (
                  <InfoRow key={k} label={k}>
                    {v}
                  </InfoRow>
                ))}
              </div>
            </div>
          )}

          {/* Status update */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Update status
            </h4>
            <div className="flex gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => onStatusChange(s)}
                  className={cn(
                    "flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-all",
                    lead.status === s
                      ? STATUS_COLORS[s]
                      : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Notes
            </h4>
            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                placeholder="Add a note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="flex-1 rounded-lg bg-background/50 border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                maxLength={2000}
              />
              <Button type="submit" size="sm" disabled={saving || !newNote.trim()}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
              </Button>
            </form>

            {notesLoading ? (
              <div className="text-center py-4">
                <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
              </div>
            ) : notes.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-2">No notes yet</p>
            ) : (
              <div className="space-y-2">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="rounded-lg border border-border bg-muted/20 p-3 text-sm group"
                  >
                    <p>{note.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">
                        {formatDate(note.createdAt)}
                      </span>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity"
                        title="Delete note"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Delete lead */}
          <div className="border-t border-border pt-4">
            {confirmDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-red-400">Delete this lead permanently?</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onDelete();
                    onClose();
                  }}
                  className="text-red-400 border-red-400/30 hover:bg-red-400/10"
                >
                  Confirm
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfirmDelete(false)}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setConfirmDelete(true)}
                className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete lead
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      <span className="text-muted-foreground min-w-[80px] shrink-0">{label}:</span>
      <span className="text-foreground">{children}</span>
    </div>
  );
}

// ─── Main dashboard ─────────────────────────────────────────────────

type LeadsDashboardProps = {
  initial: LeadsListResult;
};

export function LeadsDashboard({ initial }: LeadsDashboardProps) {
  const [data, setData] = useState(initial);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<LeadListItem | null>(null);
  const [filters, setFilters] = useState<Filters>({
    type: "",
    status: "",
    search: "",
    dateFrom: "",
    dateTo: "",
  });

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const res = await fetch("/api/admin/leads?action=stats");
      if (res.ok) {
        const s = (await res.json()) as LeadStats;
        setStats(s);
      }
    } catch {
      /* ignore */
    }
  }

  async function fetchLeads(page = 1, f = filters) {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (f.type) params.set("type", f.type);
      if (f.status) params.set("status", f.status);
      if (f.search) params.set("search", f.search);
      if (f.dateFrom) params.set("dateFrom", f.dateFrom);
      if (f.dateTo) params.set("dateTo", f.dateTo);

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

  function handleFiltersChange(f: Filters) {
    setFilters(f);
    fetchLeads(1, f);
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
      if (selectedLead?.id === lead.id) {
        setSelectedLead((prev) => (prev ? { ...prev, status } : null));
      }
      fetchStats();
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDeleteLead(id: string) {
    const res = await fetch(`/api/admin/leads?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setData((prev) => ({
        ...prev,
        leads: prev.leads.filter((l) => l.id !== id),
        total: prev.total - 1,
      }));
      fetchStats();
    }
  }

  async function handleExport() {
    const params = new URLSearchParams({ action: "export" });
    if (filters.type) params.set("type", filters.type);
    if (filters.status) params.set("status", filters.status);
    if (filters.search) params.set("search", filters.search);
    if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
    if (filters.dateTo) params.set("dateTo", filters.dateTo);

    const res = await fetch(`/api/admin/leads?${params}`);
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `talksasa-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
            <h1 className="text-lg font-semibold">TalkSasa CRM</h1>
            <p className="text-sm text-muted-foreground">
              {data.total} lead{data.total !== 1 ? "s" : ""} captured
            </p>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-1" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <StatsCards stats={stats} />
        <SourceBreakdown stats={stats} />

        <FiltersBar
          filters={filters}
          onChange={handleFiltersChange}
          onRefresh={() => {
            fetchLeads(data.page, filters);
            fetchStats();
          }}
          onExport={handleExport}
          loading={loading}
        />

        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left">
                <th className="px-3 py-3 font-medium">When</th>
                <th className="px-3 py-3 font-medium">Type</th>
                <th className="px-3 py-3 font-medium">Source</th>
                <th className="px-3 py-3 font-medium">Contact</th>
                <th className="px-3 py-3 font-medium">Service</th>
                <th className="px-3 py-3 font-medium">Campaign</th>
                <th className="px-3 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.leads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-muted-foreground">
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                    ) : (
                      "No leads found."
                    )}
                  </td>
                </tr>
              ) : (
                data.leads.map((lead) => {
                  const source = getLeadSource(lead);
                  const sourceBadge = SOURCE_BADGE[source];
                  return (
                    <tr
                      key={lead.id}
                      className="border-b border-border/60 align-top hover:bg-muted/20 cursor-pointer transition-colors"
                      onClick={() => setSelectedLead(lead)}
                    >
                      <td className="px-3 py-3 whitespace-nowrap text-muted-foreground">
                        {formatDate(lead.createdAt)}
                      </td>
                      <td className="px-3 py-3">
                        <span className="inline-flex rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs font-medium">
                          {TYPE_LABELS[lead.type] ?? lead.type}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                            sourceBadge.className
                          )}
                        >
                          {sourceBadge.label}
                        </span>
                      </td>
                      <td className="px-3 py-3 min-w-[180px]">
                        <div className="font-medium text-foreground">{lead.name || "---"}</div>
                        <span className="text-primary text-xs">{lead.email}</span>
                        {lead.phone && (
                          <span className="text-muted-foreground text-xs block">{lead.phone}</span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-muted-foreground">{lead.service || "---"}</td>
                      <td className="px-3 py-3 text-xs text-muted-foreground max-w-[120px]">
                        {lead.utmCampaign || lead.utmSource || (lead.gclid ? "gads" : "---")}
                      </td>
                      <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={lead.status}
                          disabled={updatingId === lead.id}
                          onChange={(e) => handleStatusChange(lead, e.target.value)}
                          className={cn(
                            "rounded-md border px-2 py-1 text-xs font-medium bg-transparent",
                            STATUS_COLORS[lead.status]
                          )}
                        >
                          {STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })
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
              onClick={() => fetchLeads(data.page - 1, filters)}
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
              onClick={() => fetchLeads(data.page + 1, filters)}
            >
              Next
            </Button>
          </div>
        )}
      </main>

      {selectedLead && (
        <LeadDrawer
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onStatusChange={(status) => handleStatusChange(selectedLead, status)}
          onDelete={() => handleDeleteLead(selectedLead.id)}
        />
      )}
    </div>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────

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
