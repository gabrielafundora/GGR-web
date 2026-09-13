-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "coautores" TEXT[] DEFAULT ARRAY[]::TEXT[];
