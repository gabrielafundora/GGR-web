import { clsx } from "clsx";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

// Cualquier link absoluto (http/https) escrito dentro del markdown se
// considera externo y se abre en pestaña nueva; los links relativos
// (rutas internas del sitio) se quedan en la misma pestaña.
const components: Components = {
  a: ({ href, children, ...props }) => {
    const isExternal = typeof href === "string" && /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        {...props}
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    );
  },
};

export function MarkdownContent({
  content,
  className,
}: {
  content: string;
  /** Ej. "prose-sm" para achicar el texto respecto al tamaño por defecto. */
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "prose max-w-none prose-headings:font-serif prose-p:text-muted prose-p:leading-relaxed prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-blockquote:border-accent prose-blockquote:text-muted",
        className
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
