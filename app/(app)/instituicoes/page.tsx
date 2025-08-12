// app/(app)/instituicoes/page.tsx
"use client"; // Este componente gerencia estado, então precisa ser um Client Component

import { InstituicoesManager } from "@/components/instituicoes/instituicoes-manager";

export default function InstituicoesPage() {
  // O único trabalho desta página é renderizar o componente gerenciador.
  return <InstituicoesManager />;
}