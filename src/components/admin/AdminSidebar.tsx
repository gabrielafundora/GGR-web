import Link from "next/link";

import { signOut } from "@/auth";

const LINKS = [
  { href: "/admin", label: "Panel" },
  { href: "/admin/libros", label: "Libros" },
  { href: "/admin/articulos", label: "Artículos" },
  { href: "/admin/cursos", label: "Cursos y talleres" },
  { href: "/admin/metadatos", label: "Metadatos" },
  { href: "/admin/ajustes", label: "Ajustes del sitio" },
];

export function AdminSidebar({ email }: { email?: string | null }) {
  return (
    <aside className="flex w-full shrink-0 flex-col justify-between border-border bg-surface p-4 sm:w-56 sm:min-h-screen sm:border-r">
      <div>
        <p className="mb-6 px-2 font-serif text-lg text-foreground">Administrador</p>
        <nav className="flex flex-row flex-wrap gap-1 sm:flex-col">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-6 border-t border-border pt-4">
        {email ? <p className="mb-3 truncate px-2 text-xs text-muted">{email}</p> : null}
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/admin/login" });
          }}
        >
          <button
            type="submit"
            className="w-full rounded-lg px-3 py-2 text-left text-sm text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            Cerrar sesión
          </button>
        </form>
        <Link
          href="/"
          className="mt-1 block rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
        >
          ← Volver al sitio
        </Link>
      </div>
    </aside>
  );
}
