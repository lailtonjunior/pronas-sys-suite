"use client"

import { useFormContext } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles } from "lucide-react"
import { useState } from "react"

export function ObjetivosTab() {
  const { register, watch, setValue } = useFormContext() // Utiliza o contexto do formulário pai
  const [isGenerating, setIsGenerating] = useState(false)

  const objetivoGeral = watch("objetivoGeral")

  const handleGenerateObjetivos = async () => {
    if (!objetivoGeral) {
      alert("Por favor, preencha o Objetivo Geral primeiro.");
      return;
    }
    setIsGenerating(true)
    // Simulação de chamada à API Gemini
    await new Promise((resolve) => setTimeout(resolve, 1500))
    const textoGerado = `- Realizar 1.200 atendimentos de fisioterapia motora no período de 12 meses.\n- Confeccionar e doar 150 órteses e próteses para pacientes triados.\n- Capacitar 50 profissionais da rede de saúde local sobre identificação precoce de deficiências.\n- Promover 4 eventos de conscientização comunitária sobre inclusão, alcançando 500 pessoas.`
    setValue("objetivosEspecificos", textoGerado)
    setIsGenerating(false)
  }

  return (
    // O <form> e o botão de submit foram removidos daqui. A aba agora é apenas um conjunto de campos.
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Objetivos do Projeto</h3>

        <div className="space-y-6">
          <div>
            <Label htmlFor="objetivoGeral">Objetivo Geral *</Label>
            <Textarea
              id="objetivoGeral"
              {...register("objetivoGeral")}
              placeholder="Ex: Ampliar a oferta de serviços de reabilitação para pessoas com deficiência física no município de..."
              rows={4}
              className="mt-1"
            />
            <p className="text-sm text-muted-foreground mt-1">
              O objetivo geral deve expressar o que se pretende alcançar com o projeto de forma ampla.
            </p>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <Label htmlFor="objetivosEspecificos">Objetivos Específicos *</Label>
              <Button type="button" size="sm" variant="outline" onClick={handleGenerateObjetivos} disabled={isGenerating || !objetivoGeral}>
                <Sparkles className="h-4 w-4 mr-2" />
                {isGenerating ? "Gerando..." : "Gerar com IA"}
              </Button>
            </div>
            <Textarea
              id="objetivosEspecificos"
              {...register("objetivosEspecificos")}
              placeholder="Liste os objetivos específicos (um por linha)..."
              rows={8}
              className="mt-1"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Os objetivos específicos devem ser mensuráveis e contribuir para o alcance do objetivo geral. Liste um objetivo por linha.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}