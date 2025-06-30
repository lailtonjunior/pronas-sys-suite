"use client"

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

interface JustificativaTabProps {
  projeto: any
  onSave: (data: any) => void
}

export function JustificativaTab({ projeto, onSave }: JustificativaTabProps) {
  const { register, handleSubmit } = useForm({
    defaultValues: projeto,
  })

  const onSubmit = (data: any) => {
    onSave(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Justificativa e Aplicabilidade</h3>

        <div className="space-y-6">
          <div>
            <Label htmlFor="problemacentral">Problema Central/Necessidade Identificada *</Label>
            <Textarea
              id="problemacentral"
              {...register("problemacentral")}
              placeholder="Descreva o problema central que o projeto pretende resolver..."
              rows={4}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="relevancia">Relevância do Projeto *</Label>
            <Textarea
              id="relevancia"
              {...register("relevancia")}
              placeholder="Explique a relevância e importância do projeto..."
              rows={4}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="solucaoProposta">Solução Proposta *</Label>
            <Textarea
              id="solucaoProposta"
              {...register("solucaoProposta")}
              placeholder="Descreva a solução que o projeto oferece..."
              rows={4}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="articulacaoSUS">Articulação com a Rede SUS *</Label>
            <Textarea
              id="articulacaoSUS"
              {...register("articulacaoSUS")}
              placeholder="Explique como o projeto se articula com a rede SUS..."
              rows={4}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="cartaAnuencia">Carta de Anuência do Gestor SUS</Label>
            <Input id="cartaAnuencia" type="file" accept=".pdf,.doc,.docx" className="mt-1" />
            <p className="text-sm text-muted-foreground mt-1">
              Documento obrigatório assinado pelo gestor municipal ou estadual de saúde
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit">Salvar Justificativa</Button>
      </div>
    </form>
  )
}
