import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },
  serverActions: true, // Enable Server Actions
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // or whatever size you need
    },
  },

};

export default nextConfig;
