import { S3Client } from "@aws-sdk/client-s3";

// Neon Object Storage es S3-compatible: un mismo cliente sirve tanto en
// desarrollo como en producción, solo cambian las credenciales/endpoint en
// las variables de entorno (ver .env.example).
export const s3 = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  },
  forcePathStyle: true,
  // Ver comentario equivalente en la doc de Neon: versiones recientes del
  // SDK intentan adjuntar un checksum al PUT calculado sobre un cuerpo
  // vacío si no se indica esto, lo que rechaza subidas con contenido real.
  requestChecksumCalculation: "WHEN_REQUIRED",
});

export const STORAGE_BUCKET = process.env.NEON_STORAGE_BUCKET ?? "";

/** URL pública de un objeto en el bucket (el bucket es `public_read`). */
export function publicObjectUrl(key: string): string {
  const endpoint = (process.env.AWS_ENDPOINT_URL_S3 ?? "").replace(/\/$/, "");
  return `${endpoint}/${STORAGE_BUCKET}/${key}`;
}
