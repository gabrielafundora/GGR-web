import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { MobileNav } from "@/components/layout/MobileNav";

export const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/catalogo", label: "Catálogo" },
  { href: "/articulos", label: "Artículos" },
  { href: "/cursos", label: "Cursos y Talleres" },
  { href: "/sobre-mi", label: "Sobre la autora" },
];

export async function Header() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });
  const siteName = settings?.siteName ?? "Gabriela Guerra Rey";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="font-serif text-lg tracking-tight text-foreground">
          {siteName}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <MobileNav links={NAV_LINKS} />
      </div>
    </header>
  );
}
