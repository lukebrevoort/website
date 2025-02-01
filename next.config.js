/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    distDir: '.next',
  images: {
    domains: ['fonts.googleapis.com'], // Add any external image domains
  },
  eslint: {
    ignoreDuringBuilds: true, // Only if you want to ignore ESLint during builds
  },
}

module.exports = nextConfig