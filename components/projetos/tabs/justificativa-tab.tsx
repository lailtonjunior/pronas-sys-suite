"use client"

import { useFormContext } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Sparkles } from "lucide-react"
import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"

export function JustificativaTab() {
  const { register, setValue, watch } = useFormContext()
  const [isGenerating, setIsGenerating] = useState(false)

  const resumoIdeia = watch("resumoIdeia")

  const handleGenerateJustificativa = async () => {
    setIsGenerating(true)
    
    // Simulação de chamada à API Gemini usando o resumo como contexto
    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    const iaResult = {
      problemaCentral: `Com base na ideia de "${resumoIdeia}", identifica-se a carência de serviços especializados para o público-alvo na região, resultando em longas filas de espera e descontinuidade do tratamento, o que agrava as condições de saúde e limita a inclusão social.`,
      relevancia: `O projeto é de suma relevância pois atua diretamente sobre um gargalo da rede de saúde local. Alinha-se às políticas nacionais de saúde para a pessoa com deficiência, promovendo não apenas a reabilitação, mas também a autonomia e a qualidade de vida, gerando impacto social positivo para toda a comunidade.`,
      solucaoProposta: `A solução proposta envolve a criação de um fluxo de atendimento multidisciplinar e integrado, com a aquisição de equipamentos modernos e a contratação de profissionais qualificados. Isso permitirá a ampliação da capacidade de atendimento e a oferta de um serviço de excelência, conforme delineado no resumo do projeto.`,
    }

    setValue("problemacentral", iaResult.problemaCentral)
    setValue("relevancia", iaResult.relevancia)
    setValue("solucaoProposta", iaResult.solucaoProposta)
    
    setIsGenerating(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Justificativa e Aplicabilidade</h3>
        <Button 
          type="button" 
          onClick={handleGenerateJustificativa} 
          disabled={isGenerating || !resumoIdeia}
        >
          <Sparkles className="h-4 w-4 mr-2" />
          {isGenerating ? "Gerando conteúdo..." : "Preencher Justificativa com IA"}
        </Button>
      </div>

      {!resumoIdeia && (
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Aguardando Informações</AlertTitle>
          <AlertDescription>
            Preencha o campo "Resumo da Ideia Central do Projeto" na aba "Info Gerais" para habilitar a geração de conteúdo com IA.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        <div>
          <Label htmlFor="problemacentral">Problema Central/Necessidade Identificada *</Label>
          <Textarea
            id="problemacentral"
            {...register("problemacentral")}
            placeholder="Descreva o problema central que o projeto pretende resolver, como a falta de acesso a serviços de reabilitação na região X..."
            rows={5}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="relevancia">Relevância do Projeto *</Label>
          <Textarea
            id="relevancia"
            {...register("relevancia")}
            placeholder="Explique a relevância e importância do projeto, citando dados epidemiológicos, a carência de serviços e o alinhamento com políticas públicas..."
            rows={5}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="solucaoProposta">Solução Proposta *</Label>
          <Textarea
            id="solucaoProposta"
            {...register("solucaoProposta")}
            placeholder="Descreva a solução que o projeto oferece, como a implementação de um centro de reabilitação com atendimento multidisciplinar..."
            rows={5}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="articulacaoSUS">Articulação com a Rede SUS *</Label>
          <Textarea
            id="articulacaoSUS"
            {...register("articulacaoSUS")}
            placeholder="Explique como o projeto se articula com a rede SUS, por exemplo, através da referência de pacientes via UBS, CAPS, etc..."
            rows={4}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="cartaAnuencia">Carta de Anuência do Gestor SUS</Label>
          <Input id="cartaAnuencia" type="file" accept=".pdf,.doc,.docx" className="mt-1" />
          <p className="text-sm text-muted-foreground mt-1">
            Documento obrigatório assinado pelo gestor municipal ou estadual de saúde.
          </p>
        </div>
      </div>
    </div>
  )
}