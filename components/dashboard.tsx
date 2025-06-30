"use client"

import { Building2, FileText, TrendingUp, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useStore } from "@/lib/store"

export function Dashboard() {
  const { instituicoes, projetos } = useStore()

  const stats = [
    {
      title: "Instituições Cadastradas",
      value: instituicoes.length,
      description: "Total de instituições no sistema",
      icon: Building2,
      color: "text-blue-600",
    },
    {
      title: "Projetos em Elaboração",
      value: projetos.filter((p) => p.status === "rascunho").length,
      description: "Projetos sendo desenvolvidos",
      icon: FileText,
      color: "text-orange-600",
    },
    {
      title: "Projetos Concluídos",
      value: projetos.filter((p) => p.status === "concluido").length,
      description: "Projetos finalizados",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Total de Projetos",
      value: projetos.length,
      description: "Todos os projetos no sistema",
      icon: Users,
      color: "text-purple-600",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do sistema PRONASys Suite</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>Últimas ações realizadas no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projetos.slice(0, 5).map((projeto) => (
                <div key={projeto.id} className="flex items-center space-x-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{projeto.titulo || "Projeto sem título"}</p>
                    <p className="text-sm text-muted-foreground">Status: {projeto.status}</p>
                  </div>
                </div>
              ))}
              {projetos.length === 0 && <p className="text-sm text-muted-foreground">Nenhum projeto encontrado</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximos Passos</CardTitle>
            <CardDescription>Sugestões para otimizar seu fluxo de trabalho</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                  <Building2 className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Cadastrar nova instituição</p>
                  <p className="text-sm text-muted-foreground">Expanda sua base de clientes</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                  <FileText className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Criar novo projeto</p>
                  <p className="text-sm text-muted-foreground">Inicie uma nova proposta PRONAS/PCD</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
