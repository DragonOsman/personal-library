import NextAuth, { NextAuthConfig } from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./app/lib/db";
import CredentialsProvider from "next-auth/providers/credentials";
import Nodemailer from "next-auth/providers/nodemailer";
import { createTransport } from "nodemailer";
import { verifyPassword } from "./app/lib/auth-utils";
import { authenticator } from "otplib";
import { randomBytes } from "crypto";

const emailServerHost = process.env.EMAIL_SERVER_HOST || "";
const emailServerPort = process.env.EMAIL_SERVER_PORT
  ? parseInt(process.env.EMAIL_SERVER_PORT)
  : 0;
const emailServerUser = process.env.EMAIL_SERVER_USER || "";
const emailServerPassword = process.env.EMAIL_SERVER_PASSWORD || "";
const emailFrom = process.env.EMAIL_FROM || "";

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const findUserMatchingEmail = async (email: string) => {
  const normalizedEmail = normalizeEmail(email);

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    include: { emails: true, accounts: true }
  });

  return user ?? null;
};

export const authOptions: NextAuthConfig = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter: PrismaAdapter(prisma as any),
  ...authConfig,
  providers: [
    ...authConfig.providers,
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
      try {
        if (!account?.provider) {
          return true;
        }
        const providedEmail = normalizeEmail(user.email);
        const existingUser = await findUserMatchingEmail(providedEmail);
        if (!existingUser) {
          if (account.provider === "credentials") {
            return "/auth/signup";
          }

          return true;
        }

        const providerAlreadyLinked = existingUser.accounts?.some(acc => acc.provider === account.provider);
        console.log("DEBUG: Existing User found?", !!existingUser, existingUser);
        if (providerAlreadyLinked) {
          return true;
        }

        if (!existingUser.autoMergeAuth) {
          const token = randomBytes(32).toString("hex");
          await prisma.pendingAccountLink.create({
            data: {
              email: providedEmail,
              provider: account.provider,
              providerId: account.providerAccountId,
              token,
              profileJson: JSON.stringify(profile)
            }
          });
          return `/auth/confirm-link?token=${token}`;
        }
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return "/auth/error?error=CallbackError";
      }
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
};

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);