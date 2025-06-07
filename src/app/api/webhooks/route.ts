import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent, currentUser, User } from "@clerk/nextjs/server";
import { PoolConnection } from "mysql2/promise";
import connectionPool from "@/src/app/lib/db";
import { v4 } from "uuid";

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

  const user = await currentUser();

  if (!user) {
    return new Response("Error: User not found", { status: 404 });
  }

  const dbConnection: PoolConnection | null = await connectionPool.getConnection();
  if (eventType === "user.created") {
    return createUser(dbConnection, user);
  } else if (eventType === "user.updated") {
    return updateUser(dbConnection, user);
  } else if (eventType === "user.deleted") {
    const deleteUserQuery = `DELETE FROM users WHERE id = ?`;
    const deleteUserValue = user.id;
    const deleteLibraryQuery = `DELETE FROM libraries WHERE userId = ?`;

    try {
      await dbConnection.execute(deleteUserQuery, [deleteUserValue]);
      await dbConnection.execute(deleteLibraryQuery, [deleteUserValue]);
    } catch (error) {
      console.error(`Error deleting user and/or libraryfrom database: ${error}`);
      return new Response("Error: Database deletion error", { status: 500 });
    }

    return new Response("User and deleted successfully", { status: 200 });
  }

  return new Response("Webhook received", { status: 200 });
}

async function createUser(dbConnection: PoolConnection, user: User) {
  const userQuery = `
    INSERT INTO users (id, primaryEmailAddress, emailAddresses, firstName, lastName, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const userValues = [
    user.id,
    user.primaryEmailAddress,
    user.emailAddresses,
    user.firstName,
    user.lastName,
    new Date(),
    new Date()
  ];

  const libraryQuery = `
    INSERT INTO libraries (id, userId, books)
    VALUES (?, ?, ?)
  `;

  const libraryValues = [v4(), user.id, []];

  const libraryId = libraryValues[0];
  try {
    await dbConnection.execute(libraryQuery, libraryValues);
  } catch (error) {
    console.error(`Error inserting library into database: ${error}`);
    return new Response("Error: Database insertion error", { status: 500 });
  }

  const updateUserQuery = `UPDATE users SET libraryId = ? WHERE id = ?`;
  const updateUserValues = [
    libraryId,
    user.id
  ];

  try {
    await dbConnection.execute(userQuery, userValues);
    console.log("User inserted into database");
  } catch (error) {
    console.error(`Error inserting user into database: ${error}`);
    return new Response("Error: Database insertion error", { status: 500 });
  }

  try {
    await dbConnection.execute(updateUserQuery, updateUserValues);
    console.log("User updated with library ID");
  } catch (error) {
    console.error(`Error updating user with library ID: ${error}`);
    return new Response("Error: Database update error", { status: 500 });
  }

  return new Response("User created successfully", { status: 200 });
}

async function updateUser(dbConnection: PoolConnection, user: User) {
  const query = `
    UPDATE users
    SET primaryEmailAddress = ?, emailAddresses = ?, firstName = ?, lastName = ?, updatedAt = ?
    WHERE id = ?
  `;

  const values = [
    user.primaryEmailAddress,
    user.emailAddresses,
    user.firstName,
    user.lastName,
    user.fullName,
    new Date(),
    user.id
  ];

  try {
    await dbConnection.execute(query, values);
    console.log("User updated in database");
  } catch (error) {
    console.error(`Error updating user in database: ${error}`);
    return new Response("Error: Database update error", { status: 500 });
  }

  return new Response("User updated successfully", { status: 200 });
}