/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  reactStrictMode: false,
  images: {
    domains: ["files.edgestore.dev"],
  },
}

module.exports = nextConfig
