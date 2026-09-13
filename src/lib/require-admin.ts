import { auth } from "@/auth";

/**
 * Verifica la sesión de admin dentro de cada server action, en vez de
 * confiar únicamente en `proxy.ts`. Las Server Functions de Next.js no son
 * rutas separadas del matcher del proxy, así que un cambio futuro en el
 * matcher (o un refactor que mueva una acción a otra ruta) podría dejar una
 * mutación desprotegida si solo dependiéramos del proxy.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("No autorizado: se requiere iniciar sesión como administrador.");
  }
  return session.user;
}
