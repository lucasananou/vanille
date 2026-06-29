import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve modern formats (AVIF/WebP) and cache optimized variants aggressively.
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2678400, // 31 days
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'hoirqrkdgbmvpwutwuwj.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'www.tsniout-shop.fr',
      },
      {
        protocol: 'https',
        hostname: 'tsniout-shop.fr',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
      },
      {
        protocol: 'https',
        hostname: '**.up.railway.app',
      },
    ],
  },
};

export default nextConfig;
