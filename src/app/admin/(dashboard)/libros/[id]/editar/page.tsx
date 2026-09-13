import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { updateBook } from "@/actions/books";
import { BookForm } from "../../BookForm";

export default async function EditBookPage({ params }: PageProps<"/admin/libros/[id]/editar">) {
  const { id } = await params;
  const book = await prisma.book.findUnique({ where: { id } });
  if (!book) notFound();

  const action = updateBook.bind(null, book.id);

  return (
    <div>
      <h1 className="font-serif text-3xl text-foreground">Editar libro</h1>
      <div className="mt-8">
        <BookForm book={book} action={action} />
      </div>
    </div>
  );
}
