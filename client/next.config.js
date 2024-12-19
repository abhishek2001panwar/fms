import 'dotenv/config';

const nextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  images: {
    domains: ['res.cloudinary.com' , "via.placeholder.com"], // Add 'localhost' to the allowed domains
  },
};

export default nextConfig;
