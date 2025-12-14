import { ReactNode, FC } from "react";
import Head from "next/head";
import Header from "./components/Header";
import BookContextProvider from "./context/BookContext";
import UserProvider from "./context/UserContext";
import { SessionProvider } from "next-auth/react";
import "./globals.css";

const RootLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <BookContextProvider>
      <html lang="en-us">
        <Head>
          <title>DragonOsman Personal Library App</title>
          <meta name="description" content="Next.js app implementing an app for users to keep a list of books they own or have read." />
          <meta charSet="utf-8" />
          <meta name="keywords" content="Next.js, TypeScript, Library, Authentication, User Auth, Auth, MySQL" />
          <link rel="icon" href="/public/images/favicon.ico" />
        </Head>
        <body
          className="mt-20 text-[17px] flex flex-col min-h-screen text-center items-center justify-center text-[color:var(--color-text)] font-sans"
        >
          <SessionProvider>
            <UserProvider>
              <Header />
              <main className="flex flex-1 w-full items-center justify-center p-4">
                {children}
              </main>
            </UserProvider>
          </SessionProvider>
        </body>
      </html>
    </BookContextProvider>
  );
};

export default RootLayout;