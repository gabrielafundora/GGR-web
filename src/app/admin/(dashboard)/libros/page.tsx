import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { deleteBook } from "@/actions/books";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { Button } from "@/components/ui/Button";

export default async function AdminBooksPage() {
  const books = await prisma.book.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-foreground">Libros</h1>
        <Link href="/admin/libros/nuevo">
          <Button>+ Nuevo libro</Button>
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-surface text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Título</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id} className="border-t border-border">
                <td className="px-4 py-3 text-foreground">{book.title}</td>
                <td className="px-4 py-3 text-muted">{book.slug}</td>
                <td className="px-4 py-3 text-muted">{book.published ? "Publicado" : "Borrador"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-4">
                    <Link href={`/admin/libros/${book.id}/editar`} className="text-accent hover:text-accent-hover">
                      Editar
                    </Link>
                    <ConfirmDeleteButton action={deleteBook.bind(null, book.id)} />
                  </div>
                </td>
              </tr>
            ))}
            {books.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-muted">
                  Aún no hay libros. Crea el primero.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
