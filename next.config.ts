import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.pacinos.uk',
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
