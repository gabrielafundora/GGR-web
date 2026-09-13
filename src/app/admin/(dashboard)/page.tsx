import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";

export default async function AdminHomePage() {
  const [books, articles, courses] = await Promise.all([
    prisma.book.count(),
    prisma.article.count(),
    prisma.course.count(),
  ]);

  const cards = [
    { label: "Libros", count: books, href: "/admin/libros" },
    { label: "Artículos", count: articles, href: "/admin/articulos" },
    { label: "Cursos y talleres", count: courses, href: "/admin/cursos" },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl text-foreground">Panel de administrador</h1>
      <p className="mt-2 text-muted">Gestiona el contenido del sitio de Gabriela Guerra Rey.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.href} href={c.href}>
            <Card className="p-6 hover:border-accent">
              <p className="text-sm text-muted">{c.label}</p>
              <p className="mt-2 font-serif text-4xl text-foreground">{c.count}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link href="/admin/metadatos" className="text-sm text-accent hover:text-accent-hover">
          Editar metadatos de las páginas →
        </Link>
        <Link href="/admin/ajustes" className="text-sm text-accent hover:text-accent-hover">
          Editar ajustes generales del sitio →
        </Link>
      </div>
    </div>
  );
}
