import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DragonOsman Personal Library",
  description: "Personal library app: manage a list of books you've read and/or have",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-us">
      <body
      >
        {children}
      </body>
    </html>
  );
}