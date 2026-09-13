import { createCourse } from "@/actions/courses";
import { CourseForm } from "../CourseForm";

export default function NewCoursePage() {
  return (
    <div>
      <h1 className="font-serif text-3xl text-foreground">Nuevo curso o taller</h1>
      <div className="mt-8">
        <CourseForm action={createCourse} />
      </div>
    </div>
  );
}
