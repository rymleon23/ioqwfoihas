import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
   devIndicators: false,
   images: {
      remotePatterns: [
         {
            protocol: 'https',
            hostname: 'vercel.com',
            pathname: '/oss/program-badge.svg',
         },
      ],
   },
};

export default nextConfig;
