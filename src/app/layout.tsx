import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";

import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Gabriela Guerra Rey",
  description: "Autora de libros, artículos y talleres literarios.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${fraunces.variable} ${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background text-foreground">{children}</body>
    </html>
  );
}
