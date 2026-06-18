import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.konarkindustry.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '187.127.141.18',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  webpack: (config) => {
    config.externals = [
      ...(config.externals || []),
      { canvas: 'canvas' },
    ]
    return config
  },
}

export default nextConfig
