import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
      {
        protocol: "https",
        hostname: "assets.coingecko.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
  },
  // Performance optimizations
  reactStrictMode: true,
  // Optimize production builds (SWC minification is enabled by default in Next.js 16+)
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // Experimental optimizations for better tree-shaking
  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/react-tooltip", "@radix-ui/react-popover"],
  },
};

export default nextConfig;
