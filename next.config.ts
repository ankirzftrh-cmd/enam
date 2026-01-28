import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output for cPanel deployment
  output: 'standalone',

  // Image optimization settings
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io', // UploadThing
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com', // Google user avatars
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org', // Bank logos
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // Placeholder images
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'logammulia.com', // Reference site images
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
