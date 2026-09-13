import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const slugField = z
  .string()
  .trim()
  .min(1, "Requerido")
  .regex(slugRegex, "Usa solo minúsculas, números y guiones (ej: mi-libro)");

const urlField = z.string().trim().url("Debe ser una URL válida (https://...)");
const optionalUrlField = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v ? v : undefined))
  .refine((v) => v === undefined || /^https?:\/\//.test(v) || v.startsWith("/"), {
    message: "Debe ser una URL (https://...) o una ruta local (/images/...)",
  });

export const bookSchema = z.object({
  slug: slugField,
  title: z.string().trim().min(1, "El título es obligatorio"),
  subtitle: z.string().trim().optional().transform((v) => v || undefined),
  description: z.string().trim().min(1, "La descripción es obligatoria"),
  coverImageUrl: z.string().trim().min(1, "La portada es obligatoria"),
  amazonUrl: urlField,
  year: z.coerce.number().int().optional().nullable(),
  genre: z.string().trim().optional().transform((v) => v || undefined),
  editorial: z.string().trim().optional().transform((v) => v || undefined),
  idioma: z.string().trim().optional().transform((v) => v || undefined),
  paginas: z.coerce.number().int().optional().nullable(),
  isbn: z.string().trim().optional().transform((v) => v || undefined),
  // Fragmento gratis (markdown): opcional, solo algunos libros lo tienen.
  excerptMd: z.string().trim().optional().transform((v) => v || undefined),
  // Coautores: además de Gabriela, algunos libros tienen otros autores.
  // El formulario manda un texto con nombres separados por coma.
  coautores: z
    .string()
    .trim()
    .optional()
    .transform((v) =>
      (v ?? "")
        .split(",")
        .map((name) => name.trim())
        .filter(Boolean)
    ),
  published: z.boolean().default(true),
  order: z.coerce.number().int().default(0),
});
export type BookInput = z.infer<typeof bookSchema>;

export const articleSchema = z.object({
  slug: slugField,
  title: z.string().trim().min(1, "El título es obligatorio"),
  excerpt: z.string().trim().min(1, "El extracto es obligatorio"),
  contentMd: z.string().trim().min(1, "El contenido es obligatorio"),
  coverImageUrl: optionalUrlField,
  published: z.boolean().default(true),
  publishedAt: z.string().trim().optional().transform((v) => v || undefined),
});
export type ArticleInput = z.infer<typeof articleSchema>;

export const COURSE_MODALITY_OPTIONS = [
  "Online, en vivo",
  "Presencial",
  "Online, autoaprendizaje",
] as const;

export const courseSchema = z.object({
  slug: slugField,
  title: z.string().trim().min(1, "El título es obligatorio"),
  description: z.string().trim().min(1, "La descripción es obligatoria"),
  imageUrl: optionalUrlField,
  externalUrl: urlField,
  modality: z
    .union([z.literal(""), z.enum(COURSE_MODALITY_OPTIONS)])
    .optional()
    .transform((v) => (v ? v : undefined)),
  isPermanent: z.boolean().default(false),
  sessionsCount: z.coerce.number().int().positive().optional(),
  published: z.boolean().default(true),
  order: z.coerce.number().int().default(0),
});
export type CourseInput = z.infer<typeof courseSchema>;

export const interestLinkSchema = z.object({
  title: z.string().trim().min(1, "El título es obligatorio"),
  url: urlField,
  published: z.boolean().default(true),
  order: z.coerce.number().int().default(0),
});
export type InterestLinkInput = z.infer<typeof interestLinkSchema>;

export const pageMetaSchema = z.object({
  page: z.enum(["home", "catalogo", "articulos", "cursos", "sobre-mi"]),
  title: z.string().trim().min(1, "El título es obligatorio"),
  description: z.string().trim().min(1, "La descripción es obligatoria"),
  ogImageUrl: optionalUrlField,
});
export type PageMetaInput = z.infer<typeof pageMetaSchema>;

export const siteSettingsSchema = z.object({
  siteName: z.string().trim().min(1, "El nombre del sitio es obligatorio"),
  tagline: z.string().trim().optional().transform((v) => v || undefined),
  heroHeadline: z.string().trim().optional().transform((v) => v || undefined),
  heroSubtext: z.string().trim().optional().transform((v) => v || undefined),
  heroImageUrl: optionalUrlField,
  contactEmail: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v : undefined))
    .refine((v) => v === undefined || z.string().email().safeParse(v).success, {
      message: "Correo inválido",
    }),
  instagramUrl: optionalUrlField,
  facebookUrl: optionalUrlField,
  twitterUrl: optionalUrlField,
  linkedinUrl: optionalUrlField,
  youtubeUrl: optionalUrlField,
  goodreadsUrl: optionalUrlField,
  amazonAuthorUrl: optionalUrlField,
});
export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;

export const authorProfileSchema = z.object({
  authorPhotoUrl: optionalUrlField,
  authorBio: z.string().trim().optional().transform((v) => v || undefined),
});
export type AuthorProfileInput = z.infer<typeof authorProfileSchema>;
