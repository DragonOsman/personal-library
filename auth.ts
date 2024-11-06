import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./app/lib/prisma";
import github from "next-auth/providers/github";
import google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { useSession } from "next-auth/react";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { "strategy": "jwt" },
  adapter: PrismaAdapter(prisma),
  callbacks: {
    session: (params) => {
      return {
        ...params.session,
        user: {
          ...params.session.user,
          id: params.token.id as string,
          randomKey: params.token.randomKey
        }
      };
    },
    jwt: ({ user, token }) => {
      if (user) {
        const u = user as unknown as any;
        return {
          ...token,
          id: u.id,
          randomKey: u.randomKey
        };
      }
      return token;
    },
    authorized: ({ auth, request: { nextUrl } }) => {
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
    }
  },
  providers: [
    github,
    google,
    CredentialsProvider({
      name: "Sign In",
      id: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com"
        },
        password: {
          label: "password",
          type: "password"
        }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const getId = (): string => {
          "use client";

          const session = useSession();

          if (session.status !== "authenticated") {
            throw new Error("Must be logged in and authenticated");
          }

          if (!session.data) {
            throw new Error("Session data must be truthy");
          }

          if (!session.data.user) {
            throw new Error("User must exist");
          }

          if (!session.data.user.id) {
            throw new Error("User id must exist");
          }

          return session.data.user.id;
        };

        const userId = getId();

        const user = await prisma.user.findUnique({
          where: {
            id: userId,
            email: String(credentials.email)
          }
        });

        if (!user || user.password &&
            !(await bcrypt.compare(String(credentials.password), user.password))
        ) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          randomKey: "secret"
        };
      }
    })
  ]
})