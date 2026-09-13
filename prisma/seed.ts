import { randomBytes } from "node:crypto";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@gabrielaguerrarey.com";

async function seedAdmin() {
  const existing = await prisma.adminUser.findUnique({ where: { email: ADMIN_EMAIL } });
  if (existing) {
    console.log(`\n[seed] AdminUser ya existe (${ADMIN_EMAIL}); no se generó una nueva contraseña.`);
    return;
  }

  const password = process.env.SEED_ADMIN_PASSWORD ?? randomBytes(9).toString("base64url");
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.adminUser.create({
    data: { email: ADMIN_EMAIL, passwordHash, name: "Gabriela Guerra Rey" },
  });

  console.log("\n=========================================================");
  console.log(" Credenciales de administrador (SOLO DESARROLLO)");
  console.log(` Correo:      ${ADMIN_EMAIL}`);
  console.log(` Contraseña:  ${password}`);
  console.log(" Cámbialas antes de ir a producción (ver README.md).");
  console.log("=========================================================\n");
}

async function seedBooks() {
  const books = [
    {
      slug: "el-jardin-de-las-ausencias",
      title: "El jardín de las ausencias",
      subtitle: "Novela",
      description:
        "Una novela sobre la memoria y los lugares que habitamos aun después de haberlos perdido. Tres generaciones de una misma familia se encuentran, sin saberlo, en el mismo jardín.",
      coverImageUrl: "/images/books/book-1.svg",
      amazonUrl: "https://www.amazon.com/dp/EXAMPLE001",
      year: 2022,
      genre: "Novela",
      featured: true,
      published: true,
      order: 0,
    },
    {
      slug: "cartas-al-mar-distante",
      title: "Cartas al mar distante",
      subtitle: "Relatos",
      description:
        "Una colección de relatos breves conectados por el mar como frontera y como promesa: historias de partidas, regresos y todo lo que queda entre medio.",
      coverImageUrl: "/images/books/book-2.svg",
      amazonUrl: "https://www.amazon.com/dp/EXAMPLE002",
      year: 2020,
      genre: "Cuento",
      featured: true,
      published: true,
      order: 1,
    },
    {
      slug: "la-casa-de-los-ecos",
      title: "La casa de los ecos",
      description:
        "En una vieja casa familiar, cada habitación guarda una voz distinta del pasado. Una novela coral sobre el peso de los silencios heredados.",
      coverImageUrl: "/images/books/book-3.svg",
      amazonUrl: "https://www.amazon.com/dp/EXAMPLE003",
      year: 2018,
      genre: "Novela",
      featured: false,
      published: true,
      order: 2,
    },
    {
      slug: "cuentos-de-medianoche",
      title: "Cuentos de medianoche",
      subtitle: "Antología",
      description:
        "Doce cuentos breves para leer de una sola sentada, sobre lo extraño que se esconde en lo cotidiano.",
      coverImageUrl: "/images/books/book-4.svg",
      amazonUrl: "https://www.amazon.com/dp/EXAMPLE004",
      year: 2016,
      genre: "Cuento",
      featured: false,
      published: true,
      order: 3,
    },
  ];

  for (const book of books) {
    await prisma.book.upsert({ where: { slug: book.slug }, create: book, update: book });
  }
}

async function seedArticles() {
  const articles = [
    {
      slug: "sobre-el-oficio-de-escribir",
      title: "Sobre el oficio de escribir",
      excerpt: "Algunas reflexiones sobre la disciplina, la duda y la constancia de escribir cada día.",
      coverImageUrl: "/images/articles/article-1.svg",
      published: true,
      publishedAt: new Date("2024-03-10"),
      contentMd: `Escribir no es solo esperar la inspiración: es sentarse, todos los días, aunque **no tengamos ganas**.

## La disciplina antes que la musa

Con los años he aprendido que la escritura es, sobre todo, un oficio. Como cualquier oficio, se aprende:

- Con constancia
- Con lectura
- Con muchísima reescritura

> "Escribo para descubrir qué pienso." — una frase que repito cada vez que la página en blanco me intimida.

## Algunas preguntas que me hago antes de empezar

1. ¿De quién es esta historia?
2. ¿Qué es lo que este personaje quiere y no puede tener?
3. ¿Por qué esta historia y no otra?

Con el tiempo, esas preguntas se vuelven el verdadero primer borrador.
`,
    },
    {
      slug: "como-nace-un-personaje",
      title: "Cómo nace un personaje",
      excerpt: "De dónde vienen los personajes que terminan habitando una novela durante años.",
      coverImageUrl: "/images/articles/article-2.svg",
      published: true,
      publishedAt: new Date("2023-08-22"),
      contentMd: `Casi nunca nacen completos. Empiezan con un gesto, una frase suelta, una imagen que no me suelta.

## Una lista, no una biografía

En vez de escribir la biografía completa de un personaje antes de empezar, prefiero anotar:

- Una contradicción que lo define
- Un objeto que lleva siempre consigo
- Una frase que jamás diría en voz alta

El resto lo descubro *mientras* escribo, no antes.
`,
    },
    {
      slug: "leer-para-escribir-mejor",
      title: "Leer para escribir mejor",
      excerpt: "Por qué la lectura atenta es, para mí, el taller literario más importante.",
      coverImageUrl: "/images/articles/article-3.svg",
      published: true,
      publishedAt: new Date("2022-11-02"),
      contentMd: `No conozco un solo autor que no sea, antes que nada, un lector obsesivo.

## Leer con lápiz en mano

Cuando leo por oficio (no solo por placer), subrayo:

1. Diálogos que suenan verdaderos
2. Estructuras que no vi venir
3. Frases que envidio en silencio

Ese ejercicio, sostenido en el tiempo, enseña más que cualquier manual.
`,
    },
  ];

  for (const article of articles) {
    await prisma.article.upsert({ where: { slug: article.slug }, create: article, update: article });
  }
}

async function seedCourses() {
  const courses = [
    {
      slug: "taller-de-narrativa",
      title: "Taller de narrativa breve",
      description:
        "Un taller pensado para quienes quieren escribir cuento y narrativa corta desde cero o retomar una práctica que dejaron pausada. Trabajamos estructura, voz y reescritura en grupos pequeños.",
      imageUrl: "/images/courses/course-1.svg",
      externalUrl: "https://www.example.com/taller-de-narrativa",
      modality: "Online, en vivo",
      sessionsCount: 8,
      isPermanent: false,
      published: true,
      order: 0,
    },
    {
      slug: "taller-de-poesia",
      title: "Taller de poesía",
      description:
        "Un espacio para leer y escribir poesía contemporánea, pensado tanto para quienes empiezan como para quienes ya tienen un proyecto de libro en marcha.",
      imageUrl: "/images/courses/course-2.svg",
      externalUrl: "https://www.example.com/taller-de-poesia",
      modality: "Presencial",
      sessionsCount: 6,
      isPermanent: true,
      published: true,
      order: 1,
    },
  ];

  for (const course of courses) {
    await prisma.course.upsert({ where: { slug: course.slug }, create: course, update: course });
  }
}

async function seedPageMeta() {
  const rows = [
    {
      page: "home",
      title: "Gabriela Guerra Rey",
      description: "Autora de libros, artículos y talleres literarios.",
    },
    {
      page: "catalogo",
      title: "Catálogo de libros",
      description: "Explora los libros publicados por Gabriela Guerra Rey, disponibles en Amazon.",
    },
    {
      page: "articulos",
      title: "Artículos",
      description: "Reflexiones y artículos de Gabriela Guerra Rey sobre literatura y escritura.",
    },
    {
      page: "cursos",
      title: "Cursos y Talleres",
      description: "Talleres literarios impartidos por Gabriela Guerra Rey.",
    },
    {
      page: "sobre-mi",
      title: "Sobre la autora",
      description: "Conoce a Gabriela Guerra Rey, autora y tallerista literaria.",
    },
  ];

  for (const row of rows) {
    await prisma.pageMeta.upsert({ where: { page: row.page }, create: row, update: row });
  }
}

async function seedSiteSettings() {
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      siteName: "Gabriela Guerra Rey",
      tagline: "Autora y tallerista literaria",
      heroHeadline: "Historias que se quedan contigo",
      heroSubtext:
        "Novelista y tallerista. Descubre mis libros, artículos sobre el oficio de escribir y los talleres literarios que imparto.",
      authorPhotoUrl: "/images/author.svg",
      authorBio: `Gabriela Guerra Rey es autora de novelas y relatos, y dicta talleres de escritura desde hace más de una década.

Su trabajo explora la memoria, los vínculos familiares y los lugares que dejamos atrás sin del todo abandonarlos.

*(Este es un texto de ejemplo — reemplázalo desde el panel de administrador en **Ajustes del sitio**.)*`,
      contactEmail: "contacto@example.com",
      instagramUrl: "https://www.instagram.com/",
      goodreadsUrl: "https://www.goodreads.com/",
    },
    update: {},
  });
}

async function main() {
  await seedAdmin();
  await seedBooks();
  await seedArticles();
  await seedCourses();
  await seedPageMeta();
  await seedSiteSettings();
  console.log("[seed] Listo.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
