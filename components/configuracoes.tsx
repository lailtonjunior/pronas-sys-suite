"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Settings } from "lucide-react"

export function Configuracoes() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">Configure as preferências do sistema</p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Settings className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Configurações em Desenvolvimento</h3>
          <p className="text-muted-foreground text-center">
            Esta seção será implementada em versões futuras do sistema.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
