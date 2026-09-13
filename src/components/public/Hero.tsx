import { LinkButton } from "@/components/ui/Button";

export function Hero({
  headline,
  subtext,
}: {
  headline: string;
  subtext?: string | null;
}) {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <h1 className="max-w-3xl font-serif text-4xl leading-tight text-foreground sm:text-5xl md:text-6xl">
          {headline}
        </h1>
        {subtext ? (
          <p className="mt-6 max-w-xl text-lg text-muted">{subtext}</p>
        ) : null}
        <div className="mt-10 flex flex-wrap gap-4">
          <LinkButton href="/catalogo" variant="primary">
            Ver catálogo
          </LinkButton>
          <LinkButton href="/sobre-mi" variant="outline">
            Sobre la autora
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
