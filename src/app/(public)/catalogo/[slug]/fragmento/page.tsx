import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { LinkButton } from "@/components/ui/Button";
import { MarkdownContent } from "@/components/public/MarkdownContent";

async function getBook(slug: string) {
  return prisma.book.findUnique({ where: { slug } });
}

export async function generateMetadata({
  params,
}: PageProps<"/catalogo/[slug]/fragmento">): Promise<Metadata> {
  const { slug } = await params;
  const book = await getBook(slug);
  if (!book) return { title: "Fragmento no encontrado" };
  return { title: `Fragmento gratis: ${book.title}` };
}

export default async function BookExcerptPage({
  params,
}: PageProps<"/catalogo/[slug]/fragmento">) {
  const { slug } = await params;
  const book = await getBook(slug);
  if (!book || !book.published || !book.excerptMd) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <Link
        href={`/catalogo/${book.slug}`}
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted hover:text-accent"
      >
        ← Volver al libro
      </Link>

      <header className="mt-10 mb-10 border-b border-border pb-8">
        <p className="kicker text-accent-muted">Fragmento gratis</p>
        <h1 className="mt-3 font-serif text-4xl text-foreground sm:text-5xl">{book.title}</h1>
      </header>

      <MarkdownContent content={book.excerptMd} className="prose-sm" />

      <div className="mt-12 border-t border-border pt-8">
        <LinkButton href={book.amazonUrl} external variant="primary">
          Ver en Amazon
        </LinkButton>
      </div>
    </article>
  );
}
