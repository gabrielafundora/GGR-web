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
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="font-serif text-base text-foreground">{siteName}</p>
          {settings?.tagline ? <p className="mt-1 text-sm text-muted">{settings.tagline}</p> : null}
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-accent">
              {link.label}
            </a>
          ))}
        </nav>

        {socialLinks.length > 0 ? (
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {socialLinks.map((f) => (
              <a
                key={f.key}
                href={settings![f.key]!}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-accent"
              >
                {f.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>
      <div className="border-t border-border px-4 py-4 text-center text-xs text-muted sm:px-6">
        © {year} {siteName}. Todos los derechos reservados.
      </div>
    </footer>
  );
}
