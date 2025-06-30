"use client"

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/lib/store"
import { Sparkles } from "lucide-react"
import { useState } from "react"

interface InfoGeraisTabProps {
  projeto: any
  onSave: (data: any) => void
}

const camposAtuacao = [
  "Reabilitação Física",
  "Reabilitação Intelectual",
  "Reabilitação Visual",
  "Reabilitação Auditiva",
  "Reabilitação Múltipla",
  "Oficinas Ortopédicas",
  "Prevenção",
]

export function InfoGeraisTab({ projeto, onSave }: InfoGeraisTabProps) {
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: projeto,
  })
  const { instituicoes } = useStore()
  const [isGenerating, setIsGenerating] = useState(false)

  const resumoIdeia = watch("resumoIdeia")

  const generateResumo = async () => {
    if (!projeto.titulo) {
      alert("Por favor, preencha o título do projeto primeiro.")
      return
    }

    setIsGenerating(true)
    try {
      // Simular chamada à API Gemini
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const resumoGerado = `Este projeto visa implementar ações de ${projeto.campoAtuacao || "reabilitação"} para pessoas com deficiência, promovendo a inclusão social e melhoria da qualidade de vida através de atendimentos especializados e multidisciplinares. O projeto "${projeto.titulo}" busca atender às necessidades específicas do público-alvo, contribuindo para o fortalecimento da rede de cuidados em saúde da pessoa com deficiência.`

      setValue("resumoIdeia", resumoGerado)
    } catch (error) {
      console.error("Erro ao gerar resumo:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const onSubmit = (data: any) => {
    onSave(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Informações Gerais do Projeto</h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="instituicaoId">Instituição Proponente *</Label>
            <Select value={projeto.instituicaoId} onValueChange={(value) => setValue("instituicaoId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a instituição" />
              </SelectTrigger>
              <SelectContent>
                {instituicoes.map((instituicao) => (
                  <SelectItem key={instituicao.id} value={instituicao.id}>
                    {instituicao.razaoSocial}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="campoAtuacao">Campo de Atuação PRONAS/PCD *</Label>
            <Select value={projeto.campoAtuacao} onValueChange={(value) => setValue("campoAtuacao", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o campo" />
              </SelectTrigger>
              <SelectContent>
                {camposAtuacao.map((campo) => (
                  <SelectItem key={campo} value={campo}>
                    {campo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="titulo">Título do Projeto *</Label>
            <Input id="titulo" {...register("titulo", { required: true })} placeholder="Digite o título do projeto" />
          </div>

          <div>
            <Label htmlFor="prazoExecucao">Prazo de Execução (meses) *</Label>
            <Input id="prazoExecucao" type="number" {...register("prazoExecucao")} placeholder="Ex: 12" />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="areasArt10">Áreas Prioritárias do Art. 10</Label>
        <Textarea
          id="areasArt10"
          {...register("areasArt10")}
          placeholder="Descreva as áreas prioritárias conforme Art. 10..."
          rows={3}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="resumoIdeia">Resumo da Ideia Central do Projeto</Label>
          <Button type="button" variant="outline" size="sm" onClick={generateResumo} disabled={isGenerating}>
            <Sparkles className="h-4 w-4 mr-2" />
            {isGenerating ? "Gerando..." : "Gerar com IA"}
          </Button>
        </div>
        <Textarea
          id="resumoIdeia"
          {...register("resumoIdeia")}
          placeholder="Descreva brevemente a ideia central do projeto..."
          rows={4}
          value={resumoIdeia}
          onChange={(e) => setValue("resumoIdeia", e.target.value)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Documentação Obrigatória</CardTitle>
          <CardDescription>Anexe os documentos necessários para o projeto</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="comprovanteCredenciamento">Comprovante de Credenciamento PRONAS/PCD</Label>
            <Input id="comprovanteCredenciamento" type="file" accept=".pdf,.doc,.docx" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="comprovanteCNES">Comprovante CNES</Label>
            <Input id="comprovanteCNES" type="file" accept=".pdf,.doc,.docx" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="comprovanteCEBAS">Comprovante CEBAS/OS/OSCIP</Label>
            <Input id="comprovanteCEBAS" type="file" accept=".pdf,.doc,.docx" className="mt-1" />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit">Salvar Informações Gerais</Button>
      </div>
    </form>
  )
}
