"use client"

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface ObjetivosTabProps {
  projeto: any
  onSave: (data: any) => void
}

export function ObjetivosTab({ projeto, onSave }: ObjetivosTabProps) {
  const { register, handleSubmit } = useForm({
    defaultValues: projeto,
  })

  const onSubmit = (data: any) => {
    onSave(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Objetivos do Projeto</h3>

        <div className="space-y-6">
          <div>
            <Label htmlFor="objetivoGeral">Objetivo Geral *</Label>
            <Textarea
              id="objetivoGeral"
              {...register("objetivoGeral")}
              placeholder="Descreva o objetivo geral do projeto..."
              rows={4}
              className="mt-1"
            />
            <p className="text-sm text-muted-foreground mt-1">
              O objetivo geral deve expressar o que se pretende alcançar com o projeto de forma ampla
            </p>
          </div>

          <div>
            <Label htmlFor="objetivosEspecificos">Objetivos Específicos *</Label>
            <Textarea
              id="objetivosEspecificos"
              {...register("objetivosEspecificos")}
              placeholder="Liste os objetivos específicos (um por linha)..."
              rows={6}
              className="mt-1"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Os objetivos específicos devem ser mensuráveis e contribuir para o alcance do objetivo geral. Liste um
              objetivo por linha.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit">Salvar Objetivos</Button>
      </div>
    </form>
  )
}
