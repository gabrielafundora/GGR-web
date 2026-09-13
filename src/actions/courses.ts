"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { courseSchema } from "@/lib/validation";
import type { ActionState } from "@/lib/action-state";

function parseCourseForm(formData: FormData) {
  return courseSchema.safeParse({
    slug: formData.get("slug"),
    title: formData.get("title"),
    description: formData.get("description"),
    imageUrl: formData.get("imageUrl"),
    externalUrl: formData.get("externalUrl"),
    modality: formData.get("modality"),
    isPermanent: formData.get("isPermanent") === "on",
    sessionsCount: formData.get("sessionsCount") || undefined,
    published: formData.get("published") === "on",
    order: formData.get("order") || 0,
  });
}

function revalidateCoursePaths() {
  revalidatePath("/");
  revalidatePath("/cursos");
}

export async function createCourse(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  const parsed = parseCourseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  try {
    await prisma.course.create({ data: parsed.data });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { error: "Ya existe un curso con ese slug." };
    }
    throw e;
  }

  revalidateCoursePaths();
  redirect("/admin/cursos");
}

export async function updateCourse(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  const parsed = parseCourseForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  try {
    await prisma.course.update({ where: { id }, data: parsed.data });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { error: "Ya existe un curso con ese slug." };
    }
    throw e;
  }

  revalidateCoursePaths();
  redirect("/admin/cursos");
}

export async function deleteCourse(id: string): Promise<void> {
  await requireAdmin();
  await prisma.course.delete({ where: { id } });
  revalidateCoursePaths();
  redirect("/admin/cursos");
}
