export const TYPE_LABELS: Record<string, string> = {
  contact: "Contact",
  demo: "Demo",
  exit_intent: "Exit offer",
};

export const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  contacted: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  converted: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
};

export const SCORE_COLORS: Record<string, string> = {
  hot: "bg-red-500/15 text-red-400 border-red-500/30",
  warm: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  cold: "bg-slate-500/15 text-slate-400 border-slate-500/30",
};

export const SOURCE_BADGE: Record<string, { label: string; className: string }> = {
  google_ads: { label: "Google Ads", className: "bg-blue-500/15 text-blue-400" },
  organic: { label: "Organic", className: "bg-green-500/15 text-green-400" },
  direct: { label: "Direct", className: "bg-gray-500/15 text-gray-400" },
};

export const STATUSES = ["new", "contacted", "converted"] as const;

export function formatDate(iso: string) {
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

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function getLeadSource(lead: { gclid: string | null; utmSource: string | null }) {
  if (lead.gclid) return "google_ads" as const;
  if (lead.utmSource) return "organic" as const;
  return "direct" as const;
}
