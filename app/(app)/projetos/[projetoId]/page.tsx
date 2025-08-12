// app/(app)/projetos/[projetoId]/page.tsx
"use client";

import { ProjetoForm } from "@/components/projetos/projeto-form";

interface PageProps {
  params: {
    projetoId: string;
  };
}

export default function ProjetoEditPage({ params }: PageProps) {
  if (!params.projetoId) {
    return <div>Carregando projeto...</div>;
  }
  return <ProjetoForm projetoId={params.projetoId} />;
}