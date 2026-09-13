import Link from "next/link";
import { clsx } from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "primaryInverse" | "outline" | "link" | "outlineInverse" | "linkInverse";

// Botones en blanco/negro/gris en reposo — el acento (#FF785A) entra al
// hacer hover, como toque de color, además de en texto (kickers,
// subtítulos, subrayados).
const variantClasses: Record<Variant, string> = {
  primary: "bg-foreground text-background hover:bg-accent hover:text-ink px-6 py-3",
  outline:
    "border border-foreground text-foreground px-6 py-3 hover:border-accent hover:bg-accent hover:text-ink",
  link: "text-foreground underline decoration-accent decoration-2 underline-offset-4 hover:text-accent px-0 py-0",
  // Mismos "primary"/"outline"/"link" pero para usar sobre fondos oscuros
  // (hero con imagen, secciones "ink"): tono claro en vez del oscuro por
  // defecto.
  primaryInverse: "bg-ink-foreground text-ink hover:bg-accent px-6 py-3",
  outlineInverse:
    "border border-ink-foreground text-ink-foreground px-6 py-3 hover:border-accent hover:bg-accent hover:text-ink",
  linkInverse:
    "text-ink-foreground underline decoration-accent decoration-2 underline-offset-4 hover:text-accent px-0 py-0",
};

const base =
  "group inline-flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; children: ReactNode }) {
  return (
    <button className={clsx(base, variantClasses[variant], className)} {...props}>
      {children}
    </button>
  );
}

export function LinkButton({
  href,
  variant = "primary",
  className,
  children,
  external,
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
  external?: boolean;
}) {
  const classes = clsx(base, variantClasses[variant], className);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}

/** Flechita que se corre un poco al hover — para los CTA tipo "Ver más →". */
export function ButtonArrow() {
  return (
    <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">
      →
    </span>
  );
}
