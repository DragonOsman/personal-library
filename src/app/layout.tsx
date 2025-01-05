import { Metadata } from "next";
import { ReactNode, FC } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "./components/Header";
import "./globals.css";
import logo from "../../public/images/logo.png";

export const metadada: Metadata = {
  title: "DragonOsman Personal Library App",
  description: "Next.js app implementing an app for users to keep a list of books they own or have read.",
  keywords: "Next.js, TypeScript, Library, Authentication, User Auth, Auth, MySQL"
};

const RootLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ClerkProvider appearance={{
      layout: {
        logoImageUrl: `${logo.src}`,
        logoLinkUrl: "/"
      },
      variables: {
      colorPrimary: "#287098",
      colorBackground: "#37383c"
      }
    }}>
      <html lang="en-us">
        <body>
          <Header />
          <>
            <main>{children}</main>
          </>
      </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;