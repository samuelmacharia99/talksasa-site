"use client";

import { useEffect, useState } from "react";
import { Download, Loader2, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CampaignRow } from "@/lib/admin/leads-query";

export function CampaignsPanel() {
  const [campaigns, setCampaigns] = useState<CampaignRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/leads?action=campaigns")
      .then((r) => r.json())
      .then((data) => setCampaigns(data))
      .finally(() => setLoading(false));
  }, []);

  async function exportOffline() {
    const res = await fetch("/api/admin/leads?action=export-offline");
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `google-ads-offline-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            Campaign performance
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Leads and conversions grouped by UTM campaign
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={exportOffline}>
          <Download className="h-4 w-4 mr-1" />
          Google Ads offline CSV
        </Button>
      </div>

      <div className="rounded-xl border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-left">
              <th className="px-4 py-3 font-medium">Campaign</th>
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3 font-medium text-right">Leads</th>
              <th className="px-4 py-3 font-medium text-right">Contacted</th>
              <th className="px-4 py-3 font-medium text-right">Converted</th>
              <th className="px-4 py-3 font-medium text-right">Conv. rate</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  No campaign data yet. Leads with UTM tags will appear here.
                </td>
              </tr>
            ) : (
              campaigns.map((c) => (
                <tr key={`${c.campaign}-${c.source}`} className="border-b border-border/60">
                  <td className="px-4 py-3 font-medium">{c.campaign}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.source}</td>
                  <td className="px-4 py-3 text-right">{c.leads}</td>
                  <td className="px-4 py-3 text-right">{c.contacted}</td>
                  <td className="px-4 py-3 text-right text-emerald-400">{c.converted}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={c.conversionRate >= 10 ? "text-emerald-400" : "text-muted-foreground"}>
                      {c.conversionRate}%
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground">
        Upload the offline CSV to Google Ads → Goals → Conversions → Uploads to train the algorithm on real sales.
      </p>
    </div>
  );
}
