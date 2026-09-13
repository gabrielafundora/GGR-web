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
    <section className="border-b border-border">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:py-28">
        <div className={imageUrl ? "lg:order-1" : ""}>
          <p className="kicker text-accent-muted">Autora · Gabriela Guerra Rey</p>
          <h1 className="mt-5 max-w-xl font-serif text-5xl leading-[1.05] text-foreground sm:text-6xl md:text-7xl">
            {headline}
          </h1>
          {subtext ? (
            <p className="mt-7 max-w-md text-base leading-relaxed text-muted">{subtext}</p>
          ) : null}
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <LinkButton href="/catalogo" variant="primary">
              Ver catálogo
            </LinkButton>
            <LinkButton href="/sobre-mi" variant="link">
              Sobre la autora <ButtonArrow />
            </LinkButton>
          </div>
        </div>

        {imageUrl ? (
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface-2 lg:order-2">
            <img src={imageUrl} alt="" className="h-full w-full object-cover" />
          </div>
        ) : null}
      </div>
    </section>
  );
}
