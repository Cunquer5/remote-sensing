const nextConfig = {
  images: { 
    unoptimized: true, 
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' }, 
      { protocol: 'https', hostname: 'plus.unsplash.com' },
      { protocol: 'https', hostname: 'tile.openstreetmap.org' },
      { protocol: 'https', hostname: '*.tile.openstreetmap.org' },
      { protocol: 'https', hostname: 'basemaps.cartocdn.com' },
      { protocol: 'https', hostname: '*.basemaps.cartocdn.com' }
    ] 
  },
  watchOptions: { pollIntervalMs: 1000 },
  output: 'standalone',
  devIndicators: false,
  async headers() {
    return [{ source: '/(.*)', headers: [
      { key: 'Content-Security-Policy', value: "frame-ancestors 'self' *; img-src 'self' data: https: blob:;" },
      { key: 'Permissions-Policy', value: 'accelerometer=*, autoplay=*, clipboard-write=*, encrypted-media=*, gyroscope=*, picture-in-picture=*, fullscreen=*' },
      { key: 'Access-Control-Allow-Origin', value: '*' },
    ]}]
  },
}
module.exports = nextConfig
