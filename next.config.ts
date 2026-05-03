import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname),
  /**
   * Keep dev/build artifacts separate to avoid webpack chunk cache corruption
   * when `next dev` and `next build` run around the same time.
   */
  distDir: isDev ? ".next-dev" : ".next",
};

export default nextConfig;
