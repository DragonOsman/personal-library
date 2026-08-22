// Copyright (c) 2026 Osman Zakir
// Licensed under the GPL v3

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  basePath: "",
  crossOrigin: "use-credentials",
  turbopack: {
    resolveExtensions: [
      ".tsx",
      ".ts",
      ".js",
      ".jsx",
      ".json",
      ".mdx"
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        port: "",
        pathname: "/api/**"
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
        pathname: "/avatars/**"
      },
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
        pathname: "/embed/avatars/**"
      },
      {
        protocol: "https",
        hostname: "books.google.com",
        pathname: "/books/content/**"
      },
      {
        protocol: "https",
        hostname: "books.googleusercontent.com",
        pathname: "/**"
      }
    ]
  }
};

export default nextConfig;
