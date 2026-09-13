"use server";

import { randomUUID } from "node:crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";

import { requireAdmin } from "@/lib/require-admin";
import { s3, STORAGE_BUCKET, publicObjectUrl } from "@/lib/storage";

const MAX_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export type UploadResult = { url?: string; error?: string };

/**
 * Sube una imagen a Neon Object Storage (S3-compatible) y devuelve su URL
 * pública. El bucket es `public_read`, así que la URL resultante sirve
 * directo como <img src>, en desarrollo y en producción por igual.
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
  if (!STORAGE_BUCKET) {
    return {
      error:
        "Falta configurar el almacenamiento de imágenes (NEON_STORAGE_BUCKET / variables AWS_*). Usa el campo de URL mientras tanto.",
    };
  }

  const ext = EXT_BY_TYPE[file.type] ?? "bin";
  const key = `uploads/${randomUUID()}.${ext}`;

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    await s3.send(
      new PutObjectCommand({
        Bucket: STORAGE_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      })
    );
    return { url: publicObjectUrl(key) };
  } catch (error) {
    console.error("uploadImage: fallo al subir a Neon Object Storage", error);
    return {
      error: "No se pudo subir la imagen. Intenta de nuevo o usa el campo de URL.",
    };
  }
}
