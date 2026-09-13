import type { Metadata } from "next";

import { prisma } from "@/lib/prisma";

export type PageKey = "home" | "catalogo" | "articulos" | "cursos" | "sobre-mi";

const DEFAULT_OG_IMAGE = "/images/og-default.svg";

/**
 * Arma el `Metadata` de una sección leyendo su fila editable de `PageMeta`
 * (administrable en /admin/metadatos), con fallback a valores por defecto
 * cuando aún no se ha personalizado. `SiteSettings.siteName` se usa como
 * sufijo del <title> en todas las páginas.
 */
export async function buildMetadata(
  page: PageKey,
  fallback: { title: string; description: string }
): Promise<Metadata> {
  const [meta, settings] = await Promise.all([
    prisma.pageMeta.findUnique({ where: { page } }),
    prisma.siteSettings.findUnique({ where: { id: 1 } }),
  ]);

  const title = meta?.title ?? fallback.title;
  const description = meta?.description ?? fallback.description;
  const siteName = settings?.siteName ?? "Gabriela Guerra Rey";
  const ogImage = meta?.ogImageUrl ?? settings?.authorPhotoUrl ?? DEFAULT_OG_IMAGE;

  return {
    title: `${title} | ${siteName}`,
    description,
    openGraph: {
      title,
      description,
      siteName,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

/** Variante para páginas de detalle (libro/artículo) que traen sus propios campos. */
export async function buildEntityMetadata(entity: {
  title: string;
  description: string;
  imageUrl?: string | null;
}): Promise<Metadata> {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  const siteName = settings?.siteName ?? "Gabriela Guerra Rey";
  const ogImage = entity.imageUrl ?? settings?.authorPhotoUrl ?? DEFAULT_OG_IMAGE;

  return {
    title: `${entity.title} | ${siteName}`,
    description: entity.description,
    openGraph: {
      title: entity.title,
      description: entity.description,
      siteName,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: entity.title,
      description: entity.description,
      images: [ogImage],
    },
  };
}
