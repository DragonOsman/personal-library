import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { PrismaClient } from "@prisma/client";
import prisma from "./app/lib/db";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import Nodemailer from "next-auth/providers/nodemailer";
import { createTransport } from "nodemailer";
import { verifyOtp, verifyPassword } from "./app/lib/auth-utils";
import { IBook } from "./app/context/BookContext";

const githubClientId = process.env.GITHUB_CLIENT_ID || "";
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET || "";
const googleClientId = process.env.GOOGLE_CLIENT_ID || "";
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
const emailServerHost = process.env.EMAIL_SERVER_HOST || "";
const emailServerPort = process.env.EMAIL_SERVER_PORT
  ? parseInt(process.env.EMAIL_SERVER_PORT)
  : 0
;
const emailServerUser = process.env.EMAIL_SERVER_USER || "";
const emailServerPassword = process.env.EMAIL_SERVER_PASSWORD || "";
const emailFrom = process.env.EMAIL_FROM || "";

export type BookFromQuery = {
    id: string;
    title: string;
    author: string;
    isbn: string | null;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}

export const mapPrismaBookToIBook = (book: BookFromQuery): IBook => {
  return {
    id: book.id,
    title: book.title,
    authors: book.author ? [book.author] : [],
    isbn: book.isbn ? book.isbn : "",
    publishedDate: (new Date()).toString(),
    description: undefined,
    pageCount: undefined,
    categories: undefined,
    averageRating: undefined,
    ratingsCount: undefined,
    imageLinks: undefined,
    language: "English"
  };
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma as unknown as PrismaClient),
  session: {
    strategy: "jwt"
  },
  secret: process.env.AUTH_SECRET,
  providers: [
    GitHubProvider({
      clientId: githubClientId,
      clientSecret: githubClientSecret
    }),
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", value: "Enter your email" },
        password: { label: "Password", type: "password", value: "Enter your password" },
        otp: { label: "OTP", type: "text", value: "Enter your OTP (if applicable)" }
      },
      async authorize(credentials) {
        if (!credentials.email || !credentials.password) {
          return null;
        }

        const email = credentials.email as string;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          throw new Error("No user found with the given email");
        }

        if (credentials.password) {
          const isPasswordValid = await verifyPassword(email, credentials.password as string);
          if (!isPasswordValid) {
            return null;
          }
        }

        if (credentials.otp) {
          const isOtpValid = await verifyOtp(email, credentials.otp as string);
          if (!isOtpValid) {
            return null;
          }
        }
        return {
          id: user.id, email: user.email, name: user.name
        };
      }
    }),
    Nodemailer({
      server: {
        service: "gmail",
        host: emailServerHost,
        port: emailServerPort,
        auth: {
          user: emailServerUser,
          pass: emailServerPassword
        }
      },
      from: emailFrom,
      maxAge: 10 * 60, // Magic link valid for 10 minutes
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        const { host } = new URL(url);
        const transport = createTransport(provider.server);
        await transport.sendMail({
          to: identifier,
          from: provider.from,
          subject: `Sign in to ${host}`,
          text: `Sign in to ${host}\n${url}\n\n`,
          html: `<p>Sign in to <strong>${host}</strong></p><p><a href="${url}">Click here to sign in</a></p>`
        });
      }
    })
  ],
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify",
    error: "/auth/error"
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        token.lastLoginAt = Date.now();
        token.mfaEnabled = user.mfaEnabled ?? false;
      }

      if (trigger === "signIn") {
        token.lastLoginAt = Date.now();
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string | undefined;
        session.user.image = token.image as string | null | undefined;
        session.user.email = token.email as string;
        session.user.mfaEnabled = token.mfaEnabled as boolean | undefined;
        session.user.lastLoginAt = token.lastLoginAt as number | undefined;
      }

      return session;
    }
  }
});