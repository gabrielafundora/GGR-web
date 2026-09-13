import type { Metadata } from "next";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/metadata";
import { Hero } from "@/components/public/Hero";
import { BookCard } from "@/components/public/BookCard";
import { ArticleCard } from "@/components/public/ArticleCard";
import { LinkButton } from "@/components/ui/Button";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata("home", {
    title: "Gabriela Guerra Rey",
    description: "Autora de libros, artículos y talleres literarios.",
  });
}

export default async function HomePage() {
  const [settings, featuredBooks, latestArticles] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 1 } }),
    prisma.book.findMany({
      where: { published: true },
      orderBy: [{ featured: "desc" }, { order: "asc" }],
      take: 4,
    }),
    prisma.article.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      take: 3,
    }),
  ]);

  return (
    <>
      <Hero
        headline={settings?.heroHeadline ?? "Historias que se quedan contigo"}
        subtext={
          settings?.heroSubtext ??
          "Novelista y tallerista. Descubre mis libros, artículos sobre el oficio de escribir y los talleres literarios que imparto."
        }
      />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-serif text-3xl text-foreground">Libros destacados</h2>
          <Link href="/catalogo" className="text-sm text-accent hover:text-accent-hover">
            Ver todo el catálogo →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {latestArticles.length > 0 ? (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-serif text-3xl text-foreground">Últimos artículos</h2>
            <Link href="/articulos" className="text-sm text-accent hover:text-accent-hover">
              Ver todos →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="rounded-2xl border border-border bg-surface p-10 text-center sm:p-16">
          <h2 className="font-serif text-3xl text-foreground">Cursos y talleres literarios</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            Conoce los talleres que imparto para quienes quieren empezar o profundizar en su
            escritura.
          </p>
          <LinkButton href="/cursos" variant="primary" className="mt-8">
            Ver cursos y talleres
          </LinkButton>
        </div>
      </section>
    </>
  );
}
