import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Low-RAM Docker builds skip tsc here; types are checked in local/CI builds.
  typescript: {
    ignoreBuildErrors: process.env.SKIP_TYPESCRIPT_CHECK === "1",
  },
  images: {
    // Local uploads + low-RAM droplet: skip optimizer (avoids 400 / DNS failures for remote images)
    unoptimized: true,
    minimumCacheTTL: 60 * 60 * 24,
    localPatterns: [{ pathname: "/uploads/**" }],
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "**.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/uploads/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/image",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
