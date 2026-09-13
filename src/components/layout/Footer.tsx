import { prisma } from "@/lib/prisma";
import { NAV_LINKS } from "@/components/layout/Header";

const SOCIAL_FIELDS = [
  { key: "instagramUrl", label: "Instagram" },
  { key: "facebookUrl", label: "Facebook" },
  { key: "twitterUrl", label: "Twitter / X" },
  { key: "goodreadsUrl", label: "Goodreads" },
  { key: "amazonAuthorUrl", label: "Amazon" },
] as const;

export async function Footer() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  const siteName = settings?.siteName ?? "Gabriela Guerra Rey";
  const year = new Date().getFullYear();

  const socialLinks = SOCIAL_FIELDS.filter((f) => settings?.[f.key]);

  return (
    <footer className="mt-32 bg-ink text-ink-foreground">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="kicker text-ink-muted">Mantengámonos en contacto</p>
        <p className="mt-4 max-w-xl font-serif text-3xl leading-snug sm:text-4xl">
          Nuevos libros, artículos y talleres,{" "}
          <span className="italic">directo cuando salgan.</span>
        </p>

        <div className="mt-12 flex flex-col gap-8 border-t border-white/10 pt-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/images/brand/logo-naranja.png" alt="" className="h-8 w-auto" />
            <div>
              <p className="font-serif text-lg italic">{siteName}</p>
              {settings?.tagline ? (
                <p className="mt-1 text-sm text-ink-muted">{settings.tagline}</p>
              ) : null}
            </div>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold uppercase tracking-[0.1em] text-ink-muted">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="hover:text-accent">
                {link.label}
              </a>
            ))}
          </nav>

          {socialLinks.length > 0 ? (
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold uppercase tracking-[0.1em]">
              {socialLinks.map((f) => (
                <a
                  key={f.key}
                  href={settings![f.key]!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink-muted hover:text-accent"
                >
                  {f.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-ink-muted sm:px-6">
        © {year} {siteName}. Todos los derechos reservados.
      </div>
    </footer>
  );
}
