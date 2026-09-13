"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { siteSettingsSchema, authorProfileSchema } from "@/lib/validation";
import type { ActionState } from "@/lib/action-state";

export async function updateSiteSettings(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  const parsed = siteSettingsSchema.safeParse({
    siteName: formData.get("siteName"),
    tagline: formData.get("tagline"),
    heroHeadline: formData.get("heroHeadline"),
    heroSubtext: formData.get("heroSubtext"),
    heroImageUrl: formData.get("heroImageUrl"),
    contactEmail: formData.get("contactEmail"),
    instagramUrl: formData.get("instagramUrl"),
    facebookUrl: formData.get("facebookUrl"),
    twitterUrl: formData.get("twitterUrl"),
    linkedinUrl: formData.get("linkedinUrl"),
    youtubeUrl: formData.get("youtubeUrl"),
    goodreadsUrl: formData.get("goodreadsUrl"),
    amazonAuthorUrl: formData.get("amazonAuthorUrl"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  // Fila única (id fijo = 1): siempre upsert, nunca create libre.
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    create: { id: 1, ...parsed.data },
    update: parsed.data,
  });

  // El header/footer y todas las páginas leen SiteSettings.
  revalidatePath("/", "layout");
  return { success: "Ajustes guardados." };
}

export async function updateAuthorProfile(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  const parsed = authorProfileSchema.safeParse({
    authorPhotoUrl: formData.get("authorPhotoUrl"),
    authorBio: formData.get("authorBio"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  // Fila única (id fijo = 1): siempre upsert, nunca create libre. Si la fila
  // todavía no existe, siteName necesita un valor (columna obligatoria).
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    create: { id: 1, siteName: "Gabriela Guerra Rey", ...parsed.data },
    update: parsed.data,
  });

  revalidatePath("/sobre-mi");
  return { success: "Perfil de autora guardado." };
}
