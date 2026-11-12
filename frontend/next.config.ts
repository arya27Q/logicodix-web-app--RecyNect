import type { NextConfig } from "next";

const backendUrl =
  process.env.BACKEND_URL ||
  "https://royalblue-echidna-840805.hostingersite.com";

const nextConfig: NextConfig = {
  experimental: {
    agentFeedback: true,
  },

  cacheComponents: true,
  partialPrefetching: true,

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl.replace(/\/$/, "")}/api/:path*`,
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/recycler",
        destination: "/pengelola",
        permanent: true,
      },
      {
        source: "/recycler/:path*",
        destination: "/pengelola/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;