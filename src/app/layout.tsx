import { ReactNode, FC } from "react";
import Head from "next/head";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "./components/Header";
import BookContextProvider from "./context/BookContext";
import "./globals.css";
import logo from "../../public/images/logo.png";

const RootLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ClerkProvider appearance={{
      layout: {
        logoImageUrl: `${logo.src}`,
        logoLinkUrl: "/"
      },
      variables: {
        colorPrimary: "#287098",
        colorBackground: "#1b1b1d", // 3 units darker version of website secondary color #37383cp
        colorText: "#fff"
      }
    }}>
      <BookContextProvider>
        <html lang="en-us">
          <Head>
            <title>DragonOsman Personal Library App</title>
            <meta name="description" content="Next.js app implementing an app for users to keep a list of books they own or have read." />
            <meta charSet="utf-8" />
            <meta name="keywords" content="Next.js, TypeScript, Library, Authentication, User Auth, Auth, MySQL" />
            <link rel="icon" href="../../../favicon.ico" />
          </Head>
          <body className="antialiased bg-gradient-to-b from-background-500 to-background-700">
            <Header />
            <>
              <main>{children}</main>
            </>
          </body>
        </html>
      </BookContextProvider>
    </ClerkProvider>
  );
};

export default RootLayout;