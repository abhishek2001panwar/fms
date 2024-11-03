import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['res.cloudinary.com'], // Add 'localhost' to the allowed domains
  },
};

export default nextConfig;
