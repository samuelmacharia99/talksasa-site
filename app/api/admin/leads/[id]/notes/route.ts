import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { getLeadNotes, addLeadNote, deleteNote } from "@/lib/admin/leads-query";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

type RouteContext = { params: { id: string } };

export async function GET(_request: Request, { params }: RouteContext) {
  if (!isAdminAuthenticated()) return unauthorized();
  const notes = await getLeadNotes(params.id);
  return NextResponse.json(notes);
}

export async function POST(request: Request, { params }: RouteContext) {
  if (!isAdminAuthenticated()) return unauthorized();

  let body: { content?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const content = typeof body.content === "string" ? body.content.trim() : "";
  if (!content || content.length > 2000) {
    return NextResponse.json({ error: "Note content required (max 2000 chars)" }, { status: 400 });
  }

  const note = await addLeadNote(params.id, content);
  return NextResponse.json(note, { status: 201 });
}

export async function DELETE(request: Request) {
  if (!isAdminAuthenticated()) return unauthorized();

  const { searchParams } = new URL(request.url);
  const noteId = searchParams.get("noteId");
  if (!noteId) {
    return NextResponse.json({ error: "noteId is required" }, { status: 400 });
  }

  const deleted = await deleteNote(noteId);
  if (!deleted) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
