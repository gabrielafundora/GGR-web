import type { Metadata } from "next";

import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/metadata";
import { BookCard } from "@/components/public/BookCard";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata("catalogo", {
    title: "Catálogo de libros",
    description: "Explora los libros publicados por Gabriela Guerra Rey, disponibles en Amazon.",
  });
}

export default async function CatalogoPage() {
  const books = await prisma.book.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <header className="mb-12 max-w-2xl border-b border-border pb-8">
        <p className="kicker text-accent-muted">Obra publicada</p>
        <h1 className="mt-3 font-serif text-5xl text-foreground">Catálogo</h1>
        <p className="mt-4 text-muted">
          Cada libro tiene su propia página en Amazon: ahí puedes comprarlo en el formato que
          prefieras (impreso, digital o audiolibro, según disponibilidad).
        </p>
      </header>

      {books.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <p className="text-muted">Muy pronto encontrarás aquí el catálogo completo.</p>
      )}
    </div>
  );
}
