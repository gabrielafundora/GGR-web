import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { buildEntityMetadata } from "@/lib/metadata";
import { LinkButton } from "@/components/ui/Button";

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
  const book = await getBook(slug);
  if (!book || !book.published) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-[minmax(0,280px)_1fr]">
        <div className="relative aspect-2/3 overflow-hidden bg-surface-2">
          <img
            src={book.coverImageUrl}
            alt={`Portada de ${book.title}`}
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          {book.genre || book.year ? (
            <p className="kicker text-accent-muted">
              {[book.genre, book.year].filter(Boolean).join(" · ")}
            </p>
          ) : null}
          <h1 className="mt-3 font-serif text-4xl text-foreground">{book.title}</h1>
          {book.subtitle ? (
            <p className="mt-2 font-serif text-lg italic text-muted">{book.subtitle}</p>
          ) : null}

          <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-muted">
            {book.description}
          </p>

          {book.editorial || book.idioma || book.paginas || book.isbn ? (
            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border pt-6 sm:grid-cols-4">
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

          <LinkButton href={book.amazonUrl} external variant="primary" className="mt-8">
            Ver en Amazon
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
