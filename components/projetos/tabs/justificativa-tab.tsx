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
import { useToast } from "@/hooks/use-toast"

export function JustificativaTab() {
  const { register, setValue, watch } = useFormContext()
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const resumoIdeia = watch("resumoIdeia")

  const handleGenerateJustificativa = async () => {
    setIsGenerating(true)
    
    // Lista de campos a serem preenchidos pela IA
    const fieldsToGenerate = [
        { key: 'problemacentral', query: 'Problema Central / Necessidade Identificada' },
        { key: 'relevancia', query: 'Relevância do Projeto' },
        { key: 'solucaoProposta', query: 'Solução Proposta' }
    ];

    try {
        for (const field of fieldsToGenerate) {
            const response = await fetch('/api/knowledge/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: field.query,
                    contextPrompt: `Para um projeto com o seguinte resumo: "${resumoIdeia}", gere um texto detalhado para o campo "${field.query}".`
                }),
            });

            if (!response.ok) {
                throw new Error(`A IA não conseguiu gerar conteúdo para "${field.query}".`);
            }

            const result = await response.json();
            setValue(field.key, result.answer);
        }

        toast({
            title: "Conteúdo Gerado!",
            description: "Os campos da justificativa foram preenchidos pela IA com base na sua Base de Conhecimento."
        })

    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Erro na Geração",
            description: error.message,
        })
    } finally {
        setIsGenerating(false)
    }
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
          <Textarea id="problemacentral" {...register("problemacentral")} placeholder="O texto gerado pela IA aparecerá aqui..." rows={5} className="mt-1" />
        </div>

        <div>
          <Label htmlFor="relevancia">Relevância do Projeto *</Label>
          <Textarea id="relevancia" {...register("relevancia")} placeholder="O texto gerado pela IA aparecerá aqui..." rows={5} className="mt-1" />
        </div>

        <div>
          <Label htmlFor="solucaoProposta">Solução Proposta *</Label>
          <Textarea id="solucaoProposta" {...register("solucaoProposta")} placeholder="O texto gerado pela IA aparecerá aqui..." rows={5} className="mt-1" />
        </div>

        <div>
          <Label htmlFor="articulacaoSUS">Articulação com a Rede SUS *</Label>
          <Textarea id="articulacaoSUS" {...register("articulacaoSUS")} placeholder="Explique como o projeto se articula com a rede SUS..." rows={4} className="mt-1" />
        </div>

        <div>
          <Label htmlFor="cartaAnuencia">Carta de Anuência do Gestor SUS</Label>
          <Input id="cartaAnuencia" type="file" accept=".pdf,.doc,.docx" className="mt-1" />
          <p className="text-sm text-muted-foreground mt-1">Documento obrigatório assinado pelo gestor municipal ou estadual de saúde.</p>
        </div>
      </div>
    </div>
  )
}