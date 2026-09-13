import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Las portadas/imágenes suben hasta 5MB (ver src/actions/upload.ts);
      // el default de Next (1MB) se queda corto para eso.
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
