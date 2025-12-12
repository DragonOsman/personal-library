import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./app/lib/db";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import Nodemailer from "next-auth/providers/nodemailer";
import { createTransport } from "nodemailer";
import { verifyPassword } from "./app/lib/auth-utils";
import { IBook } from "./app/context/BookContext";
import { authenticator } from "otplib";
import { randomBytes } from "crypto";

const githubClientId = process.env.GITHUB_CLIENT_ID || "";
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET || "";
const googleClientId = process.env.GOOGLE_CLIENT_ID || "";
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
const emailServerHost = process.env.EMAIL_SERVER_HOST || "";
const emailServerPort = process.env.EMAIL_SERVER_PORT
  ? parseInt(process.env.EMAIL_SERVER_PORT)
  : 0;
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
};

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const findUserMatchingEmail = async (email: string) => {
  const normalizedEmail = normalizeEmail(email);

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    include: { emails: true }
  });

  return user ?? null;
};

export const mapPrismaBookToIBook = (book: BookFromQuery): IBook => {
  return {
    id: book.id,
    title: book.title,
    authors: book.author ? [book.author] : [],
    isbn: book.isbn ? book.isbn : "",
    publishedDate: new Date().toString(),
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter: PrismaAdapter(prisma as any),
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
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        otp: { label: "OTP (if required)", type: "text", optional: true }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Missing email or password");
        }

        const email = normalizeEmail(credentials.email as string);
        const password = credentials.password as string;
        const otp = credentials.otp as string | undefined;
        const user = await findUserMatchingEmail(email);

        if (!user) {
          throw new Error("No user found with the given email");
        }

        if (password) {
          const isPasswordValid = await verifyPassword(
            email,
            password
          );
          if (!isPasswordValid) {
            throw new Error("Invalid email or password");
          }
        }

        if (user.mfaEnabled) {
          if (otp) {
            if (!otp) {
              throw new Error("MFA code required");
            }
            const isOtpValid = authenticator.check(otp, user.mfaSecret!);
            if (!isOtpValid) {
              throw new Error("Invalid MFA code");
            }
          }
        }

        return {
          id: user.id,
          email: user.email!,
          emailVerified: user.emailVerified,
          name: user.name,
          image: user.image,
          mfaEnabled: user.mfaEnabled ?? null,
          mfaSecret: user.mfaSecret ?? null,
          autoMergeAuth: user.autoMergeAuth ?? null
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
      maxAge: 10 * 60,
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
    async signIn({ user, account, profile }) {
      if (!account?.provider) {
        return true;
      }

      const providerEmail = normalizeEmail(user.email || "");
      if (!providerEmail) {
        return false;
      }

      const existingUser = await findUserMatchingEmail(providerEmail);
      if (existingUser) {
        const emailExists = existingUser.emails?.some(eAddr => normalizeEmail(eAddr.email) === providerEmail);
        if (emailExists && existingUser.autoMergeAuth) {
          return true;
        }

        const token = randomBytes(32).toString("hex");
        await prisma.pendingAccountLink.create({
          data: {
            email: providerEmail,
            provider: account.provider,
            providerId: account.providerAccountId,
            token,
            profileJson: JSON.stringify(profile)
          }
        });

        return `/auth/confirm-link?token=${token}`;
      }

      const newUser = await prisma.user.create({
        data: {
          email: providerEmail,
          name: user.name || profile?.name || null,
          image: user.image || profile?.picture || null
        }
      });

      user.id = newUser.id;
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        token.lastLoginAt = Date.now();

        const otherUserObj = await prisma.user.findUnique({
          where: { id: user.id },
          select: { mfaEnabled: true }
        });

        token.mfaEnabled = otherUserObj?.mfaEnabled ?? false;
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