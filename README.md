# Sitio web de Gabriela Guerra Rey

Sitio web para la autora Gabriela Guerra Rey: catálogo de libros (con enlace a
Amazon), artículos, información de cursos y talleres, biografía, y un panel
de administrador para gestionar todo el contenido y los metadatos (SEO) de
cada sección sin tocar código.

## Stack

- **Next.js 16** (App Router) + React 19 + TypeScript
- **Tailwind CSS v4**
- **Prisma** (SQLite en desarrollo, Postgres en producción)
- **Auth.js (next-auth v5)** — login de administrador con usuario/contraseña
- **react-markdown** — para el contenido de los artículos y la biografía

## Setup local

1. Instala dependencias:

   ```bash
   npm install
   ```

2. Copia el archivo de variables de entorno:

   ```bash
   cp .env.example .env
   ```

   Genera un `AUTH_SECRET` propio con `openssl rand -base64 32` y pégalo en `.env`.
   `DATABASE_URL` ya viene configurado para usar SQLite localmente — no necesitas
   ninguna base de datos externa para desarrollar.

3. Crea la base de datos local y siembra contenido de ejemplo:

   ```bash
   npm run db:migrate
   ```

   Este comando corre las migraciones y automáticamente el seed
   (`prisma/seed.ts`). **Al final imprime en la consola un correo y
   contraseña de administrador de desarrollo** — anótalos, los necesitarás
   para entrar a `/admin`.

4. Levanta el servidor:

   ```bash
   npm run dev
   ```

   Abre [http://localhost:3000](http://localhost:3000) para el sitio público
   y [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
   para el panel de administrador.

## Estructura del proyecto

```
prisma/schema.prisma       Modelos de datos (libros, artículos, cursos, metadatos, ajustes)
prisma/seed.ts             Contenido de ejemplo + usuario admin de desarrollo
src/app/(public)/          Páginas públicas: inicio, catálogo, artículos, cursos, sobre-mí
src/app/admin/             Panel de administrador (protegido por login)
src/actions/               Server Actions: todas las mutaciones del admin
src/lib/metadata.ts        Arma el <title>/description/og:image de cada sección
src/proxy.ts               Protege /admin/** (requiere sesión)
```

## El panel de administrador

Desde `/admin` (una vez con sesión iniciada) Gabriela puede:

- Crear, editar y eliminar **libros** (con su link a Amazon), **artículos**
  (en markdown) y **cursos/talleres** (con su link a "más información").
- Editar los **metadatos** (title, meta description, imagen Open Graph) de
  cada sección principal del sitio, en `/admin/metadatos`.
- Editar los **ajustes generales**: nombre del sitio, textos de la portada,
  biografía, foto de autora y redes sociales, en `/admin/ajustes`.

### Imágenes

Cada campo de imagen (portada de libro, foto de autora, etc.) admite dos
modos:

- **URL de imagen** (recomendado): pega el link de una imagen ya alojada en
  cualquier servicio. Funciona igual en desarrollo y en producción.
- **Subir archivo**: solo para desarrollo local — guarda el archivo en
  `public/uploads/`. **No funciona en hosting serverless (ej. Vercel)**,
  cuyo filesystem no persiste. Para producción, sube la imagen a un servicio
  externo (o integra Vercel Blob/Cloudinary más adelante) y usa el campo de
  URL.

## Deploy a producción (Vercel + Postgres)

El proyecto usa SQLite solo para desarrollo local — **no persiste** en el
filesystem efímero de Vercel. Antes del primer deploy real:

1. Crea una base Postgres gratuita en [Neon](https://neon.tech) o
   [Supabase](https://supabase.com) (o usa Vercel Postgres) y copia su
   `DATABASE_URL`.

2. En `prisma/schema.prisma`, cambia:

   ```diff
   datasource db {
   - provider = "sqlite"
   + provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

3. Borra las migraciones generadas contra SQLite y crea una migración
   inicial fresca ya apuntando a Postgres (las migraciones de SQLite no son
   válidas en Postgres):

   ```bash
   rm -rf prisma/migrations
   DATABASE_URL="tu-url-de-postgres" npx prisma migrate dev --name init
   ```

4. En Vercel, configura las variables de entorno (Production y Preview):
   - `DATABASE_URL`: la URL de tu base Postgres.
   - `AUTH_SECRET`: genera una nueva con `openssl rand -base64 32` (no
     reutilices la de desarrollo).

5. Crea tu usuario administrador real contra esa base:

   ```bash
   DATABASE_URL="tu-url-de-postgres" npm run admin:set-password -- tu-correo@dominio.com "una-contraseña-segura"
   ```

6. Haz deploy normalmente (conectando el repo en Vercel). El `postinstall`
   corre `prisma generate` automáticamente.

### Rotar la contraseña de administrador más adelante

En cualquier momento, corre localmente (con `DATABASE_URL` apuntando a
producción):

```bash
DATABASE_URL="tu-url-de-postgres" npm run admin:set-password -- tu-correo@dominio.com "nueva-contraseña"
```

## Verificación / tests end-to-end

Con el servidor de desarrollo corriendo (`npm run dev`) y la base local ya
sembrada:

```bash
npx playwright install chromium   # solo la primera vez
npm run test:e2e
```

Esto recorre las páginas públicas, prueba el login del admin, hace un CRUD
completo de libros/artículos/cursos, y verifica que editar los metadatos de
una sección cambie el `<title>` de esa página.
