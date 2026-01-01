import { ReactNode, FC } from "react";
import { Metadata, Viewport } from "next";
import Header from "./components/Header";
import BookContextProvider from "./context/BookContext";
import UserProvider from "./context/UserContext";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://personal-library-wmjc.vercel.app"),
  title: "DragonOsman Personal Library App",
  description: "Next.js app implementing an app for users to keep a list of books they own or have read.",
  keywords: [
    "Next.js",
    "TypeScript",
    "Library",
    "Personal Library",
    "Authentication",
    "User Auth",
    "Auth",
    "Auth.js",
    "PostgreSQL",
    "Books"
  ],
  icons: {
    icon: "/images/favicon.ico"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0
};

const RootLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <html lang="en-us">
      <body
        className="mt-20 text-[17px] min-h-screen text-center text-[color:var(--color-text)] font-sans"
      >
        <BookContextProvider>
          <UserProvider>
            <Header />
            <main className="flex flex-1 items-center justify-center p-4 bg-white mx-10">
              <div className="w-full max-w-3xl">
                {children}
              </div>
            </main>
          </UserProvider>
        </BookContextProvider>
      </body>
    </html>
  );
};

export default RootLayout;