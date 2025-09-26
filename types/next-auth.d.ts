import { DefaultSession } from "next-auth";
import { IBook } from "../app/context/BookContext";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      mfaEnabled?: boolean;
      lastLoginAt?: number;
      hasPassword?: boolean;
      books?: IBook[];
    } & DefaultSession["user"]
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    mfaEnabled?: boolean;
    lastLoginAt?: number;
    hasPassword?: boolean;
    books?: IBook[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    mfaEnabled?: boolean;
    lastLoginAt?: number;
    hasPassword?: boolean;
    books?: IBook[];
  }
}