"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { MarkdownContent } from "@/components/public/MarkdownContent";

/**
 * Los fragmentos gratis pueden ser un capítulo entero (varias páginas), así
 * que se muestran recortados por defecto (con una franja que se difumina) y
 * un botón para desplegarlos completos, en vez de volcar todo el texto de
 * una vez en la página.
 */
export function ExcerptReader({ content }: { content: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <div className={expanded ? undefined : "relative max-h-[26rem] overflow-hidden"}>
        <MarkdownContent content={content} className="prose-sm" />
        {!expanded ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent"
          />
        ) : null}
      </div>

      <Button
        variant="outline"
        className="mt-6"
        onClick={() => setExpanded((v) => !v)}
      >
        {expanded ? "Mostrar menos" : "Leer el fragmento completo"}
      </Button>
    </div>
  );
}
