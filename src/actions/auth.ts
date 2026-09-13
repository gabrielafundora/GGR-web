"use server";

import { AuthError } from "next-auth";

import { signIn } from "@/auth";
import type { ActionState } from "@/lib/action-state";

export async function loginAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  try {
    await signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
      redirectTo: "/admin",
    });
  } catch (error) {
    // `signIn` con `redirectTo` lanza internamente un error de redirección
    // en caso de éxito — solo interceptamos errores reales de autenticación.
    if (error instanceof AuthError) {
      return { error: "Usuario o contraseña incorrectos." };
    }
    throw error;
  }
  return {};
}
