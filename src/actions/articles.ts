"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { articleSchema } from "@/lib/validation";
import type { ActionState } from "@/lib/action-state";

function parseArticleForm(formData: FormData) {
  return articleSchema.safeParse({
    slug: formData.get("slug"),
    title: formData.get("title"),
    excerpt: formData.get("excerpt"),
    contentMd: formData.get("contentMd"),
    coverImageUrl: formData.get("coverImageUrl"),
    published: formData.get("published") === "on",
    publishedAt: formData.get("publishedAt"),
  });
}

function revalidateArticlePaths(slug: string) {
  revalidatePath("/");
  revalidatePath("/articulos");
  revalidatePath(`/articulos/${slug}`);
}

function toDate(value: string | undefined) {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export async function createArticle(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  const parsed = parseArticleForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const { publishedAt, ...rest } = parsed.data;
  try {
    await prisma.article.create({
      data: { ...rest, publishedAt: toDate(publishedAt) ?? new Date() },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { error: "Ya existe un artículo con ese slug." };
    }
    throw e;
  }

  revalidateArticlePaths(parsed.data.slug);
  redirect("/admin/articulos");
}

export async function updateArticle(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();
  const parsed = parseArticleForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const { publishedAt, ...rest } = parsed.data;
  try {
    await prisma.article.update({
      where: { id },
      data: { ...rest, ...(publishedAt ? { publishedAt: toDate(publishedAt) } : {}) },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return { error: "Ya existe un artículo con ese slug." };
    }
    throw e;
  }

  revalidateArticlePaths(parsed.data.slug);
  redirect("/admin/articulos");
}

export async function deleteArticle(id: string): Promise<void> {
  await requireAdmin();
  const article = await prisma.article.delete({ where: { id } });
  revalidateArticlePaths(article.slug);
  redirect("/admin/articulos");
}
