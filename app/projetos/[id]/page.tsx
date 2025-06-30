import { ProjetoForm } from "@/components/projetos/projeto-form"

export default function ProjetoPage({ params }: { params: { id: string } }) {
  return <ProjetoForm projetoId={params.id} />
}
