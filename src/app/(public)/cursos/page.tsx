import type { Metadata } from "next";

import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/metadata";
import { CourseCard } from "@/components/public/CourseCard";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata("cursos", {
    title: "Cursos y Talleres",
    description: "Talleres literarios impartidos por Gabriela Guerra Rey.",
  });
}

export default async function CursosPage() {
  const courses = await prisma.course.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { order: "asc" }],
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <header className="mb-12 max-w-2xl">
        <h1 className="font-serif text-4xl text-foreground">Cursos y talleres</h1>
        <p className="mt-4 text-muted">
          Estos son los talleres y cursos que imparto. Aquí encontrarás una descripción de cada
          uno; para inscribirte o conocer fechas y cupo, sigue el enlace de &ldquo;Más
          información&rdquo;.
        </p>
      </header>

      {courses.length > 0 ? (
        <div className="flex flex-col gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <p className="text-muted">
          Actualmente no hay talleres abiertos. Vuelve pronto para conocer las próximas fechas.
        </p>
      )}
    </div>
  );
}
