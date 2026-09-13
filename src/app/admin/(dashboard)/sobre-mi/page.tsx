import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { deleteInterestLink } from "@/actions/interestLinks";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { Button } from "@/components/ui/Button";
import { AuthorProfileForm } from "./AuthorProfileForm";

export default async function AdminSobreMiPage() {
  const [settings, links] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: 1 } }),
    prisma.interestLink.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="font-serif text-3xl text-foreground">Sobre la autora</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Foto y biografía que se muestran en la página pública Sobre la autora, y las ligas de
        interés que aparecen debajo (ej. &ldquo;Wikipedia&rdquo; enlazando a tu página de
        Wikipedia).
      </p>

      <div className="mt-8">
        <AuthorProfileForm settings={settings} />
      </div>

      <div className="mt-10 max-w-4xl">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl text-foreground">Ligas de interés</h2>
          <Link href="/admin/sobre-mi/ligas-de-interes/nuevo">
            <Button>+ Nueva liga</Button>
          </Link>
        </div>

        <div className="mt-4 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[560px] text-left text-sm">
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
                  <td className="px-4 py-3 text-muted">
                    {link.published ? "Publicado" : "Borrador"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-4">
                      <Link
                        href={`/admin/sobre-mi/ligas-de-interes/${link.id}/editar`}
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
    </div>
  );
}
