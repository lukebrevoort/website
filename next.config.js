/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    distDir: '.next',
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'zah3ozwhv9cp0qic.public.blob.vercel-storage.com',
          port: '',
        },
      ],
      domains: [
        'fonts.googleapis.com',                          // Google Fonts domain
        'prod-files-secure.s3.us-west-2.amazonaws.com',  // AWS S3 domain
        'vercel-blob.com',                               // Vercel Blob domain
        'public.blob.vercel-storage.com'                 // Alternative Vercel Blob domain
      ],
      // Optional: Set a remote pattern for all AWS S3 domains
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**.amazonaws.com',
          pathname: '/**',
        },
      ],
    },
  eslint: {
    ignoreDuringBuilds: true, // Only if you want to ignore ESLint during builds
  },
}

module.exports = nextConfig