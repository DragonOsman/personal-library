import { createAuthClient } from "better-auth/react";
import { magicLinkClient, twoFactorClient, emailOTPClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  plugins: [
    magicLinkClient(),
    twoFactorClient(),
    emailOTPClient()
  ]
});