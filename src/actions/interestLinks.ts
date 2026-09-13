"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { interestLinkSchema } from "@/lib/validation";
import type { ActionState } from "@/lib/action-state";

function parseInterestLinkForm(formData: FormData) {
  return interestLinkSchema.safeParse({
    title: formData.get("title"),
    url: formData.get("url"),
    published: formData.get("published") === "on",
    order: formData.get("order") || 0,
  });
}

function revalidateInterestLinkPaths() {
  revalidatePath("/sobre-mi");
}

export async function createInterestLink(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  const parsed = parseInterestLinkForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  await prisma.interestLink.create({ data: parsed.data });

  revalidateInterestLinkPaths();
  redirect("/admin/ligas-de-interes");
}

export async function updateInterestLink(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  const parsed = parseInterestLinkForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  await prisma.interestLink.update({ where: { id }, data: parsed.data });

  revalidateInterestLinkPaths();
  redirect("/admin/ligas-de-interes");
}

export async function deleteInterestLink(id: string): Promise<void> {
  await requireAdmin();
  await prisma.interestLink.delete({ where: { id } });
  revalidateInterestLinkPaths();
  redirect("/admin/ligas-de-interes");
}
