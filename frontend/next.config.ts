import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
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
