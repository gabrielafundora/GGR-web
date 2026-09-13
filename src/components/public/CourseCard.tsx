import type { Course } from "@prisma/client";

import { Badge, Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";

export function CourseCard({ course }: { course: Course }) {
  return (
    <Card className="flex flex-col overflow-hidden sm:flex-row">
      {course.imageUrl ? (
        <div className="aspect-16/9 w-full overflow-hidden bg-surface-2 sm:aspect-auto sm:w-56 sm:shrink-0">
          <img src={course.imageUrl} alt={course.title} className="h-full w-full object-cover" loading="lazy" />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-serif text-2xl text-foreground">{course.title}</h3>
          {course.isPermanent ? <Badge>Taller permanente</Badge> : null}
          {course.modality ? (
            <span className="border border-border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
              {course.modality}
            </span>
          ) : null}
          {course.sessionsCount ? (
            <span className="border border-border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
              {course.sessionsCount} sesiones
            </span>
          ) : null}
        </div>
        <p className="text-sm leading-relaxed text-muted">{course.description}</p>
        {course.isPermanent ? (
          <p className="text-sm text-muted">Solicita información sobre nuevas fechas de inicio.</p>
        ) : null}
        <LinkButton href={course.externalUrl} external variant="primary" className="mt-2 w-fit">
          Solicita información
        </LinkButton>
      </div>
    </Card>
  );
}
