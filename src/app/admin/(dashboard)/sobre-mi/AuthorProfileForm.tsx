"use client";

import { useActionState } from "react";
import type { SiteSettings } from "@prisma/client";

import { updateAuthorProfile } from "@/actions/siteSettings";
import { initialActionState } from "@/lib/action-state";
import { Textarea } from "@/components/ui/Field";
import { ImageField } from "@/components/admin/ImageField";
import { Button } from "@/components/ui/Button";

export function AuthorProfileForm({ settings }: { settings: SiteSettings | null }) {
  const [state, formAction, pending] = useActionState(updateAuthorProfile, initialActionState);

  return (
    <form action={formAction} className="flex max-w-4xl flex-col gap-4 rounded-2xl border border-border bg-surface p-6 sm:p-8">
      <ImageField label="Foto de la autora" name="authorPhotoUrl" defaultValue={settings?.authorPhotoUrl} />
      <Textarea
        label="Biografía (markdown)"
        name="authorBio"
        defaultValue={settings?.authorBio ?? ""}
        className="min-h-48"
      />

      {state.error ? <p className="text-sm text-accent">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-accent">{state.success}</p> : null}

      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "Guardando…" : "Guardar perfil"}
      </Button>
    </form>
  );
}
