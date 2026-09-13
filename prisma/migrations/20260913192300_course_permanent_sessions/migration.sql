-- AlterTable
ALTER TABLE "Course" DROP COLUMN "featured",
ADD COLUMN     "isPermanent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sessionsCount" INTEGER;
