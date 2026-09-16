import { clsx } from "clsx";
import { useState } from "react";
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

function CharCounter({ count, max }: { count: number; max: number }) {
  return (
    <span className={clsx("shrink-0 text-xs tabular-nums", count > max ? "text-red-600" : "text-muted")}>
      {count}/{max}
    </span>
  );
}

function FieldWrapper({
  label,
  htmlFor,
  hint,
  error,
  counter,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  counter?: { count: number; max: number };
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
          {label}
        </label>
        {counter ? <CharCounter count={counter.count} max={counter.max} /> : null}
      </div>
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
  counterMax,
  defaultValue,
  onChange,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
  /** Si se pasa, muestra un contador "n/max" junto al label (pensado para campos de SEO). */
  counterMax?: number;
}) {
  const id = props.id ?? props.name ?? label;
  const [count, setCount] = useState(() => String(defaultValue ?? "").length);
  return (
    <FieldWrapper
      label={label}
      htmlFor={id}
      hint={hint}
      error={error}
      counter={counterMax !== undefined ? { count, max: counterMax } : undefined}
    >
      <input
        id={id}
        className={clsx(inputClasses, className)}
        defaultValue={defaultValue}
        onChange={(e) => {
          if (counterMax !== undefined) setCount(e.target.value.length);
          onChange?.(e);
        }}
        {...props}
      />
    </FieldWrapper>
  );
}

const textareaClasses = `${inputClasses} min-h-32 resize-y font-mono text-[13px]`;

export function Textarea({
  label,
  hint,
  error,
  className,
  counterMax,
  defaultValue,
  onChange,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  hint?: string;
  error?: string;
  /** Si se pasa, muestra un contador "n/max" junto al label (pensado para campos de SEO). */
  counterMax?: number;
}) {
  const id = props.id ?? props.name ?? label;
  const [count, setCount] = useState(() => String(defaultValue ?? "").length);
  return (
    <FieldWrapper
      label={label}
      htmlFor={id}
      hint={hint}
      error={error}
      counter={counterMax !== undefined ? { count, max: counterMax } : undefined}
    >
      <textarea
        id={id}
        className={clsx(textareaClasses, className)}
        defaultValue={defaultValue}
        onChange={(e) => {
          if (counterMax !== undefined) setCount(e.target.value.length);
          onChange?.(e);
        }}
        {...props}
      />
    </FieldWrapper>
  );
}

export function Select({
  label,
  hint,
  error,
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label: string; hint?: string; error?: string; children: ReactNode }) {
  const id = props.id ?? props.name ?? label;
  return (
    <FieldWrapper label={label} htmlFor={id} hint={hint} error={error}>
      <select id={id} className={clsx(inputClasses, className)} {...props}>
        {children}
      </select>
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
