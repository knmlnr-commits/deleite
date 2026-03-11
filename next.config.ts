import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  images: {
    dangerouslyAllowSVG: false,
    remotePatterns: [],
    unoptimized: true,
  },
};

export default nextConfig;
