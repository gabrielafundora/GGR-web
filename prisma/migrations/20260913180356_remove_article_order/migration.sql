-- Backfill defensivo: nunca debería haber filas con publishedAt nulo, pero por si acaso
UPDATE "Article" SET "publishedAt" = "createdAt" WHERE "publishedAt" IS NULL;

-- AlterTable
ALTER TABLE "Article" DROP COLUMN "order";
