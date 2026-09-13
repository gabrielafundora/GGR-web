"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { pageMetaSchema } from "@/lib/validation";
import type { ActionState } from "@/lib/action-state";

const PAGE_PATHS: Record<string, string> = {
  home: "/",
  catalogo: "/catalogo",
  articulos: "/articulos",
  cursos: "/cursos",
  "sobre-mi": "/sobre-mi",
};

export async function updatePageMeta(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  const parsed = pageMetaSchema.safeParse({
    page: formData.get("page"),
    title: formData.get("title"),
    description: formData.get("description"),
    ogImageUrl: formData.get("ogImageUrl"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const { page, ...data } = parsed.data;
  await prisma.pageMeta.upsert({
    where: { page },
    create: { page, ...data },
    update: data,
  });

  revalidatePath(PAGE_PATHS[page] ?? "/");
  return { success: "Metadatos guardados." };
}
