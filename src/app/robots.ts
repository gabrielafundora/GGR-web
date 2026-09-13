import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /admin/** ya lleva `robots: noindex` a nivel de página (ver
      // admin/(dashboard)/layout.tsx y admin/login/page.tsx); esto además
      // evita que un crawler gaste tiempo de rastreo pidiendo esas rutas.
      disallow: "/admin/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
