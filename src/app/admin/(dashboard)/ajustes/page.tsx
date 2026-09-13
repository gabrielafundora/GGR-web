import { prisma } from "@/lib/prisma";
import { SiteSettingsForm } from "./SiteSettingsForm";

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 1 } });

  return (
    <div>
      <h1 className="font-serif text-3xl text-foreground">Ajustes del sitio</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Información general que se usa en distintas partes del sitio: nombre, portada de inicio,
        biografía y redes sociales.
      </p>

      <div className="mt-8">
        <SiteSettingsForm settings={settings} />
      </div>
    </div>
  );
}
