declare module 'next-pwa' {
    import { NextConfig } from 'next';
    import { PWAConfig } from 'next-pwa';
  
    export default function withPWA(config: NextConfig & { pwa?: PWAConfig }): NextConfig;
  }
  