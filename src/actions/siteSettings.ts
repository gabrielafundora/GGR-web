"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { siteSettingsSchema } from "@/lib/validation";
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
    authorBio: formData.get("authorBio"),
    authorPhotoUrl: formData.get("authorPhotoUrl"),
    contactEmail: formData.get("contactEmail"),
    instagramUrl: formData.get("instagramUrl"),
    facebookUrl: formData.get("facebookUrl"),
    twitterUrl: formData.get("twitterUrl"),
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
