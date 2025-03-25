/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    distDir: '.next',
    images: {
      domains: [
        'fonts.googleapis.com',                           // Google Fonts domain
        'prod-files-secure.s3.us-west-2.amazonaws.com',  // AWS S3 domain
        'vercel-blob.com',                               // Vercel Blob domain
        'public.blob.vercel-storage.com',                // Alternative Vercel Blob domain
        'zah3ozwhv9cp0qic.public.blob.vercel-storage.com' // Your specific blob domain
      ],
      // FIXED: Combined all remote patterns into one array
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'zah3ozwhv9cp0qic.public.blob.vercel-storage.com',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: '**.amazonaws.com',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: '**.vercel-blob.com',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: '**.blob.vercel-storage.com',
          pathname: '/**',
        }
      ],
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
}

module.exports = nextConfig