import { clsx } from "clsx";
import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

function FieldWrapper({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {hint && !error ? <p className="text-xs text-muted">{hint}</p> : null}
      {error ? <p className="text-xs text-accent">{error}</p> : null}
    </div>
  );
}

const inputClasses =
  "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none";

export function Input({
  label,
  hint,
  error,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string; error?: string }) {
  const id = props.id ?? props.name ?? label;
  return (
    <FieldWrapper label={label} htmlFor={id} hint={hint} error={error}>
      <input id={id} className={clsx(inputClasses, className)} {...props} />
    </FieldWrapper>
  );
}

const textareaClasses = `${inputClasses} min-h-32 resize-y font-mono text-[13px]`;

export function Textarea({
  label,
  hint,
  error,
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; hint?: string; error?: string }) {
  const id = props.id ?? props.name ?? label;
  return (
    <FieldWrapper label={label} htmlFor={id} hint={hint} error={error}>
      <textarea id={id} className={clsx(textareaClasses, className)} {...props} />
    </FieldWrapper>
  );
}

export function Checkbox({
  label,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const id = props.id ?? props.name ?? label;
  return (
    <label htmlFor={id} className="flex items-center gap-2 text-sm text-foreground">
      <input
        id={id}
        type="checkbox"
        className="h-4 w-4 rounded border-border bg-surface accent-[#ff785a]"
        {...props}
      />
      {label}
    </label>
  );
}
