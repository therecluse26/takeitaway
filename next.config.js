const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = {
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 128, 256, 384],
    minimumCacheTTL: 86400,
  },
  experimental: {
    appDir: false,
  },
  ...withBundleAnalyzer({})
}
