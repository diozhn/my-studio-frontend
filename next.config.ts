import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "msrutrqlkbconhdsxqlv.supabase.co",
      },
    ],
  },
};

export default nextConfig;