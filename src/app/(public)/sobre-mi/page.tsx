import type { Metadata } from "next";

import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/metadata";
import { MarkdownContent } from "@/components/public/MarkdownContent";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata("sobre-mi", {
    title: "Sobre la autora",
    description: "Conoce a Gabriela Guerra Rey, autora y tallerista literaria.",
  });
}

export default async function SobreMiPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="flex flex-col items-center gap-8 text-center sm:flex-row sm:items-start sm:text-left">
        {settings?.authorPhotoUrl ? (
          <img
            src={settings.authorPhotoUrl}
            alt={settings.siteName}
            className="h-40 w-40 shrink-0 rounded-full border border-border object-cover"
          />
        ) : null}
        <div>
          <h1 className="font-serif text-4xl text-foreground">Sobre la autora</h1>
          {settings?.tagline ? <p className="mt-2 text-lg text-accent">{settings.tagline}</p> : null}
        </div>
      </div>

      <div className="mt-12">
        {settings?.authorBio ? (
          <MarkdownContent content={settings.authorBio} />
        ) : (
          <p className="text-muted">Próximamente encontrarás aquí la biografía completa.</p>
        )}
      </div>
    </div>
  );
}
