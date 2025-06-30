"use client"

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MetodologiaTabProps {
  projeto: any
  onSave: (data: any) => void
}

export function MetodologiaTab({ projeto, onSave }: MetodologiaTabProps) {
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: projeto,
  })

  const onSubmit = (data: any) => {
    onSave(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Metodologia de Atendimento</h3>

        <div className="space-y-6">
          <div>
            <Label htmlFor="metodologiaDetalhada">Descrição Detalhada das Práticas/Ações por Objetivo *</Label>
            <Textarea
              id="metodologiaDetalhada"
              {...register("metodologiaDetalhada")}
              placeholder="Descreva detalhadamente as práticas e ações que serão desenvolvidas para cada objetivo específico..."
              rows={6}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="planoPTS">Plano Terapêutico Singular (PTS) *</Label>
            <Textarea
              id="planoPTS"
              {...register("planoPTS")}
              placeholder="Descreva como será elaborado e implementado o Plano Terapêutico Singular..."
              rows={4}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="registroCIHA">Registro no CIHA (Centro Integrado de Habilitação e Reabilitação)</Label>
            <Select value={projeto.registroCIHA} onValueChange={(value) => setValue("registroCIHA", value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecione uma opção" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sim">Sim</SelectItem>
                <SelectItem value="nao-se-aplica">Não se aplica</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="outrosInstrumentos">Outros Instrumentos de Registro</Label>
            <Textarea
              id="outrosInstrumentos"
              {...register("outrosInstrumentos")}
              placeholder="Descreva outros instrumentos de registro que serão utilizados..."
              rows={3}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit">Salvar Metodologia</Button>
      </div>
    </form>
  )
}
