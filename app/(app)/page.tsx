// app/(app)/page.tsx
// Esta é a página principal (Dashboard) da sua aplicação.

import { Dashboard } from "@/components/dashboard";

export default function HomePage() {
  // O único trabalho desta página é renderizar o componente do Dashboard.
  // A sidebar é adicionada automaticamente pelo layout pai (layout.tsx).
  return <Dashboard />;
}