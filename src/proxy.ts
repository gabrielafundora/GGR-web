// En Next.js 16 el archivo `middleware.ts` fue renombrado a `proxy.ts`
// (misma función, distinto nombre de archivo/export). Protege todo
// `/admin/**` exigiendo sesión, excepto la propia página de login.
//
// Importante: esto es solo la primera línea de defensa. Cada server action
// de administración vuelve a verificar la sesión por su cuenta (ver
// src/lib/require-admin.ts), porque un cambio futuro en el matcher no debe
// dejar mutaciones desprotegidas.
export { auth as proxy } from "@/auth";

export const config = {
  matcher: ["/admin/:path*"],
};
