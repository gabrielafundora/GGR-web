import type { ReactNode } from "react";

import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildOrganizationJsonLd, buildWebSiteJsonLd } from "@/lib/jsonld";
import { getSiteUrl } from "@/lib/site";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  const siteUrl = getSiteUrl();

  return (
    <>
      <JsonLd data={buildWebSiteJsonLd(settings, siteUrl)} />
      <JsonLd data={buildOrganizationJsonLd(settings, siteUrl)} />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
