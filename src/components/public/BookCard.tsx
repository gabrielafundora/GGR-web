import Link from "next/link";
import type { Book } from "@prisma/client";

import { LinkButton } from "@/components/ui/Button";
import { formatAuthorList } from "@/lib/format";

export function BookCard({ book, authorName }: { book: Book; authorName: string }) {
  const authors = formatAuthorList([authorName, ...book.coautores]);

  return (
    <div className="flex flex-col">
      <Link
        href={`/catalogo/${book.slug}`}
        className="relative block aspect-2/3 w-full overflow-hidden bg-surface-2 shadow-[0_20px_35px_-15px_rgba(0,0,0,0.4)]"
      >
        {/* Portadas admin: URL arbitraria, por eso <img> en vez de next/image
            (evita tener que mantener un allowlist de dominios remotos). */}
        <img
          src={book.coverImageUrl}
          alt={`Portada de ${book.title}`}
          className="h-full w-full object-cover grayscale transition-[filter] duration-500 hover:grayscale-0"
          loading="lazy"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-3 pt-4">
        <div>
          <h3 className="font-serif text-xl text-foreground">
            <Link href={`/catalogo/${book.slug}`} className="hover:text-accent">
              {book.title}
            </Link>
          </h3>
          {book.subtitle ? (
            <p className="mt-1 font-serif text-sm italic text-muted">{book.subtitle}</p>
          ) : null}
          <p className="mt-1 text-xs text-muted">{authors}</p>
        </div>

        <LinkButton href={book.amazonUrl} external variant="primary" className="mt-auto w-full">
          Ver en Amazon
        </LinkButton>
      </div>
    </div>
  );
}
