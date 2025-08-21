import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // สำหรับ static export
  images: {
    unoptimized: true, // จำเป็นสำหรับ static export
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pokemon-tcg-pocket.s3.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pockettrade.app',
        port: '',
        pathname: '/images/webp/**',
      },
    ],
  },
};

export default nextConfig;
