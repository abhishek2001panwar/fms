import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['res.cloudinary.com' , "via.placeholder.com"], // Add 'localhost' to the allowed domains
  },
};

export default nextConfig;
