import { NextResponse, NextRequest } from "next/server";
import { headers } from "next/headers";
import { Resend } from "resend";
import prisma from "@/src/app/lib/db";

const resend = new Resend(process.env.RESEND_WEBHOOK_SECRET);

const isEmailEvent = (
  event: Awaited<ReturnType<typeof resend.webhooks.verify>>
): event is typeof event & {
  data: {
    email_id: string;
    to?: string[];
  };
} => {
  return event.type.startsWith("email.");
};

export const POST = async (request: NextRequest) => {
  try {
    const rawBody = await request.text();
    const h = await headers();
    const signature = h.get("resend-signature") || "";

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const event = resend.webhooks.verify({
      payload: rawBody,
      headers: {
        signature,
        id: h.get("resend-id") || "",
        timestamp: h.get("resend-timestamp") || ""
      },
      webhookSecret: process.env.RESEND_WEBHOOK_SECRET || ""
    });

    if (!isEmailEvent(event)) {
      return NextResponse.json({ received: true });
    }

    const type = event.type;
    const emailId = event.data?.email_id ?? null;
    const email = event.data?.to?.[0] ?? null;

    await prisma.emailEvent.create({
      data: {
        type,
        resendId: emailId,
        email
      }
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`Error processing webhook: ${error instanceof Error ? error.message : String(error)}`);
    return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
  }
};