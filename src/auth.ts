import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { PrismaClient } from "@prisma/client";
import prisma from "./app/lib/db";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import Nodemailer from "next-auth/providers/nodemailer";
import { createTransport } from "nodemailer";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

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
        password: { label: "Password", type: "password", value: "Enter your password" }
      },
      async authorize(credentials) {
        const creds = credentials as { email: string; password: string };
        if (!credentials.email || !credentials.password) {
          return null;
        }

        const user = await prisma.users.findUnique({
          where: { email: credentials.email as string }
        });
        if (!user || !user.hashedPassword) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.hashedPassword
        );

        return isValid ? user : null;
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
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";

        if (token) {
          session.user.id = token.id as string;
        }
      }

      return session;
    }
  }
});