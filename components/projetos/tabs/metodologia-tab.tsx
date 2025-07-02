"use client"

import { useFormContext, Controller } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function MetodologiaTab({ onSave }: { onSave: (data: any) => void }) {
  const { register, handleSubmit, control } = useFormContext() // Usando o contexto

  const onSubmit = (data: any) => {
    // A função onSave ainda pode ser chamada, mas os dados vêm do handleSubmit principal
    // Esta função pode ser simplificada ou removida se o botão for movido para o componente pai.
    onSave(data)
  }

  return (
    // Removido o <form> daqui, pois agora ele está no componente pai 'projeto-form.tsx'
    <div className="space-y-6">
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
            <Controller
              name="registroCIHA"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione uma opção" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sim">Sim</SelectItem>
                    <SelectItem value="nao-se-aplica">Não se aplica</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
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
        {/* Este botão agora salva o formulário inteiro, o que é um comportamento esperado */}
        <Button type="button" onClick={handleSubmit(onSubmit)}>Salvar Metodologia</Button>
      </div>
    </div>
  )
}