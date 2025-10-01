import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

const githubClientId = process.env.GITHUB_CLIENT_ID || "";
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET || "";
const googleClientId = process.env.GOOGLE_CLIENT_ID || "";
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || "";

export const { auth } = NextAuth({
  providers: [
    GitHub({
      clientId: githubClientId,
      clientSecret: githubClientSecret
    }),
    Google({
      clientId: googleClientId,
      clientSecret: googleClientSecret
    })
  ],
  session: {
    strategy: "jwt"
  },
  secret: process.env.AUTH_SECRET
});