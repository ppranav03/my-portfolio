import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // next/image only loads outside images from servers listed here.
  // i.scdn.co is where Spotify hosts album covers (used by NowPlaying).
  images: {
    remotePatterns: [{ protocol: "https", hostname: "i.scdn.co" }],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
