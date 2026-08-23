import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { ExpirationPlugin, NetworkFirst, Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: WorkerGlobalScope;

const apiCache = new NetworkFirst({
  cacheName: "alipacno-public-api",
  networkTimeoutSeconds: 5,
  plugins: [
    new ExpirationPlugin({
      maxEntries: 100,
      maxAgeSeconds: 24 * 60 * 60,
      purgeOnQuotaError: true,
    }),
  ],
});

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,

  runtimeCaching: [
    {
      matcher: ({ url, request }) => {
        if (request.method !== "GET") {
          return false;
        }

        if (url.origin !== "https://api.pacinos.uk") {
          return false;
        }

        return (
          url.pathname === "/api/v1/pages" ||
          url.pathname === "/api/v1/branches" ||
          url.pathname.startsWith("/api/v1/branches/") ||
          url.pathname === "/api/v1/categories" ||
          url.pathname === "/api/v1/subcategories" ||
          url.pathname === "/api/v1/menu-items" ||
          url.pathname.startsWith("/api/v1/menu-items/")
        );
      },
      handler: apiCache,
    },

    ...defaultCache,
  ],

  fallbacks: {
    entries: [
      {
        url: "/~offline",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },
});

serwist.addEventListeners();
