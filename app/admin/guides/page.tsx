import type { Metadata } from "next";
import { AdminLogin } from "@/components/admin/leads-dashboard";
import { GuidesDashboard } from "@/components/admin/guides-dashboard";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/admin/auth";
import { listGuides } from "@/lib/admin/guides-query";

export const metadata: Metadata = {
  title: "Guides admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function NotConfigured() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md rounded-2xl border border-border glass p-6 text-center">
        <h1 className="text-lg font-semibold">Admin not configured</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Set <code className="text-xs">LEADS_ADMIN_PASSWORD</code> and{" "}
          <code className="text-xs">ADMIN_SESSION_SECRET</code> in your environment.
        </p>
      </div>
    </div>
  );
}

export default async function AdminGuidesPage() {
  if (!isAdminConfigured()) return <NotConfigured />;
  if (!isAdminAuthenticated()) return <AdminLogin />;

  const initial = await listGuides(1, 25);
  return <GuidesDashboard initial={initial} />;
}
