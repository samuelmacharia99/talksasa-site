import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, service, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Optional: forward to FormSpree, your backend, or send email here
    // const formspreeId = process.env.FORMSPREE_ID;
    // if (formspreeId) {
    //   await fetch(`https://formspree.io/f/${formspreeId}`, {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ name, email, phone, service, message }),
    //   });
    // }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
