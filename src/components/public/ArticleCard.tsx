import Link from "next/link";
import type { Article } from "@prisma/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { Card } from "@/components/ui/Card";

export function ArticleCard({ article }: { article: Article }) {
  const date = article.publishedAt ?? article.createdAt;

  return (
    <Card className="flex flex-col overflow-hidden">
      <Link href={`/articulos/${article.slug}`} className="block aspect-16/9 w-full overflow-hidden bg-surface-2">
        {article.coverImageUrl ? (
          <img
            src={article.coverImageUrl}
            alt={article.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-xs uppercase tracking-wider text-accent">
          {format(date, "d 'de' MMMM, yyyy", { locale: es })}
        </p>
        <h3 className="font-serif text-xl text-foreground">
          <Link href={`/articulos/${article.slug}`} className="hover:text-accent">
            {article.title}
          </Link>
        </h3>
        <p className="line-clamp-3 flex-1 text-sm text-muted">{article.excerpt}</p>
        <Link
          href={`/articulos/${article.slug}`}
          className="mt-2 text-sm font-medium text-accent hover:text-accent-hover"
        >
          Leer más →
        </Link>
      </div>
    </Card>
  );
}
