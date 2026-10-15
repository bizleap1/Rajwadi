import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  webpack: (config, { dev }) => {
    if (dev) {
      // Keep dev cache in memory to prevent OneDrive locking/colliding with .pack.gz and temp manifest files
      config.cache = false;
    }
    return config;
  },
  images: {
    unoptimized: true,
  },
  devIndicators: false,
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
