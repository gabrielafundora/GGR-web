"use client";

import { useActionState, useState } from "react";
import type { Article } from "@prisma/client";

import { initialActionState } from "@/lib/action-state";
import { Input, Textarea, Checkbox } from "@/components/ui/Field";
import { ImageField } from "@/components/admin/ImageField";
import { Button } from "@/components/ui/Button";
import { MarkdownContent } from "@/components/public/MarkdownContent";
import type { ActionState } from "@/lib/action-state";

function toDateInputValue(date?: Date | null) {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

export function ArticleForm({
  article,
  action,
}: {
  article?: Article;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [state, formAction, pending] = useActionState(action, initialActionState);
  const [content, setContent] = useState(article?.contentMd ?? "");
  const [preview, setPreview] = useState(false);

  return (
    <form action={formAction} className="flex max-w-4xl flex-col gap-5">
      <Input
        label="Slug (URL)"
        name="slug"
        defaultValue={article?.slug}
        placeholder="mi-articulo"
        hint="Solo minúsculas, números y guiones. Define la URL: /articulos/tu-slug"
        required
      />
      <Input label="Título" name="title" defaultValue={article?.title} required />
      <Textarea label="Extracto (resumen corto)" name="excerpt" defaultValue={article?.excerpt} required />
      <ImageField
        label="Imagen de portada (opcional)"
        name="coverImageUrl"
        defaultValue={article?.coverImageUrl}
      />

      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="contentMd" className="text-sm font-medium text-foreground">
            Contenido (markdown)
          </label>
          <button
            type="button"
            onClick={() => setPreview((v) => !v)}
            className="text-xs text-accent hover:text-accent-hover"
          >
            {preview ? "Volver a editar" : "Vista previa"}
          </button>
        </div>
        {preview ? (
          <div className="rounded-lg border border-border bg-surface p-4">
            <MarkdownContent content={content} />
          </div>
        ) : (
          <textarea
            id="contentMd"
            name="contentMd"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="min-h-64 w-full resize-y rounded-lg border border-border bg-surface px-3 py-2 font-mono text-[13px] text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
            placeholder={"Escribe aquí en **markdown**.\n\n## Un subtítulo"}
          />
        )}
        {preview ? <input type="hidden" name="contentMd" value={content} /> : null}
        <p className="mt-1.5 text-xs text-muted">
          El título ya se muestra arriba de la página; empieza el contenido directo, usando ## para subtítulos.
        </p>
      </div>

      <Input
        label="Fecha de publicación"
        name="publishedAt"
        type="date"
        defaultValue={toDateInputValue(article?.publishedAt ?? article?.createdAt)}
      />
      <Checkbox label="Publicado" name="published" defaultChecked={article?.published ?? true} />

      {state.error ? <p className="text-sm text-accent">{state.error}</p> : null}

      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "Guardando…" : "Guardar artículo"}
      </Button>
    </form>
  );
}
