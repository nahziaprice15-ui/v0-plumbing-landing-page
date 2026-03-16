/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Enable Next.js built-in image optimization
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig
