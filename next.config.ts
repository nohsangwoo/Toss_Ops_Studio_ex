import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@electric-sql/pglite", "pglite-prisma-adapter", "@prisma/client"],
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
