import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Evita anunciar "X-Powered-By: Next.js" (info de la pila, sin
  // beneficio para el sitio).
  poweredByHeader: false,
  experimental: {
    serverActions: {
      // Las portadas/imágenes suben hasta 5MB (ver src/actions/upload.ts);
      // el default de Next (1MB) se queda corto para eso.
      bodySizeLimit: "6mb",
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Fuerza HTTPS en el navegador (incluye subdominios) una vez
          // que el sitio ya sirve siempre por HTTPS en producción (Vercel).
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          // Evita que el navegador intente adivinar el tipo de un
          // archivo distinto al Content-Type real (mitiga XSS vía
          // archivos subidos que se interpreten como otra cosa).
          { key: "X-Content-Type-Options", value: "nosniff" },
          // No es un sitio pensado para embeberse en un <iframe> de
          // otro sitio (mitiga clickjacking).
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Ninguna página de este sitio usa cámara/micrófono/ubicación.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
