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
        <div className="relative aspect-2/3 overflow-hidden rounded-2xl border border-border bg-surface-2">
          <img
            src={book.coverImageUrl}
            alt={`Portada de ${book.title}`}
            className="h-full w-full object-cover"
          />
        </div>

        <div>
          <h1 className="font-serif text-4xl text-foreground">{book.title}</h1>
          {book.subtitle ? <p className="mt-2 text-lg text-muted">{book.subtitle}</p> : null}

          <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted">
            {book.genre ? <span className="rounded-full border border-border px-3 py-1">{book.genre}</span> : null}
            {book.year ? <span className="rounded-full border border-border px-3 py-1">{book.year}</span> : null}
          </div>

          <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-muted">
            {book.description}
          </p>

          <LinkButton href={book.amazonUrl} external variant="primary" className="mt-8">
            Ver en Amazon
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
