import { LinkButton, ButtonArrow } from "@/components/ui/Button";

export function Hero({
  name,
  tagline,
  description,
  imageUrl,
}: {
  /** Nombre de la autora, en grande — lo principal del hero. */
  name: string;
  /** Etiqueta corta arriba del nombre (ej. "Novelista y tallerista"). */
  tagline?: string | null;
  /** Descripción breve debajo del nombre. */
  description?: string | null;
  imageUrl?: string | null;
}) {
  return (
    <section className="relative overflow-hidden bg-ink text-ink-foreground">
      {imageUrl ? (
        <img src={imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : null}

      <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:py-40">
        {tagline ? <p className="kicker text-accent">{tagline}</p> : null}
        <h1 className="mt-5 max-w-3xl font-serif text-6xl leading-[1.05] sm:text-7xl md:text-8xl">
          {name}
        </h1>
        {description ? (
          <p className="mt-7 max-w-md text-base leading-relaxed text-ink-muted">{description}</p>
        ) : null}
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          <LinkButton href="/catalogo" variant="primary">
            Ver catálogo
          </LinkButton>
          <LinkButton href="/sobre-mi" variant="linkInverse">
            Sobre la autora <ButtonArrow />
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
