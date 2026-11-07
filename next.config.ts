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
  async redirects() {
    return [
      {
        source: "/:lang(en|de|fr|ja|es|pt|ar|hi|gu)/hindu-calendar",
        destination: "/:lang/calendar/hindu-calendar",
        statusCode: 301,
      },
      {
        source: "/:lang(en|de|fr|ja|es|pt|ar|hi|gu)/gujarati-calendar",
        destination: "/:lang/calendar/gujarati-calendar",
        statusCode: 301,
      },
      {
        source: "/hindu-calendar",
        destination: "/en/calendar/hindu-calendar",
        statusCode: 301,
      },
      {
        source: "/gujarati-calendar",
        destination: "/en/calendar/gujarati-calendar",
        statusCode: 301,
      },
    ];
  },
};

export default nextConfig;
