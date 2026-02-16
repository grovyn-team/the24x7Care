import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    experimental: {
    useLightningcss: false, // ⭐ disables native lightningcss binary
  },
};

export default nextConfig;
