import type { NextAuthConfig } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

export default {
  providers: [GitHubProvider, GoogleProvider],
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify",
    error: "/auth/error"
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.AUTH_SECRET
} satisfies NextAuthConfig;