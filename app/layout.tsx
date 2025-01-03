import { Metadata } from "next";
import { ReactNode, FC } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "./components/Header";
import "./globals.css";

export const metadada: Metadata = {
  title: "DragonOsman Personal Library App",
  description: "Next.js app implementing an app for users to keep a list of books they own or have read.",
  keywords: "Next.js, TypeScript, Library, Authentication, User Auth, Auth, MySQL"
};

const links = [
  { name: "Home", url: "/" },
  { name: "Dashboard", url: "/dashboard" }
];

const RootLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ClerkProvider>
      <html lang="en">
      <body>
        <Header links={links} />
        <>
          <main>{children}</main>
        </>
      </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;