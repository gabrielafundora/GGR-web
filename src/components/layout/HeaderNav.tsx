"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

export function HeaderNav({ links }: { links: { href: string; label: string }[] }) {
  const pathname = usePathname();

  return (
    <nav className="hidden items-center gap-9 md:flex">
      {links.map((link) => {
        const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={clsx(
              "text-[0.7rem] font-semibold uppercase tracking-[0.14em] transition-colors hover:text-accent",
              active ? "text-accent" : "text-foreground/70"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
