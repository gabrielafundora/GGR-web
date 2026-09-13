# Sitio web de Gabriela Guerra Rey

Sitio web para la autora Gabriela Guerra Rey: catálogo de libros (con enlace a
Amazon), artículos, información de cursos y talleres, biografía, y un panel
de administrador para gestionar todo el contenido y los metadatos (SEO) de
cada sección sin tocar código.

## Stack

- **Next.js 16** (App Router) + React 19 + TypeScript
- **Tailwind CSS v4**
- **Prisma** + **Postgres (Neon)** — misma base de datos en desarrollo y
  producción, usando ramas (branches) distintas de Neon para cada entorno
- **Auth.js (next-auth v5)** — login de administrador con usuario/contraseña
- **react-markdown** — para el contenido de los artículos y la biografía

## Base de datos

El proyecto usa **Neon** (Postgres serverless). El proyecto de Neon
`ggr-web` tiene dos ramas:

- **development** — para tu máquina local.
- **production** (rama por defecto del proyecto) — la que usa el sitio
  desplegado en Vercel.

Ambas comparten el mismo esquema (`prisma/schema.prisma` y
`prisma/migrations/`), pero sus datos son independientes: puedes probar
cosas en local sin afectar el contenido real del sitio.

## Setup local

1. Instala dependencias:

   ```bash
   npm install
   ```

2. Copia el archivo de variables de entorno:

   ```bash
   cp .env.example .env
   ```

   - `DATABASE_URL`: pega la cadena de conexión de la rama **development**
     de Neon (consíguela en [console.neon.tech](https://console.neon.tech) →
     proyecto `ggr-web` → rama `development` → "Connect").
   - `AUTH_SECRET`: genera uno con `openssl rand -base64 32`.

3. El esquema ya está aplicado en Neon, así que solo falta generar el
   cliente de Prisma:

   ```bash
   npx prisma generate
   ```

   Si en el futuro cambias `prisma/schema.prisma`, corre
   `npm run db:migrate` para crear y aplicar una nueva migración contra tu
   rama de desarrollo.

4. (Opcional) Siembra contenido de ejemplo en tu rama de desarrollo:

   ```bash
   npm run db:seed
   ```

   Imprime en la consola un correo/contraseña de administrador de
   desarrollo — anótalos para entrar a `/admin`. Ya existe además un
   usuario admin creado directamente en Neon para pruebas rápidas (pide las
   credenciales si las perdiste).

5. Levanta el servidor:

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

## Deploy a producción (Vercel)

1. En Vercel, importa este repositorio (**Root Directory** debe ser la raíz
   del repo, donde está `package.json`).

2. Configura las variables de entorno del proyecto en Vercel (Production y
   Preview):
   - `DATABASE_URL`: la cadena de conexión de la rama **production** de
     Neon.
   - `AUTH_SECRET`: un valor generado con `openssl rand -base64 32`,
     distinto al de desarrollo.
   - `NEXT_PUBLIC_SITE_URL`: la URL pública del sitio (ej.
     `https://gabrielaguerrarey.com` o el dominio que te asigne Vercel).

3. Haz deploy. El script `build` corre `prisma migrate deploy` antes de
   `next build`, así que cualquier migración pendiente se aplica sola en
   cada deploy — no hace falta tocar la base de datos a mano.

Ya existe un usuario administrador creado directamente en la rama de
producción de Neon; pide las credenciales si no las tienes. Puedes rotarlas
cuando quieras (ver abajo).

### Rotar la contraseña de administrador

Desde una máquina con acceso normal a internet (Neon requiere una conexión
directa a Postgres, que algunos entornos restringidos —como sandboxes de
CI— bloquean):

```bash
DATABASE_URL="<url-de-la-rama-production-de-neon>" npm run admin:set-password -- tu-correo@dominio.com "nueva-contraseña"
```

## Verificación / tests end-to-end

Con el servidor de desarrollo corriendo (`npm run dev`) contra tu rama de
desarrollo ya sembrada:

```bash
npx playwright install chromium   # solo la primera vez
npm run test:e2e
```

Esto recorre las páginas públicas, prueba el login del admin, hace un CRUD
completo de libros/artículos/cursos, y verifica que editar los metadatos de
una sección cambie el `<title>` de esa página.
