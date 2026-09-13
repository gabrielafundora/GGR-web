-- RenameColumn (preserva la fila existente en vez de un DROP+ADD, que
-- fallaría por NOT NULL sobre una tabla con datos y perdería el valor)
ALTER TABLE "AdminUser" RENAME COLUMN "email" TO "username";

-- RenameIndex
ALTER INDEX "AdminUser_email_key" RENAME TO "AdminUser_username_key";
