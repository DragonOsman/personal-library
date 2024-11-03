import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient;

export const GET = async (req: Request) => {
  try {
    const users = await prisma.users.findMany({
      include: {
        books: true
      }
    });
    return NextResponse.json({
      users
    });
  }
  catch (error: any) {
    return NextResponse.json({
      msg: "Failed to retrieve users",
      error: error.message
    }, { status: 500 });
  }
};