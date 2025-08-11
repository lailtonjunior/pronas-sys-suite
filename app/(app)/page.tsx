// app/(app)/page.tsx
// Esta é agora a ÚNICA página para a rota principal ("/").
// Ela importa o Dashboard, que é um Client Component.

import { Dashboard } from "@/components/dashboard";

export default function HomePage() {
  return <Dashboard />;
}
