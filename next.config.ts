import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  basePath: "",
  experimental: {
    turbo: {
      resolveExtensions: [
        ".tsx",
        ".ts",
        ".js",
        ".jsx",
        ".json",
        ".mdx"
      ]
    }
  }
};

export default nextConfig;
