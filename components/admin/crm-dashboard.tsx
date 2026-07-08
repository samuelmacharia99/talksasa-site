"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  Calendar,
  Clock,
  Download,
  LayoutDashboard,
  Loader2,
  LogOut,
  Mail,
  RefreshCw,
  Search,
  Target,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LeadListItem, LeadsListResult, LeadStats } from "@/lib/admin/leads-query";
import { LeadDrawer } from "./lead-drawer";
import { CampaignsPanel } from "./campaigns-panel";
import { RemindersPanel } from "./reminders-panel";
import {
  TYPE_LABELS,
  STATUS_COLORS,
  SCORE_COLORS,
  SOURCE_BADGE,
  formatDate,
  formatDuration,
  getLeadSource,
} from "./shared";

type Tab = "dashboard" | "leads" | "campaigns" | "reminders";

type Filters = {
  type: string;
  status: string;
  search: string;
  dateFrom: string;
  dateTo: string;
  assignedTo: string;
  priority: string;
  staleOnly: boolean;
};

const TABS: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "leads", label: "Leads", icon: Users },
  { id: "campaigns", label: "Campaigns", icon: Target },
  { id: "reminders", label: "Reminders", icon: Bell },
];

type CrmDashboardProps = {
  initial: LeadsListResult;
};

export function CrmDashboard({ initial }: CrmDashboardProps) {
  const [tab, setTab] = useState<Tab>("dashboard");
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
    assignedTo: "",
    priority: "",
    staleOnly: false,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const res = await fetch("/api/admin/leads?action=stats");
      if (res.ok) setStats(await res.json());
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
      if (f.assignedTo) params.set("assignedTo", f.assignedTo);
      if (f.priority) params.set("priority", f.priority);
      if (f.staleOnly) params.set("staleOnly", "1");

      const res = await fetch(`/api/admin/leads?${params}`);
      if (res.status === 401) {
        window.location.reload();
        return;
      }
      setData(await res.json());
    } finally {
      setLoading(false);
    }
  }

  async function openLeadById(leadId: string) {
    const found = data.leads.find((l) => l.id === leadId);
    if (found) {
      setSelectedLead(found);
      setTab("leads");
      return;
    }
    setTab("leads");
    await fetchLeads();
  }

  async function handleUpdate(lead: LeadListItem, updates: { status?: string; assignedTo?: string | null }) {
    setUpdatingId(lead.id);
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: lead.id, ...updates }),
      });
      if (!res.ok) return;
      setData((prev) => ({
        ...prev,
        leads: prev.leads.map((row) =>
          row.id === lead.id
            ? {
                ...row,
                ...(updates.status ? { status: updates.status } : {}),
                ...(updates.assignedTo !== undefined ? { assignedTo: updates.assignedTo } : {}),
              }
            : row
        ),
      }));
      if (selectedLead?.id === lead.id) {
        setSelectedLead((prev) => (prev ? { ...prev, ...updates } : null));
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

  async function handleExport(action: "export" | "export-offline" = "export") {
    const params = new URLSearchParams({ action });
    if (action === "export") {
      if (filters.type) params.set("type", filters.type);
      if (filters.status) params.set("status", filters.status);
      if (filters.search) params.set("search", filters.search);
      if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
      if (filters.dateTo) params.set("dateTo", filters.dateTo);
    }
    const res = await fetch(`/api/admin/leads?${params}`);
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = action === "export-offline"
      ? `google-ads-offline-${new Date().toISOString().slice(0, 10)}.csv`
      : `talksasa-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  }

  const totalPages = Math.max(1, Math.ceil(data.total / data.pageSize));
  const assignees = stats?.assignees ?? ["Sales Team"];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-lg font-semibold">TalkSasa CRM</h1>
              <p className="text-sm text-muted-foreground">
                {stats?.total ?? data.total} leads · {stats?.staleCount ?? 0} need follow-up
              </p>
            </div>
            <div className="flex items-center gap-2">
              {!stats?.emailConfigured && (
                <span className="text-xs text-amber-400 flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" /> SMTP not configured
                </span>
              )}
              <Button type="button" variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-1" /> Logout
              </Button>
            </div>
          </div>

          <nav className="flex gap-1 -mb-px overflow-x-auto pb-px">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                  tab === t.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
                {t.id === "reminders" && stats && stats.staleCount > 0 && (
                  <span className="ml-1 rounded-full bg-red-500/20 text-red-400 px-1.5 py-0.5 text-xs">
                    !
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {tab === "dashboard" && (
          <DashboardTab
            stats={stats}
            onViewStale={() => {
              const staleFilters = { ...filters, staleOnly: true, status: "new" };
              setFilters(staleFilters);
              setTab("leads");
              fetchLeads(1, staleFilters);
            }}
            onExport={handleExport}
          />
        )}

        {tab === "leads" && (
          <LeadsTab
            data={data}
            loading={loading}
            filters={filters}
            assignees={assignees}
            updatingId={updatingId}
            totalPages={totalPages}
            onFiltersChange={(f) => { setFilters(f); fetchLeads(1, f); }}
            onRefresh={() => { fetchLeads(data.page, filters); fetchStats(); }}
            onExport={() => handleExport("export")}
            onPageChange={(p) => fetchLeads(p, filters)}
            onSelectLead={setSelectedLead}
            onStatusChange={(lead, status) => handleUpdate(lead, { status })}
          />
        )}

        {tab === "campaigns" && <CampaignsPanel />}
        {tab === "reminders" && <RemindersPanel onOpenLead={openLeadById} />}
      </main>

      {selectedLead && (
        <LeadDrawer
          lead={selectedLead}
          assignees={assignees}
          onClose={() => setSelectedLead(null)}
          onUpdate={(updates) => handleUpdate(selectedLead, updates)}
          onDelete={() => handleDeleteLead(selectedLead.id)}
        />
      )}
    </div>
  );
}

// ─── Dashboard tab ──────────────────────────────────────────────────

function DashboardTab({
  stats,
  onViewStale,
  onExport,
}: {
  stats: LeadStats | null;
  onViewStale: () => void;
  onExport: (action?: "export" | "export-offline") => void;
}) {
  if (!stats) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const convRate = stats.total > 0 ? ((stats.byStatus.converted / stats.total) * 100).toFixed(1) : "0";

  const cards = [
    { label: "Total leads", value: stats.total, icon: Users, accent: "text-primary" },
    { label: "Today", value: stats.today, icon: Calendar, accent: "text-blue-400" },
    { label: "This week", value: stats.thisWeek, icon: TrendingUp, accent: "text-emerald-400" },
    { label: "Conv. rate", value: `${convRate}%`, icon: BarChart3, accent: "text-amber-400" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-border bg-background/60 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">{c.label}</span>
              <c.icon className={cn("h-4 w-4", c.accent)} />
            </div>
            <div className="text-2xl font-bold">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <MetricCard
          label="Avg response time"
          value={stats.avgResponseMinutes != null ? formatDuration(stats.avgResponseMinutes) : "—"}
          icon={Clock}
          hint="Time from lead to first contact"
        />
        <MetricCard
          label="Stale leads"
          value={String(stats.staleCount)}
          icon={AlertTriangle}
          hint="New leads waiting too long"
          alert={stats.staleCount > 0}
          onClick={stats.staleCount > 0 ? onViewStale : undefined}
        />
        <MetricCard
          label="Email alerts"
          value={stats.emailConfigured ? "Active" : "Off"}
          icon={Mail}
          hint={stats.emailConfigured ? "SMTP configured" : "Set SMTP_* in .env"}
          alert={!stats.emailConfigured}
        />
      </div>

      {stats.staleCount > 0 && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-start gap-2 text-sm text-red-400">
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>
              <strong>{stats.staleCount}</strong> lead{stats.staleCount !== 1 ? "s" : ""} haven&apos;t been contacted within the SLA window.
            </span>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={onViewStale} className="border-red-500/30 text-red-400 shrink-0">
            View stale leads
          </Button>
        </div>
      )}

      <div className="grid sm:grid-cols-3 gap-3">
        <StatusBlock title="By status" items={[
          { label: "New", value: stats.byStatus.new, color: "text-blue-400" },
          { label: "Contacted", value: stats.byStatus.contacted, color: "text-amber-400" },
          { label: "Converted", value: stats.byStatus.converted, color: "text-emerald-400" },
          { label: "Lost", value: stats.byStatus.lost, color: "text-red-400" },
        ]} />
        <StatusBlock title="By type" items={[
          { label: "Contact", value: stats.byType.contact, color: "text-foreground" },
          { label: "Demo", value: stats.byType.demo, color: "text-foreground" },
          { label: "Exit offer", value: stats.byType.exit_intent, color: "text-foreground" },
        ]} />
        <StatusBlock title="By source" items={[
          { label: "Google Ads", value: stats.bySource.google_ads, color: "text-blue-400" },
          { label: "Organic", value: stats.bySource.organic, color: "text-green-400" },
          { label: "Direct", value: stats.bySource.direct, color: "text-muted-foreground" },
        ]} />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => onExport("export")}>
          <Download className="h-4 w-4 mr-1" /> Export all leads
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => onExport("export-offline")}>
          <Download className="h-4 w-4 mr-1" /> Google Ads offline CSV
        </Button>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon: Icon,
  hint,
  alert,
  onClick,
}: {
  label: string;
  value: string;
  icon: typeof Clock;
  hint: string;
  alert?: boolean;
  onClick?: () => void;
}) {
  const Wrapper = onClick ? "button" : "div";
  return (
    <Wrapper
      onClick={onClick}
      className={cn(
        "rounded-xl border border-border bg-muted/10 p-4 text-left w-full",
        onClick && "hover:border-primary/30 cursor-pointer",
        alert && "border-amber-500/30"
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        <Icon className={cn("h-4 w-4", alert ? "text-amber-400" : "text-muted-foreground")} />
        <span className="text-xs text-muted-foreground uppercase tracking-wide">{label}</span>
      </div>
      <div className={cn("text-xl font-bold", alert && "text-amber-400")}>{value}</div>
      <p className="text-xs text-muted-foreground mt-1">{hint}</p>
    </Wrapper>
  );
}

function StatusBlock({
  title,
  items,
}: {
  title: string;
  items: { label: string; value: number; color: string }[];
}) {
  return (
    <div className="rounded-xl border border-border bg-muted/10 p-4">
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">{title}</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.label} className="flex justify-between text-sm">
            <span className="text-muted-foreground">{item.label}</span>
            <span className={cn("font-semibold", item.color)}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Leads tab ──────────────────────────────────────────────────────

function LeadsTab({
  data,
  loading,
  filters,
  assignees,
  updatingId,
  totalPages,
  onFiltersChange,
  onRefresh,
  onExport,
  onPageChange,
  onSelectLead,
  onStatusChange,
}: {
  data: LeadsListResult;
  loading: boolean;
  filters: Filters;
  assignees: string[];
  updatingId: string | null;
  totalPages: number;
  onFiltersChange: (f: Filters) => void;
  onRefresh: () => void;
  onExport: () => void;
  onPageChange: (page: number) => void;
  onSelectLead: (lead: LeadListItem) => void;
  onStatusChange: (lead: LeadListItem, status: string) => void;
}) {
  const [searchInput, setSearchInput] = useState(filters.search);

  return (
    <div className="space-y-4">
      <form
        onSubmit={(e) => { e.preventDefault(); onFiltersChange({ ...filters, search: searchInput }); }}
        className="flex gap-2"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search name, email, phone..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full rounded-lg bg-background/50 border border-border pl-9 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {searchInput && (
            <button type="button" onClick={() => { setSearchInput(""); onFiltersChange({ ...filters, search: "" }); }} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button type="submit" variant="outline" size="sm">Search</Button>
      </form>

      <div className="flex flex-wrap gap-2">
        <FilterSelect value={filters.type} onChange={(v) => onFiltersChange({ ...filters, type: v })} options={[
          { value: "", label: "All types" },
          { value: "contact", label: "Contact" },
          { value: "demo", label: "Demo" },
          { value: "exit_intent", label: "Exit offer" },
        ]} />
        <FilterSelect value={filters.status} onChange={(v) => onFiltersChange({ ...filters, status: v })} options={[
          { value: "", label: "All statuses" },
          { value: "new", label: "New" },
          { value: "contacted", label: "Contacted" },
          { value: "converted", label: "Converted" },
          { value: "lost", label: "Lost" },
        ]} />
        <FilterSelect value={filters.priority} onChange={(v) => onFiltersChange({ ...filters, priority: v })} options={[
          { value: "", label: "All priority" },
          { value: "hot", label: "Hot" },
          { value: "warm", label: "Warm" },
        ]} />
        <FilterSelect value={filters.assignedTo} onChange={(v) => onFiltersChange({ ...filters, assignedTo: v })} options={[
          { value: "", label: "All assignees" },
          { value: "__unassigned__", label: "Unassigned" },
          ...assignees.map((a) => ({ value: a, label: a })),
        ]} />
        <input type="date" value={filters.dateFrom} onChange={(e) => onFiltersChange({ ...filters, dateFrom: e.target.value })} className="rounded-lg bg-background border border-border px-3 py-2 text-sm" />
        <input type="date" value={filters.dateTo} onChange={(e) => onFiltersChange({ ...filters, dateTo: e.target.value })} className="rounded-lg bg-background border border-border px-3 py-2 text-sm" />
        <label className="flex items-center gap-1.5 text-sm text-muted-foreground cursor-pointer">
          <input type="checkbox" checked={filters.staleOnly} onChange={(e) => onFiltersChange({ ...filters, staleOnly: e.target.checked })} className="rounded" />
          Stale only
        </label>
        <Button type="button" variant="outline" size="sm" onClick={onRefresh} disabled={loading}>
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onExport}>
          <Download className="h-4 w-4 mr-1" /> CSV
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-left">
              <th className="px-3 py-3 font-medium">When</th>
              <th className="px-3 py-3 font-medium">Score</th>
              <th className="px-3 py-3 font-medium">Type</th>
              <th className="px-3 py-3 font-medium">Contact</th>
              <th className="px-3 py-3 font-medium">Assigned</th>
              <th className="px-3 py-3 font-medium">Campaign</th>
              <th className="px-3 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.leads.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-3 py-10 text-center text-muted-foreground">
                  {loading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "No leads found."}
                </td>
              </tr>
            ) : (
              data.leads.map((lead) => {
                const source = getLeadSource(lead);
                const sourceBadge = SOURCE_BADGE[source];
                return (
                  <tr
                    key={lead.id}
                    className={cn(
                      "border-b border-border/60 align-top hover:bg-muted/20 cursor-pointer transition-colors",
                      lead.slaBreached && "bg-red-500/5"
                    )}
                    onClick={() => onSelectLead(lead)}
                  >
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="text-muted-foreground">{formatDate(lead.createdAt)}</div>
                      {lead.status === "new" && (
                        <div className={cn("text-xs mt-0.5", lead.slaBreached ? "text-red-400" : "text-muted-foreground")}>
                          {formatDuration(lead.minutesSinceCreated)} ago
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <span className={cn("inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize", SCORE_COLORS[lead.scoreLabel])}>
                        {lead.score}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="inline-flex rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs font-medium">
                        {TYPE_LABELS[lead.type] ?? lead.type}
                      </span>
                      <span className={cn("block mt-1 inline-flex rounded-full px-2 py-0.5 text-xs", sourceBadge.className)}>
                        {sourceBadge.label}
                      </span>
                    </td>
                    <td className="px-3 py-3 min-w-[160px]">
                      <div className="font-medium">{lead.name || "—"}</div>
                      <span className="text-primary text-xs">{lead.email}</span>
                      {lead.phone && <span className="text-muted-foreground text-xs block">{lead.phone}</span>}
                      {lead.duplicateOf && <span className="text-amber-400 text-xs">Duplicate</span>}
                    </td>
                    <td className="px-3 py-3 text-muted-foreground text-xs">{lead.assignedTo || "—"}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground max-w-[100px] truncate">
                      {lead.utmCampaign || lead.utmSource || "—"}
                    </td>
                    <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={lead.status}
                        disabled={updatingId === lead.id}
                        onChange={(e) => onStatusChange(lead, e.target.value)}
                        className={cn("rounded-md border px-2 py-1 text-xs font-medium bg-transparent capitalize", STATUS_COLORS[lead.status])}
                      >
                        <option value="new">new</option>
                        <option value="contacted">contacted</option>
                        <option value="converted">converted</option>
                        <option value="lost">lost</option>
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
        <div className="flex items-center justify-center gap-3">
          <Button type="button" variant="outline" size="sm" disabled={data.page <= 1 || loading} onClick={() => onPageChange(data.page - 1)}>
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">Page {data.page} of {totalPages}</span>
          <Button type="button" variant="outline" size="sm" disabled={data.page >= totalPages || loading} onClick={() => onPageChange(data.page + 1)}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

function FilterSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg bg-background border border-border px-3 py-2 text-sm"
    >
      {options.map((o) => (
        <option key={o.value || "__all__"} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}
