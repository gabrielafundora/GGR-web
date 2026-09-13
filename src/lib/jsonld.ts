import type { Article, Book as PrismaBook, Course as PrismaCourse, SiteSettings } from "@prisma/client";
import type {
  Book,
  Course,
  Organization,
  Person,
  WebSite,
  WithContext,
  BlogPosting,
  IdReference,
} from "schema-dts";

/** `@id` estable de la Person (la autora) — para que Book/Course/Article la referencien. */
export function personId(siteUrl: string): string {
  return `${siteUrl}/sobre-mi#person`;
}

/** `@id` estable de la Organization del sitio — referenciada por WebSite/Article. */
export function organizationId(siteUrl: string): string {
  return `${siteUrl}/#organization`;
}

/**
 * Person — /sobre-mi.
 *
 * `award`, `alumniOf` y `affiliation` no vienen de un campo separado en la
 * base de datos: son texto libre dentro de `SiteSettings.authorBio`. Se
 * dejan como constantes porque ya están escritos y visibles, tal cual, en
 * la biografía pública. Si esa parte de la biografía cambia (nuevo premio,
 * otra afiliación, etc.), hay que actualizar esto junto con el texto.
 */
export function buildPersonJsonLd(
  settings: SiteSettings | null,
  interestLinks: { title: string; url: string }[],
  siteUrl: string
): WithContext<Person> {
  const wikipediaUrl = interestLinks.find((link) => link.title === "Wikipedia")?.url;
  const editorialUrl = interestLinks.find(
    (link) => link.title === "Editorial Aquitania Siglo XXI"
  )?.url;

  const sameAs = [
    settings?.instagramUrl,
    settings?.facebookUrl,
    settings?.linkedinUrl,
    settings?.youtubeUrl,
    settings?.goodreadsUrl,
    settings?.amazonAuthorUrl,
    wikipediaUrl,
  ].filter((url): url is string => Boolean(url));

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId(siteUrl),
    name: settings?.siteName ?? "Gabriela Guerra Rey",
    url: `${siteUrl}/sobre-mi`,
    ...(settings?.authorPhotoUrl ? { image: settings.authorPhotoUrl } : {}),
    ...(settings?.tagline ? { jobTitle: settings.tagline } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
    award: "Premio Juan Rulfo a primera novela (2016), por Bahía de Sal",
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "Universidad Nacional Autónoma de México (UNAM)",
    },
    affiliation: {
      "@type": "Organization",
      name: "Editorial Aquitania Siglo XXI",
      ...(editorialUrl ? { url: editorialUrl } : {}),
    },
  };
}

/** Book — cada /catalogo/[slug]. */
export function buildBookJsonLd(book: PrismaBook, siteUrl: string): WithContext<Book> {
  const authors: (Person | IdReference)[] = [
    { "@id": personId(siteUrl) },
    ...book.coautores.map((name) => ({ "@type": "Person" as const, name })),
  ];

  return {
    "@context": "https://schema.org",
    "@type": "Book",
    url: `${siteUrl}/catalogo/${book.slug}`,
    name: book.title,
    description: book.description,
    image: book.coverImageUrl,
    author: authors,
    sameAs: [book.amazonUrl],
    ...(book.isbn ? { isbn: book.isbn } : {}),
    ...(book.paginas ? { numberOfPages: book.paginas } : {}),
    ...(book.idioma ? { inLanguage: book.idioma } : {}),
    ...(book.genre ? { genre: book.genre } : {}),
    ...(book.year ? { datePublished: String(book.year) } : {}),
    ...(book.editorial ? { publisher: { "@type": "Organization", name: book.editorial } } : {}),
  };
}

/**
 * Course — un <script> por taller en /cursos (no hay página de detalle por
 * curso). No se modela `isPermanent`/`sessionsCount`/`modality`: no hay una
 * propiedad de Course (no de CourseInstance) a la que mapeen sin forzar el
 * vocabulario, y no hay fechas reales que justifiquen `hasCourseInstance`.
 */
export function buildCourseJsonLd(course: PrismaCourse, siteUrl: string): WithContext<Course> {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description,
    url: course.externalUrl,
    provider: { "@id": personId(siteUrl) },
    ...(course.imageUrl ? { image: course.imageUrl } : {}),
  };
}

/** WebSite + Organization — globales, una sola vez por página pública. */
export function buildWebSiteJsonLd(settings: SiteSettings | null, siteUrl: string): WithContext<WebSite> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings?.siteName ?? "Gabriela Guerra Rey",
    url: siteUrl,
    ...(settings?.tagline ? { description: settings.tagline } : {}),
    publisher: { "@id": organizationId(siteUrl) },
  };
}

export function buildOrganizationJsonLd(
  settings: SiteSettings | null,
  siteUrl: string
): WithContext<Organization> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId(siteUrl),
    name: settings?.siteName ?? "Gabriela Guerra Rey",
    url: siteUrl,
    logo: `${siteUrl}/images/brand/logo-negro.png`,
  };
}

/** Article (BlogPosting) — cada /articulos/[slug]. */
export function buildArticleJsonLd(article: Article, siteUrl: string): WithContext<BlogPosting> {
  const url = `${siteUrl}/articulos/${article.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    url,
    mainEntityOfPage: url,
    datePublished: (article.publishedAt ?? article.createdAt).toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: { "@id": personId(siteUrl) },
    publisher: { "@id": organizationId(siteUrl) },
    ...(article.coverImageUrl ? { image: article.coverImageUrl } : {}),
  };
}
