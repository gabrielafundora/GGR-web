import Link from "next/link";
import type { Book } from "@prisma/client";

import { Badge, Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";

export function BookCard({ book }: { book: Book }) {
  return (
    <Card className="flex flex-col overflow-hidden">
      <Link
        href={`/catalogo/${book.slug}`}
        className="relative block aspect-2/3 w-full overflow-hidden bg-surface-2"
      >
        {/* Portadas admin: URL arbitraria, por eso <img> en vez de next/image
            (evita tener que mantener un allowlist de dominios remotos). */}
        <img
          src={book.coverImageUrl}
          alt={`Portada de ${book.title}`}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        {book.featured ? <Badge className="absolute left-3 top-3">Destacado</Badge> : null}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-serif text-xl text-foreground">
            <Link href={`/catalogo/${book.slug}`} className="hover:text-accent">
              {book.title}
            </Link>
          </h3>
          {book.subtitle ? <p className="mt-1 text-sm text-muted">{book.subtitle}</p> : null}
        </div>

        <p className="line-clamp-3 flex-1 text-sm text-muted">{book.description}</p>

        <LinkButton href={book.amazonUrl} external variant="primary" className="mt-2 w-full">
          Ver en Amazon
        </LinkButton>
      </div>
    </Card>
  );
}
