"use client";

import { useActionState } from "react";
import type { Course } from "@prisma/client";

import { initialActionState } from "@/lib/action-state";
import { Input, Textarea, Select, Checkbox } from "@/components/ui/Field";
import { ImageField } from "@/components/admin/ImageField";
import { Button } from "@/components/ui/Button";
import { COURSE_MODALITY_OPTIONS } from "@/lib/validation";
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
    <form action={formAction} className="flex max-w-4xl flex-col gap-5">
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
        label="Link para solicitar información"
        name="externalUrl"
        type="url"
        defaultValue={course?.externalUrl}
        placeholder="https://..."
        required
      />
      <Select label="Modalidad (opcional)" name="modality" defaultValue={course?.modality ?? ""}>
        <option value="">Selecciona una modalidad</option>
        {COURSE_MODALITY_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </Select>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Orden" name="order" type="number" defaultValue={course?.order ?? 0} />
        <Input
          label="Número de sesiones (opcional)"
          name="sessionsCount"
          type="number"
          min={1}
          defaultValue={course?.sessionsCount ?? ""}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Checkbox
          label="Taller permanente"
          name="isPermanent"
          defaultChecked={course?.isPermanent ?? false}
        />
        <p className="pl-6 text-xs text-muted">
          Si lo activas, en el sitio se muestra un aviso de &quot;Solicita información sobre
          nuevas fechas de inicio&quot; en vez de fechas fijas.
        </p>
        <Checkbox label="Publicado" name="published" defaultChecked={course?.published ?? true} />
      </div>

      {state.error ? <p className="text-sm text-accent">{state.error}</p> : null}

      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "Guardando…" : "Guardar curso"}
      </Button>
    </form>
  );
}
