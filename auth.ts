import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./app/lib/prisma";
import github from "next-auth/providers/github";
import google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { randomUUID } from "crypto";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60
  },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/login"
  },
  callbacks: {
    authorized: ({ auth, request: { nextUrl } }): boolean | Response => {
      const isLoggedIn = !!auth?.user;
      const paths = ["/"];
      const isProtected = paths.some((path) => {
        nextUrl.pathname.startsWith(path);
      });

      if (isProtected && !isLoggedIn) {
        const redirectUrl = new URL("/api/auth/login", nextUrl.origin);
        redirectUrl.searchParams.append("callbackUrl", nextUrl.href);
        return Response.redirect(redirectUrl);
      }
      return true;
    },
    session: (params) => {
      if (!params.session.user) {
        return params.session;
      }
      return {
        ...params.session,
        user: {
          ...params.session.user
        }
      }
    },
    async jwt({ account, user, token }) {
      if (account?.provider === "credentials") {
        const sessionToken = randomUUID();
        const expires = new Date(Date.now() + 30 * 24 * 60 * 60);

        if (user?.id) {
          const session = await PrismaAdapter(prisma).createSession!({
            userId: user.id,
            sessionToken,
            expires
          });
          token.sessionId = session.sessionToken;
        }
      }
      return token;
    }
  },
  providers: [
    github,
    google,
    Credentials({
      name: "Sign In",
      id: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com"
        },
        password: { label: "password", type: "password" }
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const parsedCredentials = z
          .object({ email: z.string().email(),
            password: z.string()
            .min(6, { message: "Must be 6 or more characters long" })
            .regex(new RegExp(".*[A-Z].*"),
            { message: "Must conatain one uppercase character" })
            .regex(new RegExp(".*\\d.*"), { message: "Must contains one number" })
            .regex(new RegExp(".*[`~<>?,./!@#$%^&*()\\-_+=\"'|{}\\[\\];:\\\\].*"),
            {  message: "Must contain one special character"}  ) })
            .safeParse(credentials)
        ;

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          const user = await prisma.user.findUnique({
            where: {
              email
            }
          });

          const salt1 = process.env?.SALT1;
          const salt2 = process.env?.SALT2;

          if (salt1 && salt2) {
            const passwordHash = await bcrypt.hash(password, salt1);
            let passwordHash2 = "";
            if (user?.password) {
              const passwordsMatch = await bcrypt.compare(passwordHash, passwordHash2);
              if (!user || !passwordsMatch) {
                return null;
              } else if (passwordsMatch) {
                return { ...user, randomKey: "some key" };
              }
            }
          }
        }

        console.log("Invalid credentials");
        return null;
      }
    })
  ]
});