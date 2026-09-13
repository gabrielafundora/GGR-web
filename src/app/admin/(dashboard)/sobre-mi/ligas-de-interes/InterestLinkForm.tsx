"use client";

import { useActionState } from "react";
import type { InterestLink } from "@prisma/client";

import { initialActionState } from "@/lib/action-state";
import { Input, Checkbox } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import type { ActionState } from "@/lib/action-state";

export function InterestLinkForm({
  link,
  action,
}: {
  link?: InterestLink;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [state, formAction, pending] = useActionState(action, initialActionState);

  return (
    <form action={formAction} className="flex max-w-4xl flex-col gap-5">
      <Input
        label="Título"
        name="title"
        defaultValue={link?.title}
        placeholder="Wikipedia"
        required
      />
      <Input
        label="Link"
        name="url"
        type="url"
        defaultValue={link?.url}
        placeholder="https://..."
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Orden" name="order" type="number" defaultValue={link?.order ?? 0} />
        <div className="flex flex-col justify-end pb-2">
          <Checkbox label="Publicado" name="published" defaultChecked={link?.published ?? true} />
        </div>
      </div>

      {state.error ? <p className="text-sm text-accent">{state.error}</p> : null}

      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "Guardando…" : "Guardar liga"}
      </Button>
    </form>
  );
}
