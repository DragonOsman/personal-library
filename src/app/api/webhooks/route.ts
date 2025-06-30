import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { UserJSON, DeletedObjectJSON } from "@clerk/clerk-sdk-node";
import { PoolClient } from "pg";
import pool from "@/src/app/lib/db";

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

  let dbClient: PoolClient | null = null;
  try {
    dbClient = await pool.connect();
    if (eventType === "user.created") {
      await handleUserCreated(dbClient, event.data as unknown as UserJSON);
      return new Response("User created successfully in DB", { status: 201 });
    } else if (eventType === "user.updated") {
      await handleUserUpdated(dbClient, event.data as unknown as UserJSON);
      return new Response("User updated successfully in DB", { status: 200 });
    } else if (eventType === "user.deleted") {
      await handleUserDeleted(dbClient, event.data as unknown as DeletedObjectJSON);
      return new Response("User deleted successfully in DB", { status: 200 });
    }
    return new Response(
      "Webhook received, event type not handled by this endpoint",
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Error processing webhook event ${eventType}: ${errorMessage}`, error);
    return new Response(`Error processing webhook event: ${errorMessage}`, { status: 500 });
  } finally {
    if (dbClient) {
      dbClient.release();
    }
  }
}

async function handleUserCreated(dbClient: PoolClient, userData: UserJSON) {
  const userQuery = `
    INSERT INTO users (
      id, firstName, lastName, fullName, passwordEnabled,
      primaryEmailAddress, emailAddresses, verifiedEmailAddresses, createdAt, updatedAt,
      externalAccounts, verifiedExternalAccounts, web3Wallets, primaryWeb3Wallet
    )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
	    ON CONFLICT (id) DO NOTHING;
    `
  ;

  const primaryEmail = getPrimaryEmailAddress(userData);
  const constructedFullName = `${userData.first_name || ""} ${userData.last_name || ""}`.trim() || null;

  const userValues = [
    userData.id,
    userData.first_name || null,
    userData.last_name || null,
    constructedFullName,
    userData.password_enabled || false,
    primaryEmail || null,
    userData.email_addresses?.map(emailAddress => ({
      id: emailAddress.id,
      emailAddress: emailAddress.email_address,
      verified: emailAddress.verification?.status === "verified"
    }
  )) || [],
    new Date(userData.created_at),
    new Date(userData.updated_at),
    userData.external_accounts?.map(account => ({
      id: account.id,
      provider: account.provider, // Assuming 'provider' field exists or map accordingly
      providerUserId: account.provider_user_id,
      emailAddress: account.email_address,
      firstName: account.first_name,
      lastName: account.last_name,
      imageUrl: account.image_url,
      verified: account.verification?.status === "verified"
    })) || [],
    userData.external_accounts?.filter(
      account => account.verification?.status === "verified"
    ).map(
      account => ({ id: account.id, provider: account.provider, emailAddress: account.email_address })
    ) || [],
    userData.web3_wallets?.map(wallet =>
      ({ id: wallet.id, web3Wallet: wallet.web3_wallet, verified: wallet.verification?.status === "verified" })
    ) || [],
    userData.primary_web3_wallet_id && userData.web3_wallets ? userData.web3_wallets.find(
      wallet => wallet.id === userData.primary_web3_wallet_id
    ) : null
  ];

  try {
    await dbClient.query(userQuery, userValues);
    console.log(`User ${userData.first_name}, id ${userData.id} inserted in database`);
  } catch (error) {
    console.error(`Error inserting user in database: ${error}`);

    // Re-throw to be caught by the main handler
    throw error;
  }
}

async function handleUserUpdated(dbClient: PoolClient, userData: UserJSON) {
  const updatedUserQuery = `
   UPDATE users
    SET
      firstName = $1,
      lastName = $2,
      fullName = $3,
      passwordEnabled = $4,
      primaryEmailAddress = $5,
      emailAddresses = $6,
      verifiedEmailAddresses = $7,
      updatedAt = $8,
      externalAccounts = $9,
      verifiedExternalAccounts = $10,
      web3Wallets = $11,
      primaryWeb3Wallet = $12
    WHERE id = $13
  `;

  const primaryEmail = getPrimaryEmailAddress(userData);
  const constructedFullName = `${userData.first_name || ""} ${userData.last_name || ""}`.trim() || null;

  const userValues = [
    userData.id,
    userData.first_name || null,
    userData.last_name || null,
    constructedFullName,
    userData.password_enabled || false,
    primaryEmail || null,
    userData.email_addresses?.map(emailAddress => ({
      id: emailAddress.id,
      emaillAddress: emailAddress.email_address
    })),
    userData.email_addresses?.filter(emailAddress => ({
      verified: emailAddress.verification?.status === "verified"
    }
  )) || [],
    new Date(userData.updated_at),
    userData.external_accounts?.map(account => ({
      id: account.id,
      provider: account.provider, // Assuming 'provider' field exists or map accordingly
      providerUserId: account.provider_user_id,
      emailAddress: account.email_address,
      firstName: account.first_name,
      lastName: account.last_name,
      imageUrl: account.image_url
    })) || [],
    userData.external_accounts?.filter(
      account => account.verification?.status === "verified"
    ).map(
      account => ({ id: account.id, provider: account.provider, emailAddress: account.email_address })
    ) || [],
    userData.web3_wallets?.map(wallet =>
      ({ id: wallet.id, web3Wallet: wallet.web3_wallet, verified: wallet.verification?.status === "verified" })
    ) || [],
    userData.primary_web3_wallet_id && userData.web3_wallets ? userData.web3_wallets.find(
      wallet => wallet.id === userData.primary_web3_wallet_id
    ) : null
  ];

  try {
    await dbClient.query(updatedUserQuery, userValues);
    console.log(`User ${userData.first_name}, ${userData.id} updated in database`);
  } catch (error) {
    console.error(`Error updating user in database: ${error}`);

    // Re-throw to the be caught by main handler
    throw error;
  }
}

async function handleUserDeleted(dbClient: PoolClient, deletedUserData: DeletedObjectJSON) {
  if (!deletedUserData.id) {
    console.warn("User deleted event received without user ID. Skipping deletion.");
    return;
  }

  const deleteUserQuery = "DELETE FROM users WHERE id = $1";

  try {
    await dbClient.query(deleteUserQuery, [deletedUserData.id]);
    console.log(`User with ID ${deletedUserData.id} deleted from database`);
  } catch (error) {
    console.error(`Error deleting user from database: ${error}`);

    // Re-throw to be caught by the main handler
    throw error;
  }
}