-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "metaDescription" TEXT,
ADD COLUMN     "metaImageUrl" TEXT,
ADD COLUMN     "metaTitle" TEXT;

-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "metaDescription" TEXT,
ADD COLUMN     "metaImageUrl" TEXT,
ADD COLUMN     "metaTitle" TEXT;
