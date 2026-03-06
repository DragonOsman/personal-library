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
    domains: ["ui-avatars.com", "lh3.googleusercontent.com"]
  }
};

export default nextConfig;
