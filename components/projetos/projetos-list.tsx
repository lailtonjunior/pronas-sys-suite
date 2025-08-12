"use client"

import { useState, useEffect } from "react";
import { FileText, Edit, Trash2, Building2, FileJson, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Interface para o projeto vindo da API
interface Projeto {
  id: string;
  title: string;
  status: string;
  updatedAt: string;
  campoAtuacao: string;
  institution: {
    name: string;
  };
  institutionId: string;
}

export function ProjetosList() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  // A função de remover precisa ser implementada na API também
  // const { removeProjeto } = useStore() 

  useEffect(() => {
    const fetchProjetos = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/projects');
        if (!response.ok) {
          throw new Error("Falha ao buscar os projetos.");
        }
        const data = await response.json();
        setProjetos(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjetos();
  }, []);


  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em Elaboração":
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
    alert(`Funcionalidade de impressão para o projeto ${projetoId} será implementada em uma página de visualização dedicada.`);
  }
  
  const handleDelete = async (projetoId: string) => {
    if (!confirm("Tem certeza que deseja excluir este projeto?")) return;
    
    // Aqui você chamaria a API para deletar
    alert(`Funcionalidade de exclusão para o projeto ${projetoId} precisa ser implementada na API.`);
    // Ex: await fetch(`/api/projects/${projetoId}`, { method: 'DELETE' });
    // setProjetos(projetos.filter(p => p.id !== projetoId));
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
        <Alert variant="destructive">
            <AlertTitle>Erro ao Carregar Projetos</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
    )
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
                <CardTitle className="text-lg">{projeto.title || "Projeto sem título"}</CardTitle>
                <CardDescription className="mt-1 flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {projeto.institution.name || "Instituição não selecionada"}
                </CardDescription>
              </div>
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4 flex-1 flex flex-col">
            <div className="flex items-center justify-between">
              <Badge className={getStatusColor(projeto.status)}>
                {projeto.status}
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
              <Button size="icon" variant="destructive" onClick={() => handleDelete(projeto.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}