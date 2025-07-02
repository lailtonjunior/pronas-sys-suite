"use client"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProjetosList } from "./projetos-list"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"

export function ProjetosManager() {
  const router = useRouter()
  const { addProjeto } = useStore()

  const handleNovoProjeto = () => {
    const novoProjeto = {
      id: Date.now().toString(),
      titulo: "",
      instituicaoId: "",
      status: "rascunho" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Dados do formulário
      campoAtuacao: "",
      prazoExecucao: "",
      areasArt10: [],
      resumoIdeia: "",
      problemacentral: "",
      relevancia: "",
      solucaoProposta: "",
      articulacaoSUS: "",
      objetivoGeral: "",
      objetivosEspecificos: "",
      faixaEtaria: "",
      tiposDeficiencia: "",
      novosUsuarios: "",
      usuariosAtuais: "",
      criteriosInclusao: "",
      metodologiaDetalhada: "",
      planoPTS: "",
      registroCIHA: "",
      outrosInstrumentos: "",
      orcamento: {
        recursosHumanos: [],
        materialConsumo: [],
        equipamentos: [],
        servicosTerceiros: [],
        despesasAdmin: [],
        despesasElaboracao: [],
      },
    }

    addProjeto(novoProjeto)
    router.push(`/projetos/${novoProjeto.id}`)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Projetos PRONAS/PCD</h1>
          <p className="text-muted-foreground">Crie e gerencie projetos para captação de recursos PRONAS/PCD</p>
        </div>
        <Button onClick={handleNovoProjeto}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Projeto
        </Button>
      </div>

      <ProjetosList />
    </div>
  )
}
