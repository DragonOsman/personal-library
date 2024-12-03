import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { authConfig } from "@/auth.config";
import { z } from "zod";
import type { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { findUserByEmail } from "@/app/actions/auth-actions";

const getUser = async (email: string) => {
  try {
    return await findUserByEmail(email);
  } catch (error) {
    console.error(`Failed to fetch user: ${error}`);
    throw new Error("Failed to fetch user");
  }
};

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [Credentials({
    authorize: async (credentials) => {
      const parsedCredentials = z
        .object({ email: z.string().email(), password: z.string().min(6) })
        .safeParse(credentials)
      ;

      if (parsedCredentials.success) {
        const { email, password } = parsedCredentials.data;
        const user = await getUser(email);

        if (!user) {
          return null;
        }
        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (passwordsMatch) {
          return user;
        }
      }
      console.log('Invalid credentials');
      return null;
    }
  }), Google, GitHub]
});