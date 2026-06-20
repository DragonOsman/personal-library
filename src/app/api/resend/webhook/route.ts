// Copyright (c) 2026 Osman Zakir
// Licensed under the GPL v3

import { NextResponse, NextRequest } from "next/server";
import { headers } from "next/headers";
import { Resend } from "resend";
import prisma from "@/lib/db";

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
    const reqHeaders = await headers();
    const signature = reqHeaders.get("resend-signature") || "";
    const body = await request.json();

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const eventPayload = resend.webhooks.verify({
      payload: body,
      headers: {
        signature,
        id: reqHeaders.get("resend-id") || "",
        timestamp: reqHeaders.get("resend-timestamp") || ""
      },
      webhookSecret: process.env.RESEND_WEBHOOK_SECRET || ""
    });

    if (!isEmailEvent(eventPayload)) {
      return NextResponse.json({ received: true });
    }

    const emailId = eventPayload.data?.email_id ?? null;
    const type = eventPayload.type;
    const subject = body.data?.subject;

    await prisma.emailEvent.upsert({
      where: {
        id: emailId
      },
      create: {
        emailId,
        type,
        subject: subject!,
        payload: body,
        recipient: body?.data?.to?.[0] ?? null
      },
      update: {
        type,
        payload: body
      }
    });

    switch (body.type) {
      case "email.delivered":
        await prisma.emailEvent.updateMany({
          where: {
            emailId:
              body.data.email_id
          },
          data: {
            deliveredAt: new Date()
          }
        });

        break;

      case "email.sent":
        await prisma.emailEvent.updateMany({
          where: {
            emailId: body.data.email_id
          },
          data: {
            createdAt: new Date()
          }
        });

        break;

      case "email.bounced":
        await prisma.emailEvent.updateMany({
          where: {
            emailId:
              body.data.email_id
          },
          data: {
            bouncedAt:
              new Date()
          }
        });

        break;

      case "email.failed":
        await prisma.emailEvent.updateMany({
          where: {
            emailId:
              body.data.email_id
          },
          data: {
            failedAt:
              new Date()
          }
        });

        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`Error processing webhook: ${error instanceof Error ? error.message : String(error)}`);
    return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
  }
};