import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const signingSecret = process.env.SIGNING_SECRET;

  if (!signingSecret) {
    throw new Error("Please add SIGNING_SECRET from Clerk to your environment variables");
  }

  const webhook = new Webhook(signingSecret);

  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Error: Missing SVIX headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  let event: WebhookEvent;
  try {
    event = webhook.verify(body, {
      "svix-id": svixId,
      "svix-signature": svixSignature,
      "svix-timestamp": svixTimestamp
    }) as WebhookEvent;
  } catch (error) {
    console.error(`Error: Could not verify webhook: ${error}`);
    return new Response("Error: Verification error", { status: 400 });
  }

  const { id } = event.data;
  const eventType = event.type;
  console.log(`Received webhook: ${eventType} with ID: ${id}`);
  console.log(`Webhook payload: ${body}`);

  return new Response("Webhook received", { status: 200 });
}