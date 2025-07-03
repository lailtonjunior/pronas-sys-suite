"use client"

import { Controller, useFormContext } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { useStore } from "@/lib/store"
import { Sparkles } from "lucide-react"
import { useState } from "react"

const camposAtuacao = [
  "I – Prestação de serviços médico‑assistenciais",
  "II – Formação, treinamento e aperfeiçoamento de recursos humanos em todos os níveis",
  "III – Realização de pesquisas clínicas, epidemiológicas, experimentais e sócio‑antropológicas",
];

const art10Data = [
  {
    inciso: "I",
    titulo: "Prestação de serviços médico-assistenciais e de apoio à saúde",
    alineas: [
      { id: "I-a", texto: "Qualificação de serviços de saúde (adequação da ambiência, NBR 9050/ABNT)" },
      { id: "I-b", texto: "Reabilitação/habilitação da pessoa com deficiência" },
      { id: "I-c", texto: "Diagnóstico diferencial da pessoa com deficiência" },
      { id: "I-d", texto: "Identificação e estimulação precoce das deficiências" },
      { id: "I-e", texto: "Adaptação, inserção e reinserção da pessoa com deficiência no trabalho" },
      { id: "I-f", texto: "Ampliação e manutenção das capacidades funcionais por meio de práticas esportivas" },
      { id: "I-g", texto: "Terapia assistida por animais (TAA)" },
      { id: "I-h", texto: "Produção artística e cultural" },
    ]
  },
  {
    inciso: "II",
    titulo: "Desenvolvimento de projetos de educação permanente, formação e capacitação de RH",
    alineas: [
        { id: "II-a", texto: "Formação técnica e capacitação em ortopedia técnica" },
        { id: "II-b", texto: "Uso de tecnologia assistiva na reabilitação/habilitação" },
        { id: "II-c", texto: "Acolhimento, manejo e ações no âmbito da atenção básica, especializada, hospitalar e de urgência/emergência" },
        { id: "II-d", texto: "Diagnóstico diferencial em doenças raras, deficiência intelectual e TEA" },
        { id: "II-e", texto: "Uso da Classificação Internacional de Funcionalidade (CIF)" },
        { id: "II-f", texto: "Uso de tecnologia de órtese robotizada de marcha e sua aplicação terapêutica em lesões neurológicas" },
    ]
  },
  {
    inciso: "III",
    titulo: "Desenvolvimento de projetos de pesquisas clínicas, epidemiológicas, experimentais e socioantropológicas",
    alineas: [
        { id: "III-a", texto: "Novos métodos diagnósticos e tratamentos em reabilitação/habilitação custo-efetivos" },
        { id: "III-b", texto: "Uso da CIF e sua aplicabilidade" },
        { id: "III-c", texto: "Uso de tecnologias assistivas (protocolo/diretrizes clínicas de OPM)" },
        { id: "III-d", texto: "Métodos diagnósticos e terapêuticos em doenças raras, deficiência intelectual e TEA" },
        { id: "III-e", texto: "Avaliação de políticas, serviços, programas e ações em reabilitação/habilitação" },
        { id: "III-f", texto: "Pesquisas básicas e pré-clínicas com potencial de translação" },
        { id: "III-g", texto: "Pesquisas em neurociências" },
        { id: "III-h", texto: "Pesquisas socioantropológicas sobre deficiências" },
        { id: "III-i", texto: "Pesquisas epidemiológicas sobre deficiências" },
        { id: "III-j", texto: "Pesquisas e desenvolvimento de inovações, tecnologias, dispositivos e/ou produtos de tecnologia assistiva (OPM)" },
    ]
  }
];

export function InfoGeraisTab() {
  const { control, register, setValue, watch } = useFormContext()
  const { instituicoes } = useStore()
  const [isGenerating, setIsGenerating] = useState(false)

  const generateResumo = async () => {
    const titulo = watch("titulo");
    if (!titulo) {
      alert("Por favor, preencha o título do projeto primeiro.")
      return
    }

    setIsGenerating(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      const campo = watch("campoAtuacao");
      const resumoGerado = `Este projeto visa implementar ações de ${campo || "reabilitação"} para pessoas com deficiência, promovendo a inclusão social e melhoria da qualidade de vida através de atendimentos especializados e multidisciplinares. O projeto "${titulo}" busca atender às necessidades específicas do público-alvo, contribuindo para o fortalecimento da rede de cuidados em saúde da pessoa com deficiência.`
      setValue("resumoIdeia", resumoGerado)
    } catch (error) {
      console.error("Erro ao gerar resumo:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Informações Gerais do Projeto</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {/* ... Campos de Instituição, Campo de Atuação, Título, Prazo ... (sem alterações) */}
          <div>
            <Label htmlFor="instituicaoId">Instituição Proponente *</Label>
            <Controller
              control={control}
              name="instituicaoId"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger><SelectValue placeholder="Selecione a instituição" /></SelectTrigger>
                  <SelectContent>
                    {instituicoes.map((instituicao) => (
                      <SelectItem key={instituicao.id} value={instituicao.id}>{instituicao.razaoSocial}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div>
            <Label htmlFor="campoAtuacao">Campo de Atuação PRONAS/PCD *</Label>
            <Controller
              control={control}
              name="campoAtuacao"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger><SelectValue placeholder="Selecione o campo" /></SelectTrigger>
                  <SelectContent>
                    {camposAtuacao.map((campo) => (<SelectItem key={campo} value={campo}>{campo}</SelectItem>))}
                  </SelectContent>
                </Select>
              )}
            />
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

      {/* NOVO COMPONENTE DE SELEÇÃO MÚLTIPLA PARA O ART. 10 */}
      <div>
        <Label>Áreas Prioritárias do Art. 10 *</Label>
        <p className="text-sm text-muted-foreground mb-2">Selecione uma ou mais áreas prioritárias que o projeto contempla.</p>
        <Card className="p-4">
            <Controller
                name="areasArt10"
                control={control}
                render={({ field }) => (
                    <Accordion type="multiple" className="w-full">
                        {art10Data.map((inciso) => (
                            <AccordionItem value={inciso.inciso} key={inciso.inciso}>
                                <AccordionTrigger className="text-left font-semibold">
                                    {inciso.inciso} - {inciso.titulo}
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="space-y-3 pl-2">
                                        {inciso.alineas.map((alinea) => (
                                            <div className="flex items-center space-x-3" key={alinea.id}>
                                                <Checkbox
                                                    id={alinea.id}
                                                    checked={field.value?.includes(alinea.id)}
                                                    onCheckedChange={(checked) => {
                                                        const currentValues = field.value || [];
                                                        return checked
                                                        ? field.onChange([...currentValues, alinea.id])
                                                        : field.onChange(currentValues.filter((value: string) => value !== alinea.id));
                                                    }}
                                                />
                                                <Label htmlFor={alinea.id} className="font-normal cursor-pointer">
                                                    {alinea.texto}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                )}
            />
        </Card>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="resumoIdeia">Resumo da Ideia Central do Projeto</Label>
          <Button type="button" variant="outline" size="sm" onClick={generateResumo} disabled={isGenerating}>
            <Sparkles className="h-4 w-4 mr-2" />
            {isGenerating ? "Gerando..." : "Gerar com IA"}
          </Button>
        </div>
        <Textarea id="resumoIdeia" {...register("resumoIdeia")} placeholder="Descreva brevemente a ideia central do projeto..." rows={4} />
      </div>

      <Card>
        {/* ... Card de Documentação Obrigatória ... (sem alterações) */}
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
    </div>
  )
}