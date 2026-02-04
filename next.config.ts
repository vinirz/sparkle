import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xzetxljclpvdnxweeksy.supabase.co',
      },
    ],
  },
};

export default nextConfig;
