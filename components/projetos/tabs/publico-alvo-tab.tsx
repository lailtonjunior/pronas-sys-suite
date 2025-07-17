"use client"

import { useFormContext } from "react-hook-form" // Importado useFormContext
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function PublicoAlvoTab() {
  const { register } = useFormContext() // Utiliza o contexto do formulário pai

  return (
    // O <form> e o botão de submit foram removidos
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Caracterização do Público-Alvo</h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="faixaEtaria">Faixa Etária *</Label>
            <Input id="faixaEtaria" {...register("faixaEtaria")} placeholder="Ex: 0 a 18 anos" className="mt-1" />
          </div>

          <div>
            <Label htmlFor="tiposDeficiencia">Tipos de Deficiência *</Label>
            <Input
              id="tiposDeficiencia"
              {...register("tiposDeficiencia")}
              placeholder="Ex: Física, Intelectual, Visual..."
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="novosUsuarios">Nº Estimado de Novos Usuários *</Label>
            <Input
              id="novosUsuarios"
              type="number"
              {...register("novosUsuarios")}
              placeholder="Ex: 100"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="usuariosAtuais">Nº Estimado de Usuários Atuais</Label>
            <Input
              id="usuariosAtuais"
              type="number"
              {...register("usuariosAtuais")}
              placeholder="Ex: 50"
              className="mt-1"
            />
          </div>
        </div>

        <div className="mt-6">
          <Label htmlFor="criteriosInclusao">Critérios de Inclusão *</Label>
          <Textarea
            id="criteriosInclusao"
            {...register("criteriosInclusao")}
            placeholder="Descreva os critérios para inclusão no projeto..."
            rows={4}
            className="mt-1"
          />
          <p className="text-sm text-muted-foreground mt-1">
            Especifique os critérios que definem quem pode ser atendido pelo projeto
          </p>
        </div>
      </div>
    </div>
  )
}