"use client";

import { useActionState } from "react";

import { updatePageMeta } from "@/actions/pageMeta";
import { initialActionState } from "@/lib/action-state";
import { Input, Textarea } from "@/components/ui/Field";
import { ImageField } from "@/components/admin/ImageField";
import { Button } from "@/components/ui/Button";

export function PageMetaForm({
  page,
  label,
  path,
  title,
  description,
  ogImageUrl,
}: {
  page: string;
  label: string;
  path: string;
  title: string;
  description: string;
  ogImageUrl?: string | null;
}) {
  const [state, formAction, pending] = useActionState(updatePageMeta, initialActionState);

  return (
    <form action={formAction} className="rounded-2xl border border-border bg-surface p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-serif text-xl text-foreground">{label}</h2>
        <code className="text-xs text-muted">{path}</code>
      </div>

      <input type="hidden" name="page" value={page} />
      <div className="flex flex-col gap-4">
        <Input
          id={`${page}-title`}
          label="Title (título de la pestaña)"
          name="title"
          defaultValue={title}
          required
        />
        <Textarea
          id={`${page}-description`}
          label="Meta description"
          name="description"
          defaultValue={description}
          required
        />
        <ImageField
          id={`${page}-ogImageUrl`}
          label="Imagen Open Graph (opcional)"
          name="ogImageUrl"
          defaultValue={ogImageUrl}
        />
      </div>

      {state.error ? <p className="mt-3 text-sm text-accent">{state.error}</p> : null}
      {state.success ? <p className="mt-3 text-sm text-accent">{state.success}</p> : null}

      <Button type="submit" disabled={pending} className="mt-4 w-fit">
        {pending ? "Guardando…" : "Guardar"}
      </Button>
    </form>
  );
}
