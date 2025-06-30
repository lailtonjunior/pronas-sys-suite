"use client"

import { Building2, Mail, Phone } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"

export function InstituicoesList() {
  const { instituicoes } = useStore()

  if (instituicoes.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhuma instituição cadastrada</h3>
          <p className="text-muted-foreground text-center">
            Comece cadastrando sua primeira instituição cliente para criar projetos PRONAS/PCD.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {instituicoes.map((instituicao) => (
        <Card key={instituicao.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg">{instituicao.razaoSocial}</CardTitle>
                {instituicao.nomeFantasia && (
                  <CardDescription className="mt-1">{instituicao.nomeFantasia}</CardDescription>
                )}
              </div>
              <Building2 className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">CNPJ: {instituicao.cnpj}</Badge>
              <Badge variant="outline">CNES: {instituicao.cnes}</Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                {instituicao.telefone}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                {instituicao.email}
              </div>
            </div>

            <div className="pt-2 border-t">
              <p className="text-sm">
                <span className="font-medium">Representante:</span> {instituicao.representanteLegal}
              </p>
              <p className="text-sm text-muted-foreground">{instituicao.cargoRepresentante}</p>
            </div>

            <div className="text-xs text-muted-foreground">
              Cadastrado em {new Date(instituicao.createdAt).toLocaleDateString("pt-BR")}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
