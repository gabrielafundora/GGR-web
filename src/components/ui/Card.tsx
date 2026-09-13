import { clsx } from "clsx";
import type { HTMLAttributes, ReactNode } from "react";

export function Card({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div
      className={clsx(
        "border border-border bg-surface transition-colors hover:border-foreground/40",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-ink",
        className
      )}
    >
      {children}
    </span>
  );
}
