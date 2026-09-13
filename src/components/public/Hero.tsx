import { LinkButton, ButtonArrow } from "@/components/ui/Button";

export function Hero({
  headline,
  subtext,
  imageUrl,
}: {
  headline: string;
  subtext?: string | null;
  imageUrl?: string | null;
}) {
  return (
    <section className="relative overflow-hidden bg-ink text-ink-foreground">
      {imageUrl ? (
        <>
          <img src={imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
          {/* Degradado: más oscuro donde va el texto (izquierda), más
              transparente hacia la derecha para que la foto se siga viendo. */}
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/30" />
        </>
      ) : null}

      <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 sm:py-32 lg:py-40">
        <p className="kicker text-accent">Autora · Gabriela Guerra Rey</p>
        <h1 className="mt-5 max-w-2xl font-serif text-5xl leading-[1.05] sm:text-6xl md:text-7xl">
          {headline}
        </h1>
        {subtext ? (
          <p className="mt-7 max-w-md text-base leading-relaxed text-ink-muted">{subtext}</p>
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
