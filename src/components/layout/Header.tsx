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
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 font-serif text-xl italic tracking-tight text-foreground">
          <img src="/images/brand/logo-negro.png" alt="" className="h-8 w-auto" />
          {siteName}
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-foreground/70 transition-colors hover:text-accent"
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
