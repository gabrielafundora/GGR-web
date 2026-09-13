"use server";

import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { requireAdmin } from "@/lib/require-admin";

const MAX_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export type UploadResult = { url?: string; error?: string };

/**
 * Sube una imagen a public/uploads/ para usarla en desarrollo local.
 *
 * IMPORTANTE: esto NO funciona en producción sobre un host serverless
 * (ej. Vercel), cuyo filesystem es de solo lectura fuera de /tmp y no
 * persiste entre despliegues. Ahí, usa siempre el campo de URL de imagen
 * (ver ImageField) apuntando a un servicio externo (Cloudinary, Vercel
 * Blob, etc.) — ver README.md.
 */
export async function uploadImage(formData: FormData): Promise<UploadResult> {
  await requireAdmin();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Selecciona un archivo de imagen." };
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return { error: "Formato no soportado. Usa JPG, PNG, WEBP o GIF." };
  }
  if (file.size > MAX_BYTES) {
    return { error: "La imagen no debe superar 5MB." };
  }

  try {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const ext = path.extname(file.name) || `.${file.type.split("/")[1]}`;
    const filename = `${randomUUID()}${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadsDir, filename), buffer);

    return { url: `/uploads/${filename}` };
  } catch {
    return {
      error:
        "No se pudo guardar el archivo en este servidor (normal en hosting serverless como Vercel). Usa el campo de URL de imagen en su lugar.",
    };
  }
}
