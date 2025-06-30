"use client"

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { FileText, Upload } from "lucide-react"

interface AnexosTabProps {
  projeto: any
  onSave: (data: any) => void
}

const documentosObrigatorios = [
  {
    id: "anexo4",
    nome: "Anexo IV - Plano de Trabalho",
    descricao: "Plano de trabalho detalhado conforme modelo",
  },
  {
    id: "anexo5",
    nome: "Anexo V - Cronograma de Execução",
    descricao: "Cronograma físico-financeiro do projeto",
  },
  {
    id: "alvaraSanitario",
    nome: "Alvará Sanitário",
    descricao: "Alvará sanitário vigente da instituição",
  },
  {
    id: "pgrss",
    nome: "PGRSS - Plano de Gerenciamento de RSS",
    descricao: "Plano de gerenciamento de resíduos de serviços de saúde",
  },
  {
    id: "certidaoRegularidade",
    nome: "Certidão de Regularidade Fiscal",
    descricao: "Certidões negativas de débitos federais, estaduais e municipais",
  },
  {
    id: "estatutoSocial",
    nome: "Estatuto Social",
    descricao: "Estatuto social registrado e atualizado",
  },
]

export function AnexosTab({ projeto, onSave }: AnexosTabProps) {
  const { register, handleSubmit } = useForm({
    defaultValues: projeto,
  })

  const onSubmit = (data: any) => {
    onSave(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Documentação e Anexos</h3>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Documentos Obrigatórios
            </CardTitle>
            <CardDescription>Anexe todos os documentos necessários para a submissão do projeto</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {documentosObrigatorios.map((doc) => (
              <div key={doc.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                <Checkbox id={doc.id} className="mt-1" />
                <div className="flex-1 space-y-2">
                  <Label htmlFor={doc.id} className="text-sm font-medium cursor-pointer">
                    {doc.nome}
                  </Label>
                  <p className="text-sm text-muted-foreground">{doc.descricao}</p>
                  <div className="flex items-center gap-2">
                    <Input type="file" accept=".pdf,.doc,.docx" className="flex-1" />
                    <Button type="button" variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documentos Complementares</CardTitle>
            <CardDescription>Outros documentos que podem fortalecer a proposta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="cartasApoio">Cartas de Apoio</Label>
              <Input id="cartasApoio" type="file" accept=".pdf,.doc,.docx" multiple className="mt-1" />
              <p className="text-sm text-muted-foreground mt-1">
                Cartas de apoio de parceiros, gestores ou outras instituições
              </p>
            </div>

            <div>
              <Label htmlFor="estudosTecnicos">Estudos Técnicos</Label>
              <Input id="estudosTecnicos" type="file" accept=".pdf,.doc,.docx" multiple className="mt-1" />
              <p className="text-sm text-muted-foreground mt-1">Estudos de viabilidade, pesquisas ou diagnósticos</p>
            </div>

            <div>
              <Label htmlFor="portfolioInstitucional">Portfólio Institucional</Label>
              <Input id="portfolioInstitucional" type="file" accept=".pdf,.doc,.docx" className="mt-1" />
              <p className="text-sm text-muted-foreground mt-1">
                Apresentação da instituição e experiências anteriores
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button type="submit">Salvar Anexos</Button>
      </div>
    </form>
  )
}
