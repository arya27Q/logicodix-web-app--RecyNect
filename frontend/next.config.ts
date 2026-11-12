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
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl.replace(/\/$/, '')}/api/:path*`,
      },
    ];
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
