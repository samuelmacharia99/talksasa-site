"use client";

import { useCallback, useEffect, useState } from "react";
import { Bell, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ReminderItem } from "@/lib/admin/leads-query";
import { formatDate } from "./shared";

export function RemindersPanel({ onOpenLead }: { onOpenLead?: (leadId: string) => void }) {
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState<string | null>(null);

  const fetchReminders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reminders");
      if (res.ok) setReminders(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  async function handleComplete(id: string) {
    setCompleting(id);
    try {
      const res = await fetch("/api/admin/reminders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setReminders((prev) => prev.filter((r) => r.id !== id));
      }
    } finally {
      setCompleting(null);
    }
  }

  const overdue = reminders.filter((r) => r.overdue);
  const upcoming = reminders.filter((r) => !r.overdue);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          Follow-up reminders
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Set reminders from a lead&apos;s detail panel
        </p>
      </div>

      {reminders.length === 0 ? (
        <div className="rounded-xl border border-border bg-muted/10 px-6 py-12 text-center text-muted-foreground text-sm">
          No pending reminders. Open a lead and set a follow-up reminder.
        </div>
      ) : (
        <>
          {overdue.length > 0 && (
            <ReminderGroup
              title="Overdue"
              titleClass="text-red-400"
              items={overdue}
              completing={completing}
              onComplete={handleComplete}
              onOpenLead={onOpenLead}
            />
          )}
          {upcoming.length > 0 && (
            <ReminderGroup
              title="Upcoming"
              titleClass="text-foreground"
              items={upcoming}
              completing={completing}
              onComplete={handleComplete}
              onOpenLead={onOpenLead}
            />
          )}
        </>
      )}
    </div>
  );
}

function ReminderGroup({
  title,
  titleClass,
  items,
  completing,
  onComplete,
  onOpenLead,
}: {
  title: string;
  titleClass: string;
  items: ReminderItem[];
  completing: string | null;
  onComplete: (id: string) => void;
  onOpenLead?: (leadId: string) => void;
}) {
  return (
    <div className="space-y-2">
      <h3 className={cn("text-sm font-medium", titleClass)}>{title} ({items.length})</h3>
      <div className="space-y-2">
        {items.map((r) => (
          <div
            key={r.id}
            className={cn(
              "rounded-xl border px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3",
              r.overdue ? "border-red-500/30 bg-red-500/5" : "border-border bg-muted/10"
            )}
          >
            <div className="flex-1 min-w-0">
              <button
                type="button"
                onClick={() => onOpenLead?.(r.leadId)}
                className="font-medium text-sm hover:text-primary text-left"
              >
                {r.leadName || r.leadEmail}
              </button>
              <p className="text-sm text-muted-foreground mt-0.5">{r.content}</p>
              <p className="text-xs text-muted-foreground mt-1">{formatDate(r.remindAt)}</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={completing === r.id}
              onClick={() => onComplete(r.id)}
              className="shrink-0"
            >
              {completing === r.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Check className="h-4 w-4 mr-1" /> Done
                </>
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
