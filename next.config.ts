import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx"],

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "media.giphy.com",
      },
      {
        protocol: "https",
        hostname: "example.com",
      },
      {
        protocol: "https",
        hostname: "*.replicate.com",
      },
      {
        protocol: "https",
        hostname: "*.vercel.app",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, proxy-revalidate",
          },
        ],
      },
    ];
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_APP_NAME: "AI Video Studio",
    NEXT_PUBLIC_APP_URL: process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000",
  },

  // Performance optimizations
  compress: true,
  poweredByHeader: false,

  // Redirects for old routes
  async redirects() {
    return [];
  },

  // Rewrites for API routes
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [],
    };
  },

  // Enable optimization for production
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["@/components", "@/lib"],
  },
};

export default nextConfig;

