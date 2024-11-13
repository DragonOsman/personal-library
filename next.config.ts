import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.modules.rules.push({
      test: /\.tsx?$/,
      use: {
        loader: "ts-loader",
        options: {
          transpileOnly: true
        }
      }
    });
    return config;
  }
};

export default nextConfig;
