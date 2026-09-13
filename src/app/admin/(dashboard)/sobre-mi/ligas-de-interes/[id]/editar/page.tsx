import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { updateInterestLink } from "@/actions/interestLinks";
import { InterestLinkForm } from "../../InterestLinkForm";

export default async function EditInterestLinkPage({
  params,
}: PageProps<"/admin/sobre-mi/ligas-de-interes/[id]/editar">) {
  const { id } = await params;
  const link = await prisma.interestLink.findUnique({ where: { id } });
  if (!link) notFound();

  const action = updateInterestLink.bind(null, link.id);

  return (
    <div>
      <h1 className="font-serif text-3xl text-foreground">Editar liga de interés</h1>
      <div className="mt-8">
        <InterestLinkForm link={link} action={action} />
      </div>
    </div>
  );
}
