// next.config.ts

import withPWA from 'next-pwa';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  pwa: {
    dest: 'public',
    disable: process.env.NODE_ENV === 'development', // Desactivar en modo dev
  },
};

export default withPWA(nextConfig);
