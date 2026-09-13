/**
 * Renderiza datos estructurados Schema.org como <script type="application/ld+json">.
 * Un solo componente reutilizado por las 5 entidades (Person, Book, Course,
 * WebSite/Organization, Article) en vez de repetir JSON a mano en cada página.
 */
export function JsonLd({ data }: { data: object }) {
  // Escapa "<" para que un "</script>" dentro de algún texto (descripción,
  // biografía, etc.) no corte el tag antes de tiempo.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
