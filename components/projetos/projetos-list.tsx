"use client"

import { FileText, Edit, Trash2, Building2, FileJson } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { useRouter } from "next/navigation"

export function ProjetosList() {
  const { projetos, instituicoes, removeProjeto } = useStore()
  const router = useRouter()

  const getInstituicaoNome = (instituicaoId: string) => {
    const instituicao = instituicoes.find((i) => i.id === instituicaoId)
    return instituicao?.razaoSocial || "Instituição não selecionada"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "rascunho":
        return "bg-yellow-100 text-yellow-800"
      case "concluido":
        return "bg-green-100 text-green-800"
      case "submetido":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }
  
  const handlePrint = (projetoId: string) => {
    // A lógica ideal seria navegar para uma página de visualização
    // e então chamar window.print(), mas por simplicidade, vamos usar um alerta.
    // Futuramente, isso abriria uma nova aba com o relatório formatado.
    alert(`Funcionalidade de impressão para o projeto ${projetoId} será implementada em uma página de visualização dedicada.`);
    // Exemplo: router.push(`/projetos/${projetoId}/print`);
  }

  if (projetos.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum projeto encontrado</h3>
          <p className="text-muted-foreground text-center">
            Comece criando seu primeiro projeto PRONAS/PCD para uma instituição cadastrada.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projetos.map((projeto) => (
        <Card key={projeto.id} className="hover:shadow-md transition-shadow flex flex-col">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg">{projeto.titulo || "Projeto sem título"}</CardTitle>
                <CardDescription className="mt-1 flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {getInstituicaoNome(projeto.instituicaoId)}
                </CardDescription>
              </div>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4 flex-1 flex flex-col">
            <div className="flex items-center justify-between">
              <Badge className={getStatusColor(projeto.status)}>
                {projeto.status === "rascunho" && "Em Elaboração"}
                {projeto.status === "concluido" && "Concluído"}
                {projeto.status === "submetido" && "Submetido"}
              </Badge>
            </div>

            {projeto.campoAtuacao && (
              <div>
                <p className="text-sm font-medium">Campo de Atuação:</p>
                <p className="text-sm text-muted-foreground">{projeto.campoAtuacao}</p>
              </div>
            )}

            <div className="text-xs text-muted-foreground pt-2 border-t mt-auto">
              Atualizado em {new Date(projeto.updatedAt).toLocaleDateString("pt-BR")}
            </div>
          </CardContent>
          <div className="p-4 pt-0">
            <div className="flex gap-2">
              <Button size="sm" onClick={() => router.push(`/projetos/${projeto.id}`)} className="flex-1">
                <Edit className="h-4 w-4 mr-1" />
                Continuar
              </Button>
              <Button size="icon" variant="outline" onClick={() => handlePrint(projeto.id)}>
                <FileJson className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="destructive" onClick={() => removeProjeto(projeto.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}