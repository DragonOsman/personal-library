import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { UserJSON, DeletedObjectJSON } from "@clerk/clerk-sdk-node";
import { PoolConnection } from "mysql2/promise";
import connectionPool from "@/src/app/lib/db";

function getPrimaryEmailAddress(userData: UserJSON): string | undefined {
  if (userData.primary_email_address_id && userData.email_addresses) {
    const primaryEmail = userData.email_addresses.find(
      email => email.id === userData.primary_email_address_id
    );
    return primaryEmail?.email_address;
  }
  return userData.email_addresses?.[0]?.email_address;
}

export async function POST(req: Request) {
  const signingSecret = process.env.SIGNING_SECRET;

  if (!signingSecret) {
    console.error("SIGNING_SECRET is not set in environment variables");
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

  const eventType = event.type;

  const userIdFromEvent = (event.data as UserJSON | DeletedObjectJSON).id;
  console.log(`Received webhook: ${eventType} for user ID: ${userIdFromEvent}`);

  let dbConnection: PoolConnection | null = null;
  try {
    dbConnection = await connectionPool.getConnection();
    if (eventType === "user.created") {
      await handleUserCreated(dbConnection, event.data as unknown as UserJSON);
      return new Response("User created successfully in DB", { status: 201 });
    } else if (eventType === "user.updated") {
      await handleUserUpdated(dbConnection, event.data as unknown as UserJSON);
      return new Response("User updated successfully in DB", { status: 200 });
    } else if (eventType === "user.deleted") {
      await handleUserDeleted(dbConnection, event.data as unknown as DeletedObjectJSON);
      return new Response("User deleted successfully in DB", { status: 200 });
    }
    return new Response(
      "Webhook received, event type not handled by this endpoint",
      { status: 200 }
    );
  } catch (error) {
    console.error(`Error processing webhook event ${eventType}: ${error}`);
    const errorMessage = error instanceof Error ? error.message : error;
    return new Response(`Error processing webhook event: ${errorMessage}`, { status: 500 });
  } finally {
    if (dbConnection) {
      dbConnection.release();
    }
  }
}

async function handleUserCreated(dbConnection: PoolConnection, userData: UserJSON) {
  const primaryEmail = getPrimaryEmailAddress(userData);
  const constructedFullName = `${userData.first_name || ""} ${userData.last_name || ""}`
    .trim() || null
  ;
  const userQuery = `
    INSERT INTO users (
      id, firstName, lastName, fullName, passwordEnabled,
      primaryEmailAddress, emailAddresses, createdAt, updatedAt,
      externalAccounts, verifiedExternalAccounts, web3Wallets, primaryWeb3Wallet
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const userValues = [
    userData.id,
    userData.first_name || null,
    userData.last_name || null,
    constructedFullName,
    userData.password_enabled || false,
    primaryEmail || null,
    JSON.stringify(userData.email_addresses?.map(emailAddress => (
      { id: emailAddress.id, emailAddress: emailAddress.email_address, verified: emailAddress.verification?.status === "verified" }
    )) || []),
    new Date(userData.created_at),
    new Date(userData.updated_at),
    JSON.stringify(userData.external_accounts?.map(account => ({
      id: account.id,
      provider: account.provider, // Assuming 'provider' field exists or map accordingly
      providerUserId: account.provider_user_id,
      emailAddress: account.email_address,
      firstName: account.first_name,
      lastName: account.last_name,
      imageUrl: account.image_url,
      verified: account.verification?.status === "verified"
    })) || []),
    JSON.stringify(userData.external_accounts?.filter(account => account.verification?.status === "verified").map(acc => ({ id: acc.id, provider: acc.provider, emailAddress: acc.email_address })) || []),
    JSON.stringify(userData.web3_wallets?.map(wallet => ({ id: wallet.id, web3Wallet: wallet.web3_wallet, verified: wallet.verification?.status === "verified" })) || []),
    userData.primary_web3_wallet_id && userData.web3_wallets ? JSON.stringify(userData.web3_wallets.find(w => w.id === userData.primary_web3_wallet_id)) : null
  ];

  try {
    await dbConnection.execute(userQuery, userValues);
    console.log(`User ${userData.first_name}, id ${userData.id} inserted in database`);
  } catch (error) {
    console.error(`Error inserting user in database: ${error}`);
  }
}

async function handleUserUpdated(dbConnection: PoolConnection, userData: UserJSON) {
  const primaryEmail = getPrimaryEmailAddress(userData);
  const constructedFullName = `${userData.first_name || ""} ${userData.last_name || ""}`.trim() || null;

  const updatedUserQuery = `
    UPDATE users
    SET
      firstName = ?,
      lastName = ?,
      fullName = ?,
      passwordEnabled = ?,
      primaryEmailAddress = ?,
      emailAddresses = ?,
      updatedAt = ?,
      externalAccounts = ?,
      verifiedExternalAccounts = ?,
      web3Wallets = ?,
      primaryWeb3Wallet = ?
    WHERE id = ?
  `;

  const values = [
    userData.first_name || null,
    userData.last_name || null,
    constructedFullName,
    userData.password_enabled || false,
    primaryEmail || null,
    JSON.stringify(userData.email_addresses?.map(emailAddress => ({ id: emailAddress.id, emailAddress: emailAddress.email_address, verified: emailAddress.verification?.status === "verified" })) || []),
    new Date(userData.updated_at),
    JSON.stringify(userData.external_accounts?.map(account => ({
      id: account.id,
      provider: account.provider,
      providerUserId: account.provider_user_id,
      emailAddress: account.email_address,
      firstName: account.first_name,
      lastName: account.last_name,
      imageUrl: account.image_url,
      verified: account.verification?.status === "verified"
    })) || []),
    JSON.stringify(userData.external_accounts?.filter(account => account.verification?.status === "verified").map(
      account => ({ id: account.id, provider: account.provider, emailAddress: account.email_address })) || []
    ),
    JSON.stringify(userData.web3_wallets?.map(wallet => (
      { id: wallet.id, web3Wallet: wallet.web3_wallet, verified: wallet.verification?.status === "verified" }
    )) || []),
    userData.primary_web3_wallet_id && userData.web3_wallets ? JSON.stringify(userData.web3_wallets.find(w => w.id === userData.primary_web3_wallet_id)) : null,
    userData.id
  ];

  try {
    await dbConnection.execute(updatedUserQuery, values);
    console.log(`User ${userData.first_name}, ${userData.id} updated in database`);
  } catch (error) {
    console.error(`Error updating user in database: ${error}`);
  }
}

async function handleUserDeleted(dbConnection: PoolConnection, deletedUserData: DeletedObjectJSON) {
  if (!deletedUserData.id) {
    console.warn("User deleted event received without user ID. Skipping deletion.");
    return;
  }

  const deleteUserQuery = "DELETE FROM users WHERE id = ?";

  try {
    await dbConnection.execute(deleteUserQuery, [deletedUserData.id]);
    console.log(`User with ID ${deletedUserData.id} deleted from database`);
  } catch (error) {
    console.error(`Error deleting user from database: ${error}`);
  }

}