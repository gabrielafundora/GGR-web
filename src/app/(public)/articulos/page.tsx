import type { Metadata } from "next";

import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/metadata";
import { ArticleCard } from "@/components/public/ArticleCard";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata("articulos", {
    title: "Artículos",
    description: "Reflexiones y artículos de Gabriela Guerra Rey sobre literatura y escritura.",
  });
}

export default async function ArticulosPage() {
  const articles = await prisma.article.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { publishedAt: "desc" }],
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <header className="mb-12 max-w-2xl">
        <h1 className="font-serif text-4xl text-foreground">Artículos</h1>
        <p className="mt-4 text-muted">
          Publicaciones ocasionales sobre el oficio de escribir, el proceso creativo y temas que
          me interesan como autora.
        </p>
      </header>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <p className="text-muted">Todavía no hay artículos publicados. Vuelve pronto.</p>
      )}
    </div>
  );
}
