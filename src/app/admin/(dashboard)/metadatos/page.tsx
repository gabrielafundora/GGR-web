import { prisma } from "@/lib/prisma";
import { PageMetaForm } from "./PageMetaForm";

const SECTIONS: { page: string; label: string; path: string; defaultTitle: string; defaultDescription: string }[] = [
  { page: "home", label: "Inicio", path: "/", defaultTitle: "Gabriela Guerra Rey", defaultDescription: "Autora de libros, artículos y talleres literarios." },
  { page: "catalogo", label: "Catálogo", path: "/catalogo", defaultTitle: "Catálogo de libros", defaultDescription: "Explora los libros publicados por Gabriela Guerra Rey, disponibles en Amazon." },
  { page: "articulos", label: "Artículos", path: "/articulos", defaultTitle: "Artículos", defaultDescription: "Reflexiones y artículos de Gabriela Guerra Rey sobre literatura y escritura." },
  { page: "cursos", label: "Cursos y Talleres", path: "/cursos", defaultTitle: "Cursos y Talleres", defaultDescription: "Talleres literarios impartidos por Gabriela Guerra Rey." },
  { page: "sobre-mi", label: "Sobre la autora", path: "/sobre-mi", defaultTitle: "Sobre la autora", defaultDescription: "Conoce a Gabriela Guerra Rey, autora y tallerista literaria." },
];

export default async function AdminMetadataPage() {
  const rows = await prisma.pageMeta.findMany();
  const byPage = new Map(rows.map((r) => [r.page, r]));

  return (
    <div>
      <h1 className="font-serif text-3xl text-foreground">Metadatos de las páginas</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Controla el título, la descripción y la imagen que se muestran cuando cada sección se
        comparte o aparece en buscadores (SEO / redes sociales).
      </p>

      <div className="mt-8 flex flex-col gap-6">
        {SECTIONS.map((section) => {
          const existing = byPage.get(section.page);
          return (
            <PageMetaForm
              key={section.page}
              page={section.page}
              label={section.label}
              path={section.path}
              title={existing?.title ?? section.defaultTitle}
              description={existing?.description ?? section.defaultDescription}
              ogImageUrl={existing?.ogImageUrl}
            />
          );
        })}
      </div>
    </div>
  );
}
