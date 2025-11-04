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
};

export default nextConfig;
