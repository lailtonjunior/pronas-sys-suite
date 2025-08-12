// app/(app)/layout.tsx
// Este é o layout para todas as páginas protegidas da aplicação.

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { authOptions } from "@/lib/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Se não houver sessão, o usuário é redirecionado para a página de login.
  if (!session) {
    redirect("/login");
  }

  // Se houver sessão, renderiza a sidebar e o conteúdo da página.
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <AppSidebar />
      <main className="flex-1 flex flex-col gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        {children}
      </main>
    </div>
  );
}
