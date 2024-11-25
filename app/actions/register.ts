"use server";

import { registrationSchema } from "../lib/definitions";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";
import { auth } from "../../auth";
import { randomUUID, randomBytes } from "crypto";
import { redirect } from "next/navigation";
import cookies from "next/headers";
import { NextResponse } from "next/server";
import { sendEmail } from "./email-actions";
import { verificationTemplate } from "@/emails/verification-template";
import { createElement } from "react";

export const registerAction = async (formData: FormData) => {
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
    let emailVerificationToken = "";
    const hashedPassword = await bcrypt.hash(password, 32);
    const userData = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        emailVerificationToken
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

      emailVerificationToken = randomBytes(32).toString("hex");
      await prisma.user.update({
        where: {
          id: user.id
        },
        data: {
          emailVerificationToken
        }
      });

      await sendEmail({
        to: ["Your email address", user.email],
        subject: "Verify your email address",
        react: createElement(verificationTemplate, { username: email, emailVerificationToken })
      });
      redirect("/api/auth/verify-email");
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