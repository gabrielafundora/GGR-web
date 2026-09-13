"use client";

import { useActionState } from "react";
import type { Course } from "@prisma/client";

import { initialActionState } from "@/lib/action-state";
import { Input, Textarea, Checkbox } from "@/components/ui/Field";
import { ImageField } from "@/components/admin/ImageField";
import { Button } from "@/components/ui/Button";
import type { ActionState } from "@/lib/action-state";

export function CourseForm({
  course,
  action,
}: {
  course?: Course;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [state, formAction, pending] = useActionState(action, initialActionState);

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-5">
      <Input
        label="Slug (identificador interno)"
        name="slug"
        defaultValue={course?.slug}
        placeholder="taller-de-narrativa"
        hint="Solo minúsculas, números y guiones."
        required
      />
      <Input label="Título del taller/curso" name="title" defaultValue={course?.title} required />
      <Textarea label="Descripción" name="description" defaultValue={course?.description} required />
      <ImageField label="Imagen (opcional)" name="imageUrl" defaultValue={course?.imageUrl} />
      <Input
        label="Link a más información"
        name="externalUrl"
        type="url"
        defaultValue={course?.externalUrl}
        placeholder="https://..."
        required
      />
      <Input
        label="Modalidad (opcional)"
        name="modality"
        defaultValue={course?.modality ?? ""}
        placeholder="Online / Presencial"
      />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Orden" name="order" type="number" defaultValue={course?.order ?? 0} />
        <div className="flex flex-col justify-end gap-2 pb-2">
          <Checkbox label="Destacado" name="featured" defaultChecked={course?.featured ?? false} />
          <Checkbox label="Publicado" name="published" defaultChecked={course?.published ?? true} />
        </div>
      </div>

      {state.error ? <p className="text-sm text-accent">{state.error}</p> : null}

      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "Guardando…" : "Guardar curso"}
      </Button>
    </form>
  );
}
