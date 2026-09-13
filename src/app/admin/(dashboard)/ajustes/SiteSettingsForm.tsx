"use client";

import { useActionState } from "react";
import type { SiteSettings } from "@prisma/client";

import { updateSiteSettings } from "@/actions/siteSettings";
import { initialActionState } from "@/lib/action-state";
import { Input, Textarea } from "@/components/ui/Field";
import { ImageField } from "@/components/admin/ImageField";
import { Button } from "@/components/ui/Button";

export function SiteSettingsForm({ settings }: { settings: SiteSettings | null }) {
  const [state, formAction, pending] = useActionState(updateSiteSettings, initialActionState);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-8">
      <section className="flex flex-col gap-4">
        <h2 className="font-serif text-xl text-foreground">General</h2>
        <Input label="Nombre del sitio" name="siteName" defaultValue={settings?.siteName ?? "Gabriela Guerra Rey"} required />
        <Input label="Tagline (opcional)" name="tagline" defaultValue={settings?.tagline ?? ""} />
        <Input label="Correo de contacto (opcional)" name="contactEmail" type="email" defaultValue={settings?.contactEmail ?? ""} />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-serif text-xl text-foreground">Portada (Inicio)</h2>
        <Input
          label="Etiqueta sobre el nombre"
          name="heroHeadline"
          defaultValue={settings?.heroHeadline ?? ""}
          hint='Ej. "Novelista y tallerista". El nombre del sitio (arriba) se muestra en grande debajo de esta etiqueta.'
        />
        <Textarea
          label="Descripción breve del hero"
          name="heroSubtext"
          defaultValue={settings?.heroSubtext ?? ""}
          hint="Uno o dos renglones debajo del nombre."
        />
        <ImageField
          label="Imagen de fondo del hero (opcional)"
          name="heroImageUrl"
          defaultValue={settings?.heroImageUrl}
          hint="Se muestra detrás del nombre en la portada de Inicio, sin ninguna capa encima — elige una foto donde el texto blanco se siga leyendo bien."
        />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-serif text-xl text-foreground">Sobre la autora</h2>
        <ImageField label="Foto de la autora" name="authorPhotoUrl" defaultValue={settings?.authorPhotoUrl} />
        <Textarea
          label="Biografía (markdown)"
          name="authorBio"
          defaultValue={settings?.authorBio ?? ""}
          className="min-h-48"
        />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-serif text-xl text-foreground">Redes sociales (opcional)</h2>
        <Input label="Instagram" name="instagramUrl" defaultValue={settings?.instagramUrl ?? ""} />
        <Input label="Facebook" name="facebookUrl" defaultValue={settings?.facebookUrl ?? ""} />
        <Input label="Twitter / X" name="twitterUrl" defaultValue={settings?.twitterUrl ?? ""} />
        <Input label="Goodreads" name="goodreadsUrl" defaultValue={settings?.goodreadsUrl ?? ""} />
        <Input label="Página de autora en Amazon" name="amazonAuthorUrl" defaultValue={settings?.amazonAuthorUrl ?? ""} />
      </section>

      {state.error ? <p className="text-sm text-accent">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-accent">{state.success}</p> : null}

      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "Guardando…" : "Guardar ajustes"}
      </Button>
    </form>
  );
}
