import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { updateArticle } from "@/actions/articles";
import { ArticleForm } from "../../ArticleForm";

export default async function EditArticlePage({
  params,
}: PageProps<"/admin/articulos/[id]/editar">) {
  const { id } = await params;
  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) notFound();

  const action = updateArticle.bind(null, article.id);

  return (
    <div>
      <h1 className="font-serif text-3xl text-foreground">Editar artículo</h1>
      <div className="mt-8">
        <ArticleForm article={article} action={action} />
      </div>
    </div>
  );
}
