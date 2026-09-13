import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { prisma } from "@/lib/prisma";
import { buildEntityMetadata } from "@/lib/metadata";
import { MarkdownContent } from "@/components/public/MarkdownContent";

async function getArticle(slug: string) {
  return prisma.article.findUnique({ where: { slug } });
}

export async function generateMetadata({
  params,
}: PageProps<"/articulos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "Artículo no encontrado" };
  return buildEntityMetadata({
    title: article.metaTitle ?? article.title,
    description: article.metaDescription ?? article.excerpt,
  });
}

export default async function ArticleDetailPage({ params }: PageProps<"/articulos/[slug]">) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article || !article.published) notFound();

  const date = article.publishedAt ?? article.createdAt;

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <header className="mb-10 border-b border-border pb-8">
        <p className="kicker text-accent-muted">
          {format(date, "d 'de' MMMM, yyyy", { locale: es })}
        </p>
        <h1 className="mt-3 font-serif text-4xl text-foreground sm:text-5xl">{article.title}</h1>
        <p className="mt-4 text-lg text-muted">{article.excerpt}</p>
      </header>

      {article.coverImageUrl ? (
        <div className="mb-10 aspect-16/9 overflow-hidden bg-surface-2">
          <img src={article.coverImageUrl} alt={article.title} className="h-full w-full object-cover" />
        </div>
      ) : null}

      <MarkdownContent content={article.contentMd} className="prose-sm" />
    </article>
  );
}
