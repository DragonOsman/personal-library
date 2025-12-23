import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { GetServerSidePropsContext } from "next";

const { auth } = NextAuth(authConfig);

export function proxy(req: GetServerSidePropsContext) {
  return auth(req);
}