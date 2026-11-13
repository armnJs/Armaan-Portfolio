import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // @xenova/transformers ships Node-only backends; the browser build must skip them.
  turbopack: {
    resolveAlias: {
      fs: { browser: "./lib/chat/empty.ts" },
      path: { browser: "./lib/chat/empty.ts" },
      url: { browser: "./lib/chat/empty.ts" },
      sharp: { browser: "./lib/chat/empty.ts" },
      "onnxruntime-node": { browser: "./lib/chat/empty.ts" },
    },
  },
  webpack: (config) => {
    config.resolve.alias = { ...config.resolve.alias, sharp$: false, "onnxruntime-node$": false };
    return config;
  },
};

export default nextConfig;
