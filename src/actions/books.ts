"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { bookSchema } from "@/lib/validation";
import type { ActionState } from "@/lib/action-state";

function parseBookForm(formData: FormData) {
  return bookSchema.safeParse({
    slug: formData.get("slug"),
    title: formData.get("title"),
    subtitle: formData.get("subtitle"),
    description: formData.get("description"),
    coverImageUrl: formData.get("coverImageUrl"),
    amazonUrl: formData.get("amazonUrl"),
    year: formData.get("year") || undefined,
    genre: formData.get("genre"),
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
    order: formData.get("order") || 0,
  });
}

function revalidateBookPaths(slug: string) {
  revalidatePath("/");
  revalidatePath("/catalogo");
  revalidatePath(`/catalogo/${slug}`);
}

export async function createBook(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = parseBookForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  try {
    await prisma.book.create({ data: parsed.data });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { error: "Ya existe un libro con ese slug." };
    }
    throw e;
  }

  revalidateBookPaths(parsed.data.slug);
  redirect("/admin/libros");
}

export async function updateBook(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  const parsed = parseBookForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  try {
    await prisma.book.update({ where: { id }, data: parsed.data });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { error: "Ya existe un libro con ese slug." };
    }
    throw e;
  }

  revalidateBookPaths(parsed.data.slug);
  redirect("/admin/libros");
}

export async function deleteBook(id: string): Promise<void> {
  await requireAdmin();
  const book = await prisma.book.delete({ where: { id } });
  revalidateBookPaths(book.slug);
  redirect("/admin/libros");
}
