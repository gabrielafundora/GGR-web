// `||` (no `??`) a propósito, mismo motivo que en src/app/layout.tsx: si
// NEXT_PUBLIC_SITE_URL queda configurada como cadena vacía en vez de
// ausente, `??` no lo detecta y se rompería la resolución de URLs
// absolutas (metadata, JSON-LD, etc.).
export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}
