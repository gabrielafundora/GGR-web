import type { Metadata } from "next";

import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Iniciar sesión | Administrador",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8">
        <h1 className="font-serif text-2xl text-foreground">Panel de administrador</h1>
        <p className="mt-1 text-sm text-muted">Ingresa tus credenciales para continuar.</p>
        <LoginForm />
      </div>
    </div>
  );
}
