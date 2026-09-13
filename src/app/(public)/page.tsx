import type { Metadata } from "next";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/metadata";
import { Hero } from "@/components/public/Hero";
import { BookCard } from "@/components/public/BookCard";
import { ArticleCard } from "@/components/public/ArticleCard";
import { LinkButton, ButtonArrow } from "@/components/ui/Button";

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
      orderBy: { order: "asc" },
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
        name={settings?.siteName ?? "Gabriela Guerra Rey"}
        tagline={settings?.heroHeadline ?? "Novelista y tallerista"}
        description={
          settings?.heroSubtext ??
          "Descubre mis libros, artículos sobre el oficio de escribir y los talleres literarios que imparto."
        }
        imageUrl={settings?.heroImageUrl ?? settings?.authorPhotoUrl}
      />

      {/* Claro */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
          <div>
            <p className="kicker text-accent-muted">Obra publicada</p>
            <h2 className="mt-3 font-serif text-4xl text-foreground">Libros destacados</h2>
          </div>
          <Link
            href="/catalogo"
            className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-foreground hover:text-accent"
          >
            Ver todo el catálogo <ButtonArrow />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredBooks.map((book) => (
            <BookCard key={book.id} book={book} authorName={settings?.siteName ?? "Gabriela Guerra Rey"} />
          ))}
        </div>
      </section>

      {/* Oscuro */}
      <section className="bg-ink text-ink-foreground">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="grid grid-cols-1 items-center gap-10 border border-white/10 bg-ink-2 px-8 py-16 sm:px-16 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="kicker text-accent">Talleres literarios</p>
              <h2 className="mt-3 max-w-md font-serif text-3xl leading-tight sm:text-4xl">
                Escribe con <span className="italic">acompañamiento</span> y estructura.
              </h2>
              <p className="mt-4 max-w-md text-ink-muted">
                Conoce los talleres que imparto para quienes quieren empezar o profundizar en su
                escritura.
              </p>
            </div>
            <LinkButton href="/cursos" variant="primaryInverse" className="w-fit">
              Ver cursos y talleres
            </LinkButton>
          </div>
        </div>
      </section>

      {/* Claro: sobre mí */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
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
            <p className="kicker text-accent-muted">Sobre la autora</p>
            <h2 className="mt-3 font-serif text-4xl leading-tight text-foreground">
              Palabras con <span className="italic">memoria</span> y oficio.
            </h2>
            <p className="mt-6 max-w-md text-muted">
              {settings?.tagline ??
                "Novelista y tallerista con más de una década escribiendo sobre la memoria, los vínculos familiares y los lugares que dejamos atrás."}
            </p>
            <div className="mt-8">
              <LinkButton href="/sobre-mi" variant="outline">
                Más sobre la autora
              </LinkButton>
            </div>
          </div>
        </div>
      </section>

      {/* Oscuro */}
      {latestArticles.length > 0 ? (
        <section className="bg-ink text-ink-foreground">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <p className="kicker text-accent">El blog</p>
                <h2 className="mt-3 font-serif text-4xl">Últimos artículos</h2>
              </div>
              <Link
                href="/articulos"
                className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] hover:text-accent"
              >
                Ver todos <ButtonArrow />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
