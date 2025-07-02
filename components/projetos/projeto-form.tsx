"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useStore, Projeto } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { InfoGeraisTab } from "./tabs/info-gerais-tab"
import { JustificativaTab } from "./tabs/justificativa-tab"
import { ObjetivosTab } from "./tabs/objetivos-tab"
import { PublicoAlvoTab } from "./tabs/publico-alvo-tab"
import { MetodologiaTab } from "./tabs/metodologia-tab"
import { OrcamentoTab } from "./tabs/orcamento-tab"
import { AnexosTab } from "./tabs/anexos-tab"
import { useForm, FormProvider } from "react-hook-form"

interface ProjetoFormProps {
  projetoId: string
}

export function ProjetoForm({ projetoId }: ProjetoFormProps) {
  const router = useRouter()
  const { projetos, updateProjeto } = useStore()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("info-gerais")

  const projeto = projetos.find((p) => p.id === projetoId)
  
  const methods = useForm<Projeto>({
    defaultValues: projeto,
  })

  useEffect(() => {
    if (!projeto) {
      router.push("/projetos")
    } else {
        // Reseta o formulário com os valores mais recentes do projeto sempre que ele mudar
        methods.reset(projeto)
    }
  }, [projeto, router, methods])

  if (!projeto) {
    return null
  }

  const handleSave = (data: Partial<Projeto>) => {
    updateProjeto(projetoId, {
      ...data,
      updatedAt: new Date().toISOString(),
    })

    toast({
      title: "Projeto salvo",
      description: "As alterações foram salvas com sucesso.",
    })
  }
  
  const handleComplete = (data: Partial<Projeto>) => {
    updateProjeto(projetoId, {
      ...data,
      status: "concluido",
      updatedAt: new Date().toISOString(),
    })

    toast({
      title: "Projeto concluído",
      description: "O projeto foi marcado como concluído.",
    })

    router.push("/projetos")
  }

  const tabs = [
    { id: "info-gerais", label: "Info Gerais", component: InfoGeraisTab },
    { id: "justificativa", label: "Justificativa", component: JustificativaTab },
    { id: "objetivos", label: "Objetivos", component: ObjetivosTab },
    { id: "publico-alvo", label: "Público-Alvo", component: PublicoAlvoTab },
    { id: "metodologia", label: "Metodologia", component: MetodologiaTab },
    { id: "orcamento", label: "Orçamento", component: OrcamentoTab },
    { id: "anexos", label: "Anexos & Docs", component: AnexosTab },
  ]

  return (
    <FormProvider {...methods}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/projetos")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{methods.watch("titulo") || "Novo Projeto PRONAS/PCD"}</h1>
              <p className="text-muted-foreground">Elaboração de projeto médico-assistencial</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={methods.handleSubmit(handleSave)}>
              <Save className="h-4 w-4 mr-2" />
              Salvar Rascunho
            </Button>
            <Button onClick={methods.handleSubmit(handleComplete)}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Concluir Projeto
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="border-b px-6 py-4">
                <TabsList className="grid w-full grid-cols-7">
                  {tabs.map((tab) => (
                    <TabsTrigger key={tab.id} value={tab.id} className="text-xs">
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {tabs.map((tab) => (
                <TabsContent key={tab.id} value={tab.id} className="p-6">
                  {/* @ts-ignore */}
                  <tab.component onSave={handleSave} />
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </FormProvider>
  )
}