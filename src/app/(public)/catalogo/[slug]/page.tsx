import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { buildEntityMetadata } from "@/lib/metadata";
import { formatAuthorList } from "@/lib/format";
import { LinkButton } from "@/components/ui/Button";
import { BookCard } from "@/components/public/BookCard";

async function getBook(slug: string) {
  return prisma.book.findUnique({ where: { slug } });
}

export async function generateMetadata({
  params,
}: PageProps<"/catalogo/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const book = await getBook(slug);
  if (!book) return { title: "Libro no encontrado" };
  return buildEntityMetadata({
    title: book.title,
    description: book.description,
    imageUrl: book.coverImageUrl,
  });
}

export default async function BookDetailPage({ params }: PageProps<"/catalogo/[slug]">) {
  const { slug } = await params;
  const [book, settings] = await Promise.all([
    getBook(slug),
    prisma.siteSettings.findUnique({ where: { id: 1 } }),
  ]);
  if (!book || !book.published) notFound();

  const authorName = settings?.siteName ?? "Gabriela Guerra Rey";
  const authors = formatAuthorList([authorName, ...book.coautores]);

  const otherBooks = await prisma.book.findMany({
    where: { published: true, slug: { not: book.slug } },
    orderBy: { order: "asc" },
    take: 3,
  });

  return (
    <div className="pb-24">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted hover:text-accent"
        >
          ← Volver al catálogo
        </Link>

        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[340px_1fr] lg:gap-16">
          {/* Portada + datos rápidos + CTA: viven juntos en esta columna para que su
              altura no dependa de qué tan larga sea la descripción de al lado. */}
          <div className="mx-auto w-full max-w-[280px] lg:mx-0 lg:max-w-none">
            <div className="relative">
              <div className="absolute -bottom-5 -right-5 h-full w-full bg-accent/15" aria-hidden />
              <div className="relative aspect-2/3 w-full overflow-hidden bg-surface-2 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4)]">
                <img
                  src={book.coverImageUrl}
                  alt={`Portada de ${book.title}`}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {book.editorial || book.idioma || book.paginas || book.isbn ? (
              <dl className="mt-10 flex flex-col gap-4 border-t border-border pt-6">
                {book.editorial ? (
                  <div>
                    <dt className="kicker text-foreground/50">Editorial</dt>
                    <dd className="mt-1 text-sm text-muted">{book.editorial}</dd>
                  </div>
                ) : null}
                {book.idioma ? (
                  <div>
                    <dt className="kicker text-foreground/50">Idioma</dt>
                    <dd className="mt-1 text-sm text-muted">{book.idioma}</dd>
                  </div>
                ) : null}
                {book.paginas ? (
                  <div>
                    <dt className="kicker text-foreground/50">Páginas</dt>
                    <dd className="mt-1 text-sm text-muted">{book.paginas}</dd>
                  </div>
                ) : null}
                {book.isbn ? (
                  <div>
                    <dt className="kicker text-foreground/50">ISBN</dt>
                    <dd className="mt-1 text-sm text-muted">{book.isbn}</dd>
                  </div>
                ) : null}
              </dl>
            ) : null}
          </div>

          <div>
            {book.genre || book.year ? (
              <p className="kicker text-accent-muted">
                {[book.genre, book.year].filter(Boolean).join(" · ")}
              </p>
            ) : null}
            <h1 className="mt-3 font-serif text-5xl leading-[1.05] text-foreground sm:text-6xl">
              {book.title}
            </h1>
            {book.subtitle ? (
              <p className="mt-3 font-serif text-xl italic text-muted">{book.subtitle}</p>
            ) : null}
            <p className="mt-3 text-sm text-muted">{authors}</p>

            <p className="mt-8 whitespace-pre-line text-sm leading-relaxed text-muted">
              {book.description}
            </p>

            <LinkButton href={book.amazonUrl} external variant="primary" className="mt-8">
              Ver en Amazon
            </LinkButton>
          </div>
        </div>
      </div>

      {otherBooks.length > 0 ? (
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="border-t border-border pt-16">
            <p className="kicker text-accent-muted">Sigue explorando</p>
            <h2 className="mt-3 font-serif text-3xl text-foreground">Más libros</h2>
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {otherBooks.map((other) => (
                <BookCard key={other.id} book={other} authorName={authorName} />
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
