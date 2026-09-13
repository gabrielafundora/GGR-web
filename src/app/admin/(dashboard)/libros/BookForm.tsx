"use client";

import { useActionState, useState } from "react";
import type { Book } from "@prisma/client";

import { initialActionState } from "@/lib/action-state";
import { Input, Textarea, Checkbox } from "@/components/ui/Field";
import { ImageField } from "@/components/admin/ImageField";
import { Button } from "@/components/ui/Button";
import { MarkdownContent } from "@/components/public/MarkdownContent";
import type { ActionState } from "@/lib/action-state";

export function BookForm({
  book,
  action,
}: {
  book?: Book;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [state, formAction, pending] = useActionState(action, initialActionState);
  const [excerpt, setExcerpt] = useState(book?.excerptMd ?? "");
  const [excerptPreview, setExcerptPreview] = useState(false);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      <Input
        label="Slug (URL)"
        name="slug"
        defaultValue={book?.slug}
        placeholder="mi-libro"
        hint="Solo minúsculas, números y guiones. Define la URL: /catalogo/tu-slug"
        required
      />
      <Input label="Título" name="title" defaultValue={book?.title} required />
      <Input label="Subtítulo (opcional)" name="subtitle" defaultValue={book?.subtitle ?? ""} />
      <Input
        label="Coautores (opcional)"
        name="coautores"
        defaultValue={book?.coautores?.join(", ") ?? ""}
        placeholder="Fulano Pérez, Zutana Gómez"
        hint="Además de Gabriela. Varios nombres separados por coma; déjalo vacío si el libro es solo suyo."
      />
      <Textarea
        label="Descripción / sinopsis"
        name="description"
        defaultValue={book?.description}
        required
      />

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="excerptMd" className="text-sm font-medium text-foreground">
            Fragmento gratis (opcional, markdown)
          </label>
          <button
            type="button"
            onClick={() => setExcerptPreview((v) => !v)}
            className="text-xs text-accent hover:text-accent-hover"
          >
            {excerptPreview ? "Volver a editar" : "Vista previa"}
          </button>
        </div>
        {excerptPreview ? (
          <div className="rounded-lg border border-border bg-surface p-4">
            <MarkdownContent content={excerpt} />
          </div>
        ) : (
          <textarea
            id="excerptMd"
            name="excerptMd"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="min-h-48 w-full resize-y rounded-lg border border-border bg-surface px-3 py-2 font-mono text-[13px] text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
            placeholder={"Un adelanto del libro, en **markdown**.\n\nDéjalo vacío si este libro no ofrece fragmento."}
          />
        )}
        {excerptPreview ? <input type="hidden" name="excerptMd" value={excerpt} /> : null}
        <p className="mt-1.5 text-xs text-muted">
          Si lo llenas, se muestra completo en la página pública del libro para que cualquiera lo
          lea gratis.
        </p>
      </div>

      <ImageField
        label="Portada"
        name="coverImageUrl"
        defaultValue={book?.coverImageUrl}
        required
        hint="Sube un archivo (máx. 5MB) o pega la URL de una imagen."
      />
      <Input
        label="Link a Amazon"
        name="amazonUrl"
        type="url"
        defaultValue={book?.amazonUrl}
        placeholder="https://www.amazon.com/dp/..."
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Año (opcional)" name="year" type="number" defaultValue={book?.year ?? ""} />
        <Input label="Género (opcional)" name="genre" defaultValue={book?.genre ?? ""} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Editorial (opcional)" name="editorial" defaultValue={book?.editorial ?? ""} />
        <Input label="Idioma (opcional)" name="idioma" defaultValue={book?.idioma ?? ""} placeholder="Español" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Número de páginas (opcional)"
          name="paginas"
          type="number"
          defaultValue={book?.paginas ?? ""}
        />
        <Input label="ISBN (opcional)" name="isbn" defaultValue={book?.isbn ?? ""} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Orden" name="order" type="number" defaultValue={book?.order ?? 0} />
        <div className="flex flex-col justify-end gap-2 pb-2">
          <Checkbox label="Publicado" name="published" defaultChecked={book?.published ?? true} />
        </div>
      </div>

      {state.error ? <p className="text-sm text-accent">{state.error}</p> : null}

      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "Guardando…" : "Guardar libro"}
      </Button>
    </form>
  );
}
