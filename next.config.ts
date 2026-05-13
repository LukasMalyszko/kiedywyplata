import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable aggressive optimizations
  experimental: {
    optimizePackageImports: ['react', 'react-dom'],
  },
  
  // Remove console.log in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Enable compression and remove headers
  compress: true,
  poweredByHeader: false,
  
  // Turbopack configuration (empty to silence warnings)
  turbopack: {},

  // SEO keyword aliases that point to the canonical housing-benefit page
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'kiedywyplata.pl',
          },
        ],
        destination: 'https://www.kiedywyplata.pl/:path*',
        permanent: true,
      },
      {
        source: '/kiedy-wyplata-mieszkaniowki-w-policji',
        destination: '/benefit/dodatek-mieszkaniowy',
        permanent: true,
      },
      {
        source: '/dodatek-mieszkaniowy-policja-kiedy-wyplata-2026',
        destination: '/benefit/dodatek-mieszkaniowy',
        permanent: true,
      },
      {
        source: '/benefit/kiedy-wyplata-mieszkaniowki-w-policji',
        destination: '/benefit/dodatek-mieszkaniowy',
        permanent: true,
      },
      {
        source: '/benefit/dodatek-mieszkaniowy-policja-kiedy-wyplata-2026',
        destination: '/benefit/dodatek-mieszkaniowy',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
