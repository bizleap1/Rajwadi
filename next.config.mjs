import fs from "fs";
import path from "path";

/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === "development";

const nextConfig = {
  // Isolate development cache from production build to eliminate file conflicts and ENOENT manifest errors
  distDir: isDev ? ".next-dev" : ".next",

  webpack: (config, { dev }) => {
    if (dev) {
      // Ensure development directory exists to prevent ENOENT on Windows/OneDrive
      const devDir = path.join(process.cwd(), ".next-dev", "static", "development");
      if (!fs.existsSync(devDir)) {
        try {
          fs.mkdirSync(devDir, { recursive: true });
        } catch (e) {}
      }

      // Keep dev cache in memory to prevent OneDrive locking/colliding with temp manifest files
      config.cache = {
        type: "memory",
      };
    }
    return config;
  },
  images: {
    unoptimized: true,
  },

  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
