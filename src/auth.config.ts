import type { NextAuthConfig } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

const githubClientId = process.env.AUTH_GITHUB_ID || "";
const githubClientSecret = process.env.AUTH_GITHUB_SECRET || "";
const googleClientId = process.env.AUTH_GOOGLE_ID || "";
const googleClientSecret = process.env.AUTH_GOOGLE_SECRET || "";

export default {
  providers: [
    GitHubProvider({
      clientId: githubClientId,
      clientSecret: githubClientSecret
    }),
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret
    })
  ],
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