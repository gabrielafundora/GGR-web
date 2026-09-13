import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { deleteCourse } from "@/actions/courses";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { Button } from "@/components/ui/Button";

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-foreground">Cursos y talleres</h1>
        <Link href="/admin/cursos/nuevo">
          <Button>+ Nuevo curso</Button>
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-surface text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Título</th>
              <th className="px-4 py-3 font-medium">Modalidad</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="border-t border-border">
                <td className="px-4 py-3 text-foreground">
                  {course.title}
                  {course.featured ? <span className="ml-2 text-xs text-accent">★</span> : null}
                </td>
                <td className="px-4 py-3 text-muted">{course.modality ?? "—"}</td>
                <td className="px-4 py-3 text-muted">{course.published ? "Publicado" : "Borrador"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-4">
                    <Link
                      href={`/admin/cursos/${course.id}/editar`}
                      className="text-accent hover:text-accent-hover"
                    >
                      Editar
                    </Link>
                    <ConfirmDeleteButton action={deleteCourse.bind(null, course.id)} />
                  </div>
                </td>
              </tr>
            ))}
            {courses.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-muted">
                  Aún no hay cursos. Crea el primero.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
