import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { prisma } from "@/lib/prisma";
import { deleteArticle } from "@/actions/articles";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { Button } from "@/components/ui/Button";

export default async function AdminArticlesPage() {
  const articles = await prisma.article.findMany({
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-foreground">Artículos</h1>
        <Link href="/admin/articulos/nuevo">
          <Button>+ Nuevo artículo</Button>
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-surface text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Título</th>
              <th className="px-4 py-3 font-medium">Fecha</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium">SEO</th>
              <th className="px-4 py-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id} className="border-t border-border">
                <td className="px-4 py-3 text-foreground">{article.title}</td>
                <td className="px-4 py-3 text-muted">
                  {format(article.publishedAt ?? article.createdAt, "d MMM yyyy", { locale: es })}
                </td>
                <td className="px-4 py-3 text-muted">{article.published ? "Publicado" : "Borrador"}</td>
                <td className="px-4 py-3">
                  {article.metaTitle && article.metaDescription ? (
                    <span className="text-foreground">Completo</span>
                  ) : (
                    <span className="text-muted">Incompleto</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-4">
                    <Link
                      href={`/admin/articulos/${article.id}/editar`}
                      className="text-accent hover:text-accent-hover"
                    >
                      Editar
                    </Link>
                    <ConfirmDeleteButton action={deleteArticle.bind(null, article.id)} />
                  </div>
                </td>
              </tr>
            ))}
            {articles.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-muted">
                  Aún no hay artículos. Crea el primero.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
