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
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,320px)_1fr]">
        {settings?.authorPhotoUrl ? (
          <div className="aspect-[4/5] w-full overflow-hidden bg-surface-2">
            <img
              src={settings.authorPhotoUrl}
              alt={settings.siteName}
              className="h-full w-full object-cover"
            />
          </div>
        ) : null}

        <div>
          <header className="max-w-2xl border-b border-border pb-8">
            <p className="kicker text-accent-muted">Sobre la autora</p>
            <h1 className="mt-3 font-serif text-5xl text-foreground">{settings?.siteName ?? "Gabriela Guerra Rey"}</h1>
            {settings?.tagline ? (
              <p className="mt-4 font-serif text-lg italic text-muted">{settings.tagline}</p>
            ) : null}
          </header>
        </div>
      </div>

      <div className="mt-16 max-w-3xl">
        {settings?.authorBio ? (
          <MarkdownContent content={settings.authorBio} className="prose-lg" />
        ) : (
          <p className="text-muted">Próximamente encontrarás aquí la biografía completa.</p>
        )}
      </div>
    </div>
  );
}
