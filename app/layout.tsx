import { Metadata } from "next";
import { ReactNode, FC } from "react";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from "@clerk/nextjs";
import Header from "./components/Header";
import "./globals.css";

export const metadada: Metadata = {
  title: "DragonOsman Personal Library App",
  description: "Next.js app implementing an app for users to keep a list of books they own or have read.",
  keywords: "Next.js, TypeScript, Library, Authentication, User Auth, Auth, MySQL"
};

const links = [
  { name: "Home", url: "/" },
  { name: "Dashboard", url: "/dashboard" },
  { name: "Login", url: "/api/auth/login" },
  { name: "Logout", url: "/api/auth/logout" },
  { name: "Register", url: "/api/auth/register" }
];

const RootLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ClerkProvider>
      <html lang="en">
      <body>
        <Header links={links} />
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
        {children}
      </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;