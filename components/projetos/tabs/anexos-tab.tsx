"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { FileText, Upload } from "lucide-react"

// Lista de documentos atualizada conforme a solicitação do usuário
const documentosObrigatorios = [
  {
    id: "requerimento",
    nome: "Requerimento de apresentação do projeto",
    descricao: "Deve estar devidamente preenchido (modelo disponível na regulamentação do Programa).",
  },
  {
    id: "copia_credenciamento",
    nome: "Cópia do ato publicado no Diário Oficial da União",
    descricao: "Refere-se ao ato que deferiu o credenciamento da instituição no PRONAS/PCD.",
  },
  {
    id: "declaracoes_responsabilidade",
    nome: "Declarações de responsabilidade e de capacidade técnico-operativa",
    descricao: "Documentos que atestam a capacidade da instituição para executar o projeto.",
  },
  {
    id: "anuencia_gestor_sus",
    nome: "Comprovação de anuência prévia favorável ao projeto",
    descricao: "Emitida pelos gestores estadual e/ou municipal de saúde do SUS.",
  },
  {
    id: "declaracao_comite_etica",
    nome: "Declaração de compromisso (Comitês de Ética)",
    descricao: "Compromisso de submeter o projeto aos Comitês de Ética da ANVISA e da CTNBio, quando aplicável.",
  },
]

export function AnexosTab({ onSave }: { onSave: (data: any) => void }) {
  // A lógica de formulário pode ser adicionada aqui no futuro, se necessário
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Aqui você pode extrair os dados dos arquivos e salvar
    onSave({});
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Documentação e Anexos Obrigatórios</h3>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Checklist de Documentos para Submissão
            </CardTitle>
            <CardDescription>Anexe todos os documentos necessários para a submissão do projeto. Os arquivos serão salvos ao salvar o rascunho do projeto.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {documentosObrigatorios.map((doc) => (
              <div key={doc.id} className="flex items-start space-x-4 p-4 border rounded-lg bg-background">
                <Checkbox id={`check-${doc.id}`} className="mt-1" />
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`check-${doc.id}`} className="text-sm font-medium leading-none cursor-pointer">
                    {doc.nome}
                  </Label>
                  <p className="text-sm text-muted-foreground">{doc.descricao}</p>
                  <div className="flex items-center gap-2 pt-2">
                    <Input id={`file-${doc.id}`} type="file" accept=".pdf,.doc,.docx" className="flex-1" />
                    <Button type="button" variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Anexar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button type="submit">Salvar Anexos</Button>
      </div>
    </form>
  )
}