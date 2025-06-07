import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  basePath: "",
  crossOrigin: "use-credentials",
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
};

export default nextConfig;
