import type { ReactNode } from "react";
import type { Metadata } from "next";

import { auth } from "@/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

// El proxy (src/proxy.ts) ya exige sesión para todo /admin/** salvo
// /admin/login. Aquí solo leemos la sesión para mostrar quién entró.
export const metadata: Metadata = {
  title: "Administrador",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-col sm:flex-row">
      <AdminSidebar userLabel={session?.user?.name} />
      <div className="flex-1 p-6 sm:p-10">{children}</div>
    </div>
  );
}
