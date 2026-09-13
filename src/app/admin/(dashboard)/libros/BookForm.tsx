"use client";

import { useActionState } from "react";
import type { Book } from "@prisma/client";

import { initialActionState } from "@/lib/action-state";
import { Input, Textarea, Checkbox } from "@/components/ui/Field";
import { ImageField } from "@/components/admin/ImageField";
import { Button } from "@/components/ui/Button";
import type { ActionState } from "@/lib/action-state";

export function BookForm({
  book,
  action,
}: {
  book?: Book;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [state, formAction, pending] = useActionState(action, initialActionState);

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
      <Textarea
        label="Descripción / sinopsis"
        name="description"
        defaultValue={book?.description}
        required
      />
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
