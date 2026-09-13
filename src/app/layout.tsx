import type { Metadata } from "next";
import { EB_Garamond, Inter } from "next/font/google";
import Script from "next/script";

import "./globals.css";

const ebGaramond = EB_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

// Fallback estático: cada página de sección pública (home, catálogo,
// artículos, cursos, sobre-mi) exporta su propio `generateMetadata`
// leyendo PageMeta (ver src/lib/metadata.ts), que Next.js usa en vez de
// este valor. El Header/Footer públicos viven en app/(public)/layout.tsx,
// no aquí, para que /admin/** no los herede.
// `|| ` (no `??`) a propósito: si NEXT_PUBLIC_SITE_URL queda configurada
// como cadena vacía en vez de ausente (fácil de hacer sin querer en el
// panel de Vercel), `??` no lo detecta y `new URL("")` tira un error que
// rompe el build entero.
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Gabriela Guerra Rey",
  description: "Autora de libros, artículos y talleres literarios.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${ebGaramond.variable} ${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        {children}
        {/* strategy="beforeInteractive": Next.js lo inyecta siempre dentro
            del <head> del HTML servido (no en el body), que es donde Ahrefs
            necesita encontrarlo para verificar el sitio. */}
        <Script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="KT7n5LkCXqQNirESOtSQrw"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
