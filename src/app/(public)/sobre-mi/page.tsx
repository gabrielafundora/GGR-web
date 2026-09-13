import type { Metadata } from "next";

import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/metadata";
import { MarkdownContent } from "@/components/public/MarkdownContent";
import { LinkButton, ButtonArrow } from "@/components/ui/Button";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata("sobre-mi", {
    title: "Sobre la autora",
    description: "Conoce a Gabriela Guerra Rey, autora y tallerista literaria.",
  });
}

export default async function SobreMiPage() {
  const [settings, interestLinks] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 1 } }),
    prisma.interestLink.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
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
            {settings?.authorQuote ? (
              <p className="mt-6 max-w-md font-serif text-2xl italic leading-snug text-foreground">
                &ldquo;{settings.authorQuote}&rdquo;
              </p>
            ) : null}
          </header>
        </div>
      </div>

      <div className="mt-16 max-w-3xl">
        {settings?.authorBio ? (
          <MarkdownContent content={settings.authorBio} className="prose-sm" />
        ) : (
          <p className="text-muted">Próximamente encontrarás aquí la biografía completa.</p>
        )}
      </div>

      {interestLinks.length > 0 ? (
        <div className="mt-16 max-w-3xl border-t border-border pt-16">
          <p className="kicker text-accent-muted">Recursos</p>
          <h2 className="mt-3 font-serif text-3xl text-foreground">Ligas de interés</h2>
          <ul className="mt-6 flex flex-col gap-3">
            {interestLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-foreground hover:text-accent"
                >
                  {link.title} <ButtonArrow />
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {settings?.contactEmail ? (
        <div className="mt-16 max-w-3xl border-t border-border pt-16">
          <p className="kicker text-accent-muted">Contacto</p>
          <h2 className="mt-3 font-serif text-3xl text-foreground">Escríbeme</h2>
          <p className="mt-4 text-muted">
            Para consultas sobre talleres, colaboraciones o prensa, puedes escribirme
            directamente.
          </p>
          <LinkButton
            href={`mailto:${settings.contactEmail}`}
            variant="outline"
            className="mt-6 w-fit"
          >
            {settings.contactEmail}
          </LinkButton>
        </div>
      ) : null}
    </div>
  );
}
