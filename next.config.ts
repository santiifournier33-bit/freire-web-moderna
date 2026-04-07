/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'images.leadconnectorhq.com',
      },
      {
        protocol: 'https',
        hostname: '*.tokkobroker.com',
      },
      {
        protocol: 'http',
        hostname: '*.tokkobroker.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'www.iconsdb.com',
      }
    ],
  },
  // Permitimos el acceso desde dispositivos en tu red local (como tu celular)
  allowedDevOrigins: ['192.168.0.11'],
  async redirects() {
    return [
      {
        source: '/propiedades/:id',
        destination: '/p/:id-prop',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
