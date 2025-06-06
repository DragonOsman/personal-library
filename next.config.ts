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

module.exports = {
  crossOrigin: "use-credentials"
};

export default nextConfig;
