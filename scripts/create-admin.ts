/**
 * Crea o actualiza la contraseña de un AdminUser.
 *
 * Uso:
 *   npm run admin:set-password -- correo@ejemplo.com "una-contraseña-segura"
 *
 * Corre esto localmente apuntando DATABASE_URL a tu base de producción
 * (variable de entorno) para rotar las credenciales antes de lanzar el
 * sitio, o cuando quieras cambiarlas después.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const [email, password] = process.argv.slice(2);
  if (!email || !password) {
    console.error('Uso: npm run admin:set-password -- correo@ejemplo.com "contraseña"');
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("La contraseña debe tener al menos 8 caracteres.");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const normalizedEmail = email.toLowerCase().trim();

  const admin = await prisma.adminUser.upsert({
    where: { email: normalizedEmail },
    create: { email: normalizedEmail, passwordHash },
    update: { passwordHash },
  });

  console.log(`Listo. Credenciales actualizadas para: ${admin.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
