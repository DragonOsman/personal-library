import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const DELETE = async () => {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({
      status: 401,
      body: { error: "Unauthorized" }
    });
  }

  try {
    const client = await clerkClient();
    await client.users.deleteUser(user.id);
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      error: `Error deleting user: ${error}`
    });
  }
};