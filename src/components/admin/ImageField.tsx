"use client";

import { useState, useTransition } from "react";

import { uploadImage } from "@/actions/upload";

export function ImageField({
  name,
  id,
  label,
  defaultValue,
  required,
  hint,
}: {
  name: string;
  /** Id del input, por si `name` se repite en la misma página (ej. varios formularios). Por defecto usa `name`. */
  id?: string;
  label: string;
  defaultValue?: string | null;
  required?: boolean;
  hint?: string;
}) {
  const fieldId = id ?? name;
  const [url, setUrl] = useState(defaultValue ?? "");
  const [mode, setMode] = useState<"url" | "upload">("url");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string>();

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(undefined);
    const formData = new FormData();
    formData.append("file", file);
    startTransition(async () => {
      const result = await uploadImage(formData);
      if (result.error) {
        setError(result.error);
      } else if (result.url) {
        setUrl(result.url);
      }
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label htmlFor={fieldId} className="text-sm font-medium text-foreground">
          {label}
        </label>
        <div className="flex gap-1 rounded-full border border-border p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`rounded-full px-3 py-1 ${mode === "url" ? "bg-accent text-black" : "text-muted"}`}
          >
            URL
          </button>
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`rounded-full px-3 py-1 ${mode === "upload" ? "bg-accent text-black" : "text-muted"}`}
          >
            Subir (solo dev local)
          </button>
        </div>
      </div>

      {mode === "url" ? (
        <input
          id={fieldId}
          name={name}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required={required}
          placeholder="https://... o /images/..."
          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
        />
      ) : (
        <>
          <input
            id={fieldId}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="w-full rounded-lg border border-dashed border-border bg-surface px-3 py-2 text-sm text-foreground file:mr-3 file:rounded-full file:border-0 file:bg-accent file:px-3 file:py-1 file:text-xs file:font-medium file:text-black"
          />
          <input type="hidden" name={name} value={url} />
        </>
      )}

      {pending ? <p className="text-xs text-muted">Subiendo…</p> : null}
      {error ? <p className="text-xs text-accent">{error}</p> : null}
      {hint && !error ? <p className="text-xs text-muted">{hint}</p> : null}
      {url ? (
        <img
          src={url}
          alt="Vista previa"
          className="h-24 w-24 rounded-lg border border-border object-cover"
        />
      ) : null}
    </div>
  );
}
