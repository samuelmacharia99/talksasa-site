import { NextResponse } from "next/server";
import { getDigestData } from "@/lib/admin/leads-query";
import { sendDigestEmail } from "@/lib/email/notify";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 503 });
  }

  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await getDigestData();
  const sent = await sendDigestEmail(data);

  return NextResponse.json({
    success: true,
    emailSent: sent,
    summary: {
      newLeads: data.newLeads,
      demos: data.demos,
      converted: data.converted,
      staleLeads: data.staleLeads.length,
      dueReminders: data.dueReminders.length,
    },
  });
}
