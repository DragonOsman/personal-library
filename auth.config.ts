import type { NextAuthConfig } from "next-auth";
import github from "next-auth/providers/github";
import google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { NextRequest } from "next/server";
import type { Session } from "next-auth";

export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/api/auth/login",
    signOut: "/api/auth/logout"
  },
  callbacks: {
    authorized: ({ auth, request: { nextUrl } }: { auth: Session | null, request: NextRequest }) => {
      const isLoggedIn = !!auth?.user;
      let isOnDashboard;
      if (auth?.user) {
        isOnDashboard = (nextUrl.pathname === `/books?userId=${auth.user.id}`);
      }

      if (isOnDashboard) {
        if (isLoggedIn) {
          return true;
        }
        return false;
      } else if (isLoggedIn) {
        const isOnAuth = nextUrl.pathname === "/api/auth/login"
          || nextUrl.pathname === "/api/auth/register"
        ;
        if (isOnAuth && auth?.user) {
          return Response.redirect(new URL(`/books?userId=${auth?.user.id}`, nextUrl));
        }
        return true;
      }
      return true;
    }
  },
  providers: [Credentials, google, github]
} satisfies NextAuthConfig;