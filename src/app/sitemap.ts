import type { MetadataRoute } from "next";

import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site";

// Un sitemap.ts que solo lee la base de datos (sin ninguna Request-time API
// como cookies()/headers()) se trataría como estático y solo se
// regeneraría en cada build; este `revalidate` lo refresca cada hora para
// que un libro/artículo nuevo aparezca sin esperar al próximo deploy.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  const [books, articles] = await Promise.all([
    prisma.book.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true, excerptMd: true },
    }),
    prisma.article.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/catalogo`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/articulos`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/cursos`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/sobre-mi`, changeFrequency: "monthly", priority: 0.6 },
  ];

  const bookRoutes: MetadataRoute.Sitemap = books.flatMap((book) => {
    const entries: MetadataRoute.Sitemap = [
      {
        url: `${siteUrl}/catalogo/${book.slug}`,
        lastModified: book.updatedAt,
        changeFrequency: "monthly",
        priority: 0.7,
      },
    ];
    if (book.excerptMd) {
      entries.push({
        url: `${siteUrl}/catalogo/${book.slug}/fragmento`,
        lastModified: book.updatedAt,
        changeFrequency: "yearly",
        priority: 0.5,
      });
    }
    return entries;
  });

  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${siteUrl}/articulos/${article.slug}`,
    lastModified: article.updatedAt,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...bookRoutes, ...articleRoutes];
}
