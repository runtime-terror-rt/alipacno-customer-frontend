import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",

  additionalPrecacheEntries: [
    {
      url: "/~offline",
      revision: "1",
    },
  ],
});

const nextConfig: NextConfig = {
  output: "standalone",

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.pacinos.uk",
      },
      {
        protocol: "http",
        hostname: "api.pacinos.uk",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
      {
        protocol: "http",
        hostname: "example.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default withSerwist(nextConfig);