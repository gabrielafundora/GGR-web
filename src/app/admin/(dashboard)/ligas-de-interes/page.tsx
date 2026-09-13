import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { deleteInterestLink } from "@/actions/interestLinks";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { Button } from "@/components/ui/Button";

export default async function AdminInterestLinksPage() {
  const links = await prisma.interestLink.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-foreground">Ligas de interés</h1>
        <Link href="/admin/ligas-de-interes/nuevo">
          <Button>+ Nueva liga</Button>
        </Link>
      </div>
      <p className="mt-2 max-w-2xl text-muted">
        Enlaces externos que aparecen en la sección &ldquo;Ligas de interés&rdquo; de la página
        Sobre la autora, por ejemplo &ldquo;Wikipedia&rdquo; enlazando a tu página de Wikipedia.
      </p>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-surface text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Título</th>
              <th className="px-4 py-3 font-medium">Link</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link) => (
              <tr key={link.id} className="border-t border-border">
                <td className="px-4 py-3 text-foreground">{link.title}</td>
                <td className="max-w-xs truncate px-4 py-3 text-muted">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent"
                  >
                    {link.url}
                  </a>
                </td>
                <td className="px-4 py-3 text-muted">{link.published ? "Publicado" : "Borrador"}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-4">
                    <Link
                      href={`/admin/ligas-de-interes/${link.id}/editar`}
                      className="text-accent hover:text-accent-hover"
                    >
                      Editar
                    </Link>
                    <ConfirmDeleteButton action={deleteInterestLink.bind(null, link.id)} />
                  </div>
                </td>
              </tr>
            ))}
            {links.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-muted">
                  Aún no hay ligas de interés. Crea la primera.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
