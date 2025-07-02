"use client"

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"
import { formatCNPJ, formatPhone, formatCEP } from "@/lib/utils"
import { useState } from "react"
import { Search } from "lucide-react"

interface InstituicaoFormData {
  razaoSocial: string
  nomeFantasia: string
  cnpj: string
  cnes: string
  telefone: string
  email: string
  endereco: string
  cidade: string
  estado: string
  cep: string
  representanteLegal: string
  cargoRepresentante: string
  observacoes: string
}

interface InstituicaoFormProps {
  onCancel: () => void
}

export function InstituicaoForm({ onCancel }: InstituicaoFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<InstituicaoFormData>()
  const { addInstituicao } = useStore()
  const { toast } = useToast()
  const [isFetching, setIsFetching] = useState(false)

  const onSubmit = (data: InstituicaoFormData) => {
    addInstituicao({
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
    })

    toast({
      title: "Instituição cadastrada",
      description: "A instituição foi cadastrada com sucesso.",
    })

    onCancel()
  }

  const handleFetchDataByCnpj = async () => {
    const cnpj = watch("cnpj")
    if (!cnpj || cnpj.replace(/\D/g, '').length !== 14) {
      toast({
        variant: "destructive",
        title: "CNPJ inválido",
        description: "Por favor, preencha um CNPJ válido com 14 dígitos.",
      })
      return
    }

    setIsFetching(true)
    // Simulação de chamada a uma API da Receita Federal
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Dados simulados
    setValue("razaoSocial", "ASSOCIAÇÃO DE PAIS E AMIGOS DOS EXCEPCIONAIS DE SÃO PAULO")
    setValue("nomeFantasia", "APAE DE SÃO PAULO")
    setValue("endereco", "Rua dos Bobos, Nº 0")
    setValue("cidade", "São Paulo")
    setValue("estado", "SP")
    setValue("cep", "01000-000")
    setValue("telefone", "(11) 5080-7000")
    setValue("email", "contato@apaesp.org.br")
    setIsFetching(false)

    toast({
      title: "Dados preenchidos",
      description: "As informações da instituição foram carregadas com sucesso.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cadastro de Nova Instituição</CardTitle>
        <CardDescription>Preencha os dados da instituição. Para agilizar, preencha o CNPJ e clique em "Buscar Dados".</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="cnpj">CNPJ *</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="cnpj"
                  {...register("cnpj", { required: "CNPJ é obrigatório" })}
                  onChange={(e) => {
                    const formatted = formatCNPJ(e.target.value)
                    setValue("cnpj", formatted)
                  }}
                  placeholder="00.000.000/0000-00"
                  className={errors.cnpj ? "border-red-500" : ""}
                />
                <Button type="button" variant="outline" size="icon" onClick={handleFetchDataByCnpj} disabled={isFetching}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              {errors.cnpj && <p className="text-sm text-red-500 mt-1">{errors.cnpj.message}</p>}
            </div>

            <div>
              <Label htmlFor="cnes">CNES *</Label>
              <Input
                id="cnes"
                {...register("cnes", { required: "CNES é obrigatório" })}
                className={errors.cnes ? "border-red-500" : ""}
              />
              {errors.cnes && <p className="text-sm text-red-500 mt-1">{errors.cnes.message}</p>}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="razaoSocial">Razão Social *</Label>
              <Input
                id="razaoSocial"
                {...register("razaoSocial", { required: "Razão social é obrigatória" })}
                className={errors.razaoSocial ? "border-red-500" : ""}
              />
              {errors.razaoSocial && <p className="text-sm text-red-500 mt-1">{errors.razaoSocial.message}</p>}
            </div>

            <div>
              <Label htmlFor="nomeFantasia">Nome Fantasia</Label>
              <Input id="nomeFantasia" {...register("nomeFantasia")} />
            </div>
            
            <div>
              <Label htmlFor="telefone">Telefone *</Label>
              <Input
                id="telefone"
                {...register("telefone", { required: "Telefone é obrigatório" })}
                onChange={(e) => {
                  const formatted = formatPhone(e.target.value)
                  setValue("telefone", formatted)
                }}
                placeholder="(00) 00000-0000"
                className={errors.telefone ? "border-red-500" : ""}
              />
              {errors.telefone && <p className="text-sm text-red-500 mt-1">{errors.telefone.message}</p>}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                {...register("email", {
                  required: "E-mail é obrigatório",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "E-mail inválido",
                  },
                })}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="endereco">Endereço Completo *</Label>
              <Input
                id="endereco"
                {...register("endereco", { required: "Endereço é obrigatório" })}
                className={errors.endereco ? "border-red-500" : ""}
              />
              {errors.endereco && <p className="text-sm text-red-500 mt-1">{errors.endereco.message}</p>}
            </div>

            <div>
              <Label htmlFor="cidade">Cidade *</Label>
              <Input
                id="cidade"
                {...register("cidade", { required: "Cidade é obrigatória" })}
                className={errors.cidade ? "border-red-500" : ""}
              />
              {errors.cidade && <p className="text-sm text-red-500 mt-1">{errors.cidade.message}</p>}
            </div>

            <div>
              <Label htmlFor="estado">Estado *</Label>
              <Input
                id="estado"
                {...register("estado", { required: "Estado é obrigatório" })}
                className={errors.estado ? "border-red-500" : ""}
              />
              {errors.estado && <p className="text-sm text-red-500 mt-1">{errors.estado.message}</p>}
            </div>

            <div>
              <Label htmlFor="cep">CEP *</Label>
              <Input
                id="cep"
                {...register("cep", { required: "CEP é obrigatório" })}
                onChange={(e) => {
                  const formatted = formatCEP(e.target.value)
                  setValue("cep", formatted)
                }}
                placeholder="00000-000"
                className={errors.cep ? "border-red-500" : ""}
              />
              {errors.cep && <p className="text-sm text-red-500 mt-1">{errors.cep.message}</p>}
            </div>
            
            <div className="md:col-span-2"></div>


            <div>
              <Label htmlFor="representanteLegal">Representante Legal *</Label>
              <Input
                id="representanteLegal"
                {...register("representanteLegal", { required: "Representante legal é obrigatório" })}
                className={errors.representanteLegal ? "border-red-500" : ""}
              />
              {errors.representanteLegal && (
                <p className="text-sm text-red-500 mt-1">{errors.representanteLegal.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="cargoRepresentante">Cargo do Representante *</Label>
              <Input
                id="cargoRepresentante"
                {...register("cargoRepresentante", { required: "Cargo é obrigatório" })}
                className={errors.cargoRepresentante ? "border-red-500" : ""}
              />
              {errors.cargoRepresentante && (
                <p className="text-sm text-red-500 mt-1">{errors.cargoRepresentante.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                {...register("observacoes")}
                placeholder="Informações adicionais sobre a instituição..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit">Salvar Instituição</Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}