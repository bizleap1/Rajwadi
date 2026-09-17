/** @type {import('next').NextConfig} */
const nextConfig = {
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
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
