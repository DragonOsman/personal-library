"use server";

import { registrationSchema } from "@/app/lib/definitions";
import { signIn, signOut } from "@/auth";
import bcrypt from "bcryptjs";
import prisma from "@/app/lib/prisma";
import { AuthError } from "next-auth";
import { auth } from "@/auth";
import { randomUUID, randomBytes } from "crypto";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { EmailNotVerifiedError } from "@/errors";
import nodemailer from "nodemailer";

const isUserEmailVerified = async (email: string) => {
  const user = await prisma.user.findFirst({
    where: { email }
  });

  // if the user doesn't exist then it's none of the function's business
  if (!user) {
    return true;
  }

  if (!user?.emailVerified) {
    throw new EmailNotVerifiedError(`EMAIL_NOT_VERIFIED:${email}`);
  }

  return true;
};

export const verifyEmail = async (email: string) => {
  return await prisma.user.update({
    where: {
      email
    },
    data: {
      emailVerified: new Date(),
      emailVerificationToken: undefined
    }
  });
};

export const authenticate = async (prevState: string | undefined, formData: FormData) => {
  try {
    await isUserEmailVerified(formData.get("email") as string);
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials";
        default:
          return "Something went wrong";
      }
    }

    if (error instanceof EmailNotVerifiedError) {
      return error?.message;
    }

    throw error;
  }
};

const sendVerificationEmail = async (email: string, token: string) => {
  const transporter: nodemailer.Transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT) || 0,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD
    }
  });

  const emailData = {
    from: "DragonOsman Personal Library <verification@test.com>",
    to: email,
    subject: "Email Verification",
    html: `
      <p>Click the link below to verify your email:</p>
      <a href="http://localhost:3000/email/verify?email=${email}&token=${token}">Verify Email</a>
    `
  };

  try {
    await transporter.sendMail(emailData);
  } catch (error) {
    console.log(`Failed to send email: ${error}`);
    throw error;
  }
};

const generateEmailVerificationToken = () => randomBytes(32).toString("hex");

export const resendVerificationEmail = async (email: string) => {
  const emailVerificationToken = generateEmailVerificationToken();
  try {
    await prisma.user.update({
      where: { email },
      data: { emailVerificationToken }
    });

    await sendVerificationEmail(email, emailVerificationToken);
  } catch (error) {
    return `Something went wrong: ${error}`;
  }

  return "Verification email sent";
};

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

  console.log(typeof prisma.user);

  let existingUser = null;

  if (prisma.user) {
    existingUser = await prisma.user.findUnique({
      where: {
        email: String(email)
      }
    });
  }

  if (existingUser) {
    throw new Error("User with this email address already exists!");
  }

  const emailVerificationToken = generateEmailVerificationToken();
  const hashedPassword = await bcrypt.hash(password, 32);
  let user;
  try {
    user = await prisma.user.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: hashedPassword,
        emailVerificationToken
      }
    });
    const session = await auth();

    if (session && session.user && session.user.id) {
      session.user = user;
      await prisma.session.create({
        data: {
          userId: user.id,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          sessionToken: randomUUID()
        }
      });
    }

    const cookieStore = await cookies();
    cookieStore.set("session", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      sameSite: "strict",
      path: "/"
    });
  } catch (error) {
    console.error(error);
    NextResponse.json({
      status: 500,
      message: "Something went wrong"
    });
  }

  await sendVerificationEmail(email, emailVerificationToken);
  redirect(`/email/verify/send?email=${email}&verification_sent=1`);
};

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findFirst({
    where: {
      email
    }
  });
};

export const logoutAction = async () => await signOut();
