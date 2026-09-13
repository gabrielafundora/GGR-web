import { clsx } from "clsx";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

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
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{content}</ReactMarkdown>
    </div>
  );
}
