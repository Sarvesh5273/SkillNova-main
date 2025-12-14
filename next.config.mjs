/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // <--- CHANGE THIS to false
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: false,
  },
}

export default nextConfig