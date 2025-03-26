import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ['@dat-platform/k2-advertising'],
  experimental: {
    externalDir: true, // Allows loading packages outside project root
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
