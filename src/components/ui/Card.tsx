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
        "rounded-2xl border border-border bg-surface transition-colors hover:border-accent/50",
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
        "inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wider text-black",
        className
      )}
    >
      {children}
    </span>
  );
}
