"use server";

import prisma from "../lib/db";
import bcrypt from "bcryptjs";

export const signUpUser = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;

  if (!email || !password || !fullName) {
    throw new Error("Missing required fields");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      id: crypto.randomUUID(),
      email,
      name: fullName,
      password: {
        create: {
          hash: hashedPassword
        }
      }
    }
  });

  return { success: true, message: "User registered successfully", user };
};