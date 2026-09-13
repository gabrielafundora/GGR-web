"use client";

import { useActionState } from "react";

import { loginAction } from "@/actions/auth";
import { initialActionState } from "@/lib/action-state";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialActionState);

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-4">
      <Input label="Correo" name="email" type="email" autoComplete="username" required />
      <Input label="Contraseña" name="password" type="password" autoComplete="current-password" required />
      {state.error ? <p className="text-sm text-accent">{state.error}</p> : null}
      <Button type="submit" disabled={pending} className="mt-2 w-full">
        {pending ? "Ingresando…" : "Ingresar"}
      </Button>
    </form>
  );
}
