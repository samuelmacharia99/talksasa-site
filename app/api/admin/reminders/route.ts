import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { listReminders, addReminder, completeReminder } from "@/lib/admin/leads-query";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(request: Request) {
  if (!isAdminAuthenticated()) return unauthorized();
  const { searchParams } = new URL(request.url);
  const includeCompleted = searchParams.get("completed") === "1";
  const reminders = await listReminders(includeCompleted);
  return NextResponse.json(reminders);
}

export async function POST(request: Request) {
  if (!isAdminAuthenticated()) return unauthorized();

  let body: { leadId?: string; content?: string; remindAt?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.leadId || !body.content?.trim() || !body.remindAt) {
    return NextResponse.json({ error: "leadId, content, and remindAt are required" }, { status: 400 });
  }

  const reminder = await addReminder(body.leadId, body.content.trim(), body.remindAt);
  if (!reminder) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  return NextResponse.json(reminder, { status: 201 });
}

export async function PATCH(request: Request) {
  if (!isAdminAuthenticated()) return unauthorized();

  let body: { id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const done = await completeReminder(body.id);
  if (!done) {
    return NextResponse.json({ error: "Reminder not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
