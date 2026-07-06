"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Bell,
  Clock,
  ExternalLink,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CONTACT } from "@/lib/contact";
import type { LeadListItem } from "@/lib/admin/leads-query";
import {
  TYPE_LABELS,
  STATUS_COLORS,
  SCORE_COLORS,
  SOURCE_BADGE,
  STATUSES,
  formatDate,
  formatDuration,
  getLeadSource,
} from "./shared";

type Activity = {
  id: string;
  type: string;
  message: string;
  createdAt: string;
};

type LeadDrawerProps = {
  lead: LeadListItem;
  assignees: string[];
  onClose: () => void;
  onUpdate: (updates: { status?: string; assignedTo?: string | null }) => Promise<void>;
  onDelete: () => void;
};

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-2 text-sm">
      <span className="text-muted-foreground min-w-[90px] shrink-0">{label}</span>
      <span className="text-foreground">{children}</span>
    </div>
  );
}

function whatsappUrl(phone: string, name: string | null) {
  const digits = phone.replace(/\D/g, "");
  const num = digits.startsWith("254") ? digits : `254${digits.replace(/^0/, "")}`;
  const msg = encodeURIComponent(
    `Hi${name ? ` ${name}` : ""}, this is TalkSasa following up on your inquiry.`
  );
  return `https://wa.me/${num}?text=${msg}`;
}

export function LeadDrawer({ lead, assignees, onClose, onUpdate, onDelete }: LeadDrawerProps) {
  const [notes, setNotes] = useState<{ id: string; content: string; createdAt: string }[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [newNote, setNewNote] = useState("");
  const [reminderContent, setReminderContent] = useState("");
  const [reminderAt, setReminderAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const source = getLeadSource(lead);
  const badge = SOURCE_BADGE[source];

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [notesRes, actRes] = await Promise.all([
        fetch(`/api/admin/leads/${lead.id}/notes`),
        fetch(`/api/admin/leads/${lead.id}/activities`),
      ]);
      if (notesRes.ok) setNotes(await notesRes.json());
      if (actRes.ok) setActivities(await actRes.json());
    } finally {
      setLoading(false);
    }
  }, [lead.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
        fetchData();
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleAddReminder(e: React.FormEvent) {
    e.preventDefault();
    if (!reminderContent.trim() || !reminderAt) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: lead.id,
          content: reminderContent.trim(),
          remindAt: new Date(reminderAt).toISOString(),
        }),
      });
      if (res.ok) {
        setReminderContent("");
        setReminderAt("");
        fetchData();
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-xl bg-background border-l border-border overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-semibold">Lead details</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Header badges */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs font-medium">
                {TYPE_LABELS[lead.type] ?? lead.type}
              </span>
              <span className={cn("inline-flex rounded-full border px-2 py-0.5 text-xs font-medium", STATUS_COLORS[lead.status])}>
                {lead.status}
              </span>
              <span className={cn("inline-flex rounded-full border px-2 py-0.5 text-xs font-medium", SCORE_COLORS[lead.scoreLabel])}>
                {lead.scoreLabel} · {lead.score}
              </span>
              <span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-medium", badge.className)}>
                {badge.label}
              </span>
            </div>

            <div>
              <h3 className="text-xl font-semibold">{lead.name || "No name"}</h3>
              <p className="text-sm text-muted-foreground">{formatDate(lead.createdAt)}</p>
            </div>

            {lead.slaBreached && lead.status === "new" && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400 flex items-center gap-2">
                <Clock className="h-4 w-4 shrink-0" />
                Not contacted for {formatDuration(lead.minutesSinceCreated)} — SLA breached
              </div>
            )}

            {lead.duplicateOf && (
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-400">
                Possible duplicate — linked to a previous submission
              </div>
            )}

            {/* Quick actions */}
            <div className="flex flex-wrap gap-2">
              <a
                href={`mailto:${lead.email}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-muted/30"
              >
                <Mail className="h-3.5 w-3.5" /> Email
              </a>
              {lead.phone && (
                <>
                  <a
                    href={`tel:${lead.phone}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-muted/30"
                  >
                    <Phone className="h-3.5 w-3.5" /> Call
                  </a>
                  <a
                    href={whatsappUrl(lead.phone, lead.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 px-3 py-1.5 text-xs hover:bg-emerald-500/20"
                  >
                    <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Contact info */}
          <section className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Contact</h4>
            <div className="rounded-lg border border-border bg-muted/10 p-3 space-y-1.5">
              <InfoRow label="Email">{lead.email}</InfoRow>
              {lead.phone && <InfoRow label="Phone">{lead.phone}</InfoRow>}
              {lead.service && <InfoRow label="Service">{lead.service}</InfoRow>}
              {lead.message && <InfoRow label="Message">{lead.message}</InfoRow>}
              {lead.pageUrl && (
                <InfoRow label="Page">
                  <a href={lead.pageUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1 text-xs break-all">
                    {new URL(lead.pageUrl).pathname} <ExternalLink className="h-3 w-3" />
                  </a>
                </InfoRow>
              )}
            </div>
          </section>

          {/* Attribution */}
          {(lead.gclid || lead.utmSource || lead.utmCampaign) && (
            <section className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Attribution</h4>
              <div className="rounded-lg border border-border bg-muted/10 p-3 space-y-1.5">
                {lead.gclid && <InfoRow label="GCLID">{lead.gclid}</InfoRow>}
                {lead.utmSource && <InfoRow label="Source">{lead.utmSource}</InfoRow>}
                {lead.utmMedium && <InfoRow label="Medium">{lead.utmMedium}</InfoRow>}
                {lead.utmCampaign && <InfoRow label="Campaign">{lead.utmCampaign}</InfoRow>}
              </div>
            </section>
          )}

          {lead.metadata && Object.keys(lead.metadata).length > 0 && (
            <section className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Extra data</h4>
              <div className="rounded-lg border border-border bg-muted/10 p-3 space-y-1.5">
                {Object.entries(lead.metadata).map(([k, v]) => (
                  <InfoRow key={k} label={k.replace(/_/g, " ")}>{v}</InfoRow>
                ))}
              </div>
            </section>
          )}

          {/* Assignment */}
          <section className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Assignment</h4>
            <select
              value={lead.assignedTo || ""}
              onChange={(e) => onUpdate({ assignedTo: e.target.value || null })}
              className="w-full rounded-lg bg-background border border-border px-3 py-2 text-sm"
            >
              <option value="">Unassigned</option>
              {assignees.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </section>

          {/* Status */}
          <section className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</h4>
            <div className="flex gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => onUpdate({ status: s })}
                  className={cn(
                    "flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-all capitalize",
                    lead.status === s
                      ? STATUS_COLORS[s]
                      : "border-border text-muted-foreground hover:border-primary/30"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
            {lead.contactedAt && (
              <p className="text-xs text-muted-foreground">Contacted: {formatDate(lead.contactedAt)}</p>
            )}
          </section>

          {/* Reminder */}
          <section className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
              <Bell className="h-3.5 w-3.5" /> Set reminder
            </h4>
            <form onSubmit={handleAddReminder} className="space-y-2">
              <input
                type="text"
                placeholder="e.g. Call back about hosting plan"
                value={reminderContent}
                onChange={(e) => setReminderContent(e.target.value)}
                className="w-full rounded-lg bg-background/50 border border-border px-3 py-2 text-sm"
              />
              <div className="flex gap-2">
                <input
                  type="datetime-local"
                  value={reminderAt}
                  onChange={(e) => setReminderAt(e.target.value)}
                  className="flex-1 rounded-lg bg-background border border-border px-3 py-2 text-sm"
                  required
                />
                <Button type="submit" size="sm" disabled={saving}>Set</Button>
              </div>
            </form>
          </section>

          {/* Notes */}
          <section className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Notes</h4>
            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                placeholder="Add a note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="flex-1 rounded-lg bg-background/50 border border-border px-3 py-2 text-sm"
                maxLength={2000}
              />
              <Button type="submit" size="sm" disabled={saving || !newNote.trim()}>Add</Button>
            </form>
            {notes.length > 0 && (
              <div className="space-y-2 mt-2">
                {notes.map((note) => (
                  <div key={note.id} className="rounded-lg border border-border bg-muted/10 p-3 text-sm">
                    <p>{note.content}</p>
                    <span className="text-xs text-muted-foreground mt-1 block">{formatDate(note.createdAt)}</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Activity timeline */}
          <section className="space-y-2">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Timeline</h4>
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            ) : activities.length === 0 ? (
              <p className="text-sm text-muted-foreground">No activity yet</p>
            ) : (
              <div className="space-y-0 border-l border-border ml-2 pl-4">
                {activities.map((act) => (
                  <div key={act.id} className="relative pb-4 last:pb-0">
                    <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary/60 border-2 border-background" />
                    <p className="text-sm">{act.message}</p>
                    <span className="text-xs text-muted-foreground">{formatDate(act.createdAt)}</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Delete */}
          <div className="border-t border-border pt-4">
            {confirmDelete ? (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-red-400">Delete permanently?</span>
                <Button type="button" variant="outline" size="sm" onClick={() => { onDelete(); onClose(); }} className="text-red-400 border-red-400/30">
                  Confirm
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setConfirmDelete(false)}>Cancel</Button>
              </div>
            ) : (
              <Button type="button" variant="ghost" size="sm" onClick={() => setConfirmDelete(true)} className="text-red-400">
                <Trash2 className="h-4 w-4 mr-1" /> Delete lead
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
