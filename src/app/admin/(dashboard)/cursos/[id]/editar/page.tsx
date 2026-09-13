import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { updateCourse } from "@/actions/courses";
import { CourseForm } from "../../CourseForm";

export default async function EditCoursePage({ params }: PageProps<"/admin/cursos/[id]/editar">) {
  const { id } = await params;
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) notFound();

  const action = updateCourse.bind(null, course.id);

  return (
    <div>
      <h1 className="font-serif text-3xl text-foreground">Editar curso o taller</h1>
      <div className="mt-8">
        <CourseForm course={course} action={action} />
      </div>
    </div>
  );
}
