import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
  async redirects() {
    return [
      {
        source: '/recycler',
        destination: '/pengelola',
        permanent: true,
      },
      {
        source: '/recycler/:path*',
        destination: '/pengelola/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
