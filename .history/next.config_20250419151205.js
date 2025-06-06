/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cdninstagram.com',
        pathname: '/**',
      }
    ],
    unoptimized: true,
  },
}

export default nextConfig; 