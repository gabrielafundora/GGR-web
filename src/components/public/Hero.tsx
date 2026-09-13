import { LinkButton } from "@/components/ui/Button";

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
    <section className="relative overflow-hidden border-b border-border">
      {imageUrl ? (
        <>
          {/* Imagen de fondo del hero, editable en /admin/ajustes. La capa
              oscura encima garantiza que el texto siga siendo legible sin
              importar qué tan clara sea la imagen. */}
          <img
            src={imageUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-background/70" />
        </>
      ) : null}

      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
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
