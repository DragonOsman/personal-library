import { registrationSchema } from "../lib/definitions";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";
import { auth } from "../../auth";
import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import cookies from "next/headers";
import { NextResponse } from "next/server";

export const register = async (formData: FormData) => {
  "use server";

  const validatedFields = registrationSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword")
  });

  if (!validatedFields.success) {
    throw new Error(JSON.stringify(validatedFields.error.flatten().fieldErrors));
  }

  const { firstName, lastName, email, password, confirmPassword } = validatedFields.data;

  if (password !== confirmPassword) {
    throw new Error("Passwords must match");
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email: String(email)
    }
  });

  if (existingUser) {
    throw new Error("User with this email address already exists!");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 32);
    const userData = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword
      }
    });
    const user = userData;
    const session = await auth();

    if (session && session.user && session.user.id) {
      session.user = user;
      await prisma.session.create({
        data: {
          userId: session.user.id,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          sessionToken: randomUUID()
        }
      });
    }


    const cookieStore = await cookies.cookies();
    cookieStore.set("session", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      sameSite: "lax",
      path: "/"
    });
  } catch (error) {
    console.error(error);
    NextResponse.json({
      status: 500,
      message: "Something went wrong"
    });
  }
  redirect("/");
};