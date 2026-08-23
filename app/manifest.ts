import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Alipacno",
    short_name: "Alipacno",
    description: "Alipacno - Your Premium Food Choice",
    start_url: "/",
    display: "standalone",
    background_color: "#1e1e20",
    theme_color: "#f9671a",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
} 