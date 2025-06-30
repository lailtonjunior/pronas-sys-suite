"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface OrcamentoTabProps {
  projeto: any
  onSave: (data: any) => void
}

const profissionaisComuns = [
  { tipo: "Médico Especialista", salario: 15000 },
  { tipo: "Fisioterapeuta", salario: 4500 },
  { tipo: "Terapeuta Ocupacional", salario: 4200 },
  { tipo: "Fonoaudiólogo", salario: 4000 },
  { tipo: "Psicólogo", salario: 4000 },
  { tipo: "Assistente Social", salario: 3800 },
  { tipo: "Enfermeiro", salario: 4200 },
  { tipo: "Técnico em Enfermagem", salario: 2800 },
]

const materiaisComuns = [
  { nome: "Material de Escritório", unidade: "Kit", valor: 200 },
  { nome: "Material de Limpeza", unidade: "Kit", valor: 150 },
  { nome: "Material Médico-Hospitalar", unidade: "Kit", valor: 500 },
  { nome: "Medicamentos", unidade: "Kit", valor: 800 },
]

const equipamentosComuns = [
  { nome: "Computador Desktop", valor: 3000 },
  { nome: "Impressora Multifuncional", valor: 1500 },
  { nome: "Cadeira de Rodas", valor: 2000 },
  { nome: "Equipamento de Fisioterapia", valor: 8000 },
]

export function OrcamentoTab({ projeto, onSave }: OrcamentoTabProps) {
  const [orcamento, setOrcamento] = useState(
    projeto.orcamento || {
      recursosHumanos: [],
      materialConsumo: [],
      equipamentos: [],
      servicosTerceiros: [],
      despesasAdmin: [],
      despesasElaboracao: [],
    },
  )

  const calcularTotal = () => {
    const totalRH = orcamento.recursosHumanos.reduce((sum: number, item: any) => sum + item.salario * item.meses, 0)
    const totalMaterial = orcamento.materialConsumo.reduce(
      (sum: number, item: any) => sum + item.quantidade * item.valorUnit,
      0,
    )
    const totalEquipamentos = orcamento.equipamentos.reduce(
      (sum: number, item: any) => sum + item.quantidade * item.valorUnit,
      0,
    )
    const totalServicos = orcamento.servicosTerceiros.reduce((sum: number, item: any) => sum + item.valor, 0)
    const totalAdmin = orcamento.despesasAdmin.reduce(
      (sum: number, item: any) => sum + item.valorMensal * item.meses,
      0,
    )
    const totalElaboracao = orcamento.despesasElaboracao.reduce((sum: number, item: any) => sum + item.valor, 0)

    return totalRH + totalMaterial + totalEquipamentos + totalServicos + totalAdmin + totalElaboracao
  }

  const adicionarRecursoHumano = () => {
    const novoItem = {
      id: Date.now(),
      tipo: "",
      cargo: "",
      chSemanal: "",
      salario: 0,
      meses: "",
    }
    setOrcamento({
      ...orcamento,
      recursosHumanos: [...orcamento.recursosHumanos, novoItem],
    })
  }

  const removerRecursoHumano = (id: number) => {
    setOrcamento({
      ...orcamento,
      recursosHumanos: orcamento.recursosHumanos.filter((item: any) => item.id !== id),
    })
  }

  const atualizarRecursoHumano = (id: number, campo: string, valor: any) => {
    setOrcamento({
      ...orcamento,
      recursosHumanos: orcamento.recursosHumanos.map((item: any) =>
        item.id === id ? { ...item, [campo]: valor } : item,
      ),
    })
  }

  const selecionarProfissional = (id: number, tipoProfissional: string) => {
    const profissional = profissionaisComuns.find((p) => p.tipo === tipoProfissional)
    if (profissional) {
      atualizarRecursoHumano(id, "tipo", profissional.tipo)
      atualizarRecursoHumano(id, "cargo", profissional.tipo)
      atualizarRecursoHumano(id, "salario", profissional.salario)
    }
  }

  const adicionarMaterial = () => {
    const novoItem = {
      id: Date.now(),
      material: "",
      descricao: "",
      unidade: "",
      quantidade: 0,
      valorUnit: 0,
    }
    setOrcamento({
      ...orcamento,
      materialConsumo: [...orcamento.materialConsumo, novoItem],
    })
  }

  const removerMaterial = (id: number) => {
    setOrcamento({
      ...orcamento,
      materialConsumo: orcamento.materialConsumo.filter((item: any) => item.id !== id),
    })
  }

  const atualizarMaterial = (id: number, campo: string, valor: any) => {
    setOrcamento({
      ...orcamento,
      materialConsumo: orcamento.materialConsumo.map((item: any) =>
        item.id === id ? { ...item, [campo]: valor } : item,
      ),
    })
  }

  const selecionarMaterial = (id: number, materialComum: string) => {
    const material = materiaisComuns.find((m) => m.nome === materialComum)
    if (material) {
      atualizarMaterial(id, "material", material.nome)
      atualizarMaterial(id, "descricao", material.nome)
      atualizarMaterial(id, "unidade", material.unidade)
      atualizarMaterial(id, "valorUnit", material.valor)
    }
  }

  const adicionarEquipamento = () => {
    const novoItem = {
      id: Date.now(),
      equipamento: "",
      descricao: "",
      quantidade: 0,
      valorUnit: 0,
    }
    setOrcamento({
      ...orcamento,
      equipamentos: [...orcamento.equipamentos, novoItem],
    })
  }

  const removerEquipamento = (id: number) => {
    setOrcamento({
      ...orcamento,
      equipamentos: orcamento.equipamentos.filter((item: any) => item.id !== id),
    })
  }

  const atualizarEquipamento = (id: number, campo: string, valor: any) => {
    setOrcamento({
      ...orcamento,
      equipamentos: orcamento.equipamentos.map((item: any) => (item.id === id ? { ...item, [campo]: valor } : item)),
    })
  }

  const selecionarEquipamento = (id: number, equipamentoComum: string) => {
    const equipamento = equipamentosComuns.find((e) => e.nome === equipamentoComum)
    if (equipamento) {
      atualizarEquipamento(id, "equipamento", equipamento.nome)
      atualizarEquipamento(id, "descricao", equipamento.nome)
      atualizarEquipamento(id, "valorUnit", equipamento.valor)
    }
  }

  const adicionarServico = () => {
    const novoItem = {
      id: Date.now(),
      descricao: "",
      valor: 0,
      observacoes: "",
    }
    setOrcamento({
      ...orcamento,
      servicosTerceiros: [...orcamento.servicosTerceiros, novoItem],
    })
  }

  const removerServico = (id: number) => {
    setOrcamento({
      ...orcamento,
      servicosTerceiros: orcamento.servicosTerceiros.filter((item: any) => item.id !== id),
    })
  }

  const atualizarServico = (id: number, campo: string, valor: any) => {
    setOrcamento({
      ...orcamento,
      servicosTerceiros: orcamento.servicosTerceiros.map((item: any) =>
        item.id === id ? { ...item, [campo]: valor } : item,
      ),
    })
  }

  const adicionarDespesaAdmin = () => {
    const novoItem = {
      id: Date.now(),
      descricao: "",
      valorMensal: 0,
      meses: 0,
      observacoes: "",
    }
    setOrcamento({
      ...orcamento,
      despesasAdmin: [...orcamento.despesasAdmin, novoItem],
    })
  }

  const removerDespesaAdmin = (id: number) => {
    setOrcamento({
      ...orcamento,
      despesasAdmin: orcamento.despesasAdmin.filter((item: any) => item.id !== id),
    })
  }

  const atualizarDespesaAdmin = (id: number, campo: string, valor: any) => {
    setOrcamento({
      ...orcamento,
      despesasAdmin: orcamento.despesasAdmin.map((item: any) => (item.id === id ? { ...item, [campo]: valor } : item)),
    })
  }

  const adicionarDespesaElaboracao = () => {
    const novoItem = {
      id: Date.now(),
      descricao: "",
      valor: 0,
    }
    setOrcamento({
      ...orcamento,
      despesasElaboracao: [...orcamento.despesasElaboracao, novoItem],
    })
  }

  const removerDespesaElaboracao = (id: number) => {
    setOrcamento({
      ...orcamento,
      despesasElaboracao: orcamento.despesasElaboracao.filter((item: any) => item.id !== id),
    })
  }

  const atualizarDespesaElaboracao = (id: number, campo: string, valor: any) => {
    setOrcamento({
      ...orcamento,
      despesasElaboracao: orcamento.despesasElaboracao.map((item: any) =>
        item.id === id ? { ...item, [campo]: valor } : item,
      ),
    })
  }

  const handleSave = () => {
    onSave({ orcamento })
  }

  const totalGeral = calcularTotal()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Orçamento Detalhado</h3>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Valor Total do Projeto</p>
          <p className="text-2xl font-bold text-green-600">
            R$ {totalGeral.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <Tabs defaultValue="recursos-humanos" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="recursos-humanos" className="text-xs">
            RH
          </TabsTrigger>
          <TabsTrigger value="material-consumo" className="text-xs">
            Material
          </TabsTrigger>
          <TabsTrigger value="equipamentos" className="text-xs">
            Equipamentos
          </TabsTrigger>
          <TabsTrigger value="servicos" className="text-xs">
            Serviços
          </TabsTrigger>
          <TabsTrigger value="admin" className="text-xs">
            Admin
          </TabsTrigger>
          <TabsTrigger value="elaboracao" className="text-xs">
            Elaboração
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recursos-humanos" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recursos Humanos</CardTitle>
                  <CardDescription>Profissionais envolvidos no projeto</CardDescription>
                </div>
                <Button onClick={adicionarRecursoHumano} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Profissional
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orcamento.recursosHumanos.map((item: any) => (
                  <div key={item.id} className="grid gap-4 md:grid-cols-6 p-4 border rounded-lg">
                    <div>
                      <Label>Tipo de Profissional</Label>
                      <Select value={item.tipo} onValueChange={(value) => selecionarProfissional(item.id, value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar" />
                        </SelectTrigger>
                        <SelectContent>
                          {profissionaisComuns.map((prof) => (
                            <SelectItem key={prof.tipo} value={prof.tipo}>
                              {prof.tipo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Cargo/Função</Label>
                      <Input
                        value={item.cargo}
                        onChange={(e) => atualizarRecursoHumano(item.id, "cargo", e.target.value)}
                        placeholder="Cargo"
                      />
                    </div>
                    <div>
                      <Label>C.H. Semanal</Label>
                      <Input
                        value={item.chSemanal}
                        onChange={(e) => atualizarRecursoHumano(item.id, "chSemanal", e.target.value)}
                        placeholder="40h"
                      />
                    </div>
                    <div>
                      <Label>Salário Bruto</Label>
                      <Input
                        type="number"
                        value={item.salario}
                        onChange={(e) => atualizarRecursoHumano(item.id, "salario", Number(e.target.value))}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label>Nº Meses</Label>
                      <Input
                        type="number"
                        value={item.meses}
                        onChange={(e) => atualizarRecursoHumano(item.id, "meses", Number(e.target.value))}
                        placeholder="12"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button variant="outline" size="sm" onClick={() => removerRecursoHumano(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="md:col-span-6 text-right">
                      <p className="text-sm font-medium">
                        Subtotal: R$ {(item.salario * item.meses).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                ))}
                {orcamento.recursosHumanos.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">Nenhum profissional adicionado</p>
                )}
                <div className="text-right border-t pt-4">
                  <p className="text-lg font-semibold">
                    Total RH: R${" "}
                    {orcamento.recursosHumanos
                      .reduce((sum: number, item: any) => sum + item.salario * item.meses, 0)
                      .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="material-consumo" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Material de Consumo</CardTitle>
                  <CardDescription>Materiais que serão consumidos durante o projeto</CardDescription>
                </div>
                <Button onClick={adicionarMaterial} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Material
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orcamento.materialConsumo.map((item: any) => (
                  <div key={item.id} className="grid gap-4 md:grid-cols-6 p-4 border rounded-lg">
                    <div>
                      <Label>Material Comum</Label>
                      <Select value={item.material} onValueChange={(value) => selecionarMaterial(item.id, value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar" />
                        </SelectTrigger>
                        <SelectContent>
                          {materiaisComuns.map((mat) => (
                            <SelectItem key={mat.nome} value={mat.nome}>
                              {mat.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Descrição</Label>
                      <Input
                        value={item.descricao}
                        onChange={(e) => atualizarMaterial(item.id, "descricao", e.target.value)}
                        placeholder="Descrição"
                      />
                    </div>
                    <div>
                      <Label>Unidade</Label>
                      <Input
                        value={item.unidade}
                        onChange={(e) => atualizarMaterial(item.id, "unidade", e.target.value)}
                        placeholder="Un, Kit, etc"
                      />
                    </div>
                    <div>
                      <Label>Quantidade</Label>
                      <Input
                        type="number"
                        value={item.quantidade}
                        onChange={(e) => atualizarMaterial(item.id, "quantidade", Number(e.target.value))}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label>Valor Unit. (R$)</Label>
                      <Input
                        type="number"
                        value={item.valorUnit}
                        onChange={(e) => atualizarMaterial(item.id, "valorUnit", Number(e.target.value))}
                        placeholder="0"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button variant="outline" size="sm" onClick={() => removerMaterial(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="md:col-span-6 text-right">
                      <p className="text-sm font-medium">
                        Subtotal: R${" "}
                        {(item.quantidade * item.valorUnit).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                ))}
                {orcamento.materialConsumo.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">Nenhum material adicionado</p>
                )}
                <div className="text-right border-t pt-4">
                  <p className="text-lg font-semibold">
                    Total Material: R${" "}
                    {orcamento.materialConsumo
                      .reduce((sum: number, item: any) => sum + item.quantidade * item.valorUnit, 0)
                      .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipamentos" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Equipamentos e Material Permanente</CardTitle>
                  <CardDescription>Equipamentos que permanecerão na instituição</CardDescription>
                </div>
                <Button onClick={adicionarEquipamento} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Equipamento
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orcamento.equipamentos.map((item: any) => (
                  <div key={item.id} className="grid gap-4 md:grid-cols-5 p-4 border rounded-lg">
                    <div>
                      <Label>Equipamento Comum</Label>
                      <Select value={item.equipamento} onValueChange={(value) => selecionarEquipamento(item.id, value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar" />
                        </SelectTrigger>
                        <SelectContent>
                          {equipamentosComuns.map((eq) => (
                            <SelectItem key={eq.nome} value={eq.nome}>
                              {eq.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Descrição</Label>
                      <Input
                        value={item.descricao}
                        onChange={(e) => atualizarEquipamento(item.id, "descricao", e.target.value)}
                        placeholder="Descrição"
                      />
                    </div>
                    <div>
                      <Label>Quantidade</Label>
                      <Input
                        type="number"
                        value={item.quantidade}
                        onChange={(e) => atualizarEquipamento(item.id, "quantidade", Number(e.target.value))}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label>Valor Unit. (R$)</Label>
                      <Input
                        type="number"
                        value={item.valorUnit}
                        onChange={(e) => atualizarEquipamento(item.id, "valorUnit", Number(e.target.value))}
                        placeholder="0"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button variant="outline" size="sm" onClick={() => removerEquipamento(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="md:col-span-5 text-right">
                      <p className="text-sm font-medium">
                        Subtotal: R${" "}
                        {(item.quantidade * item.valorUnit).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                ))}
                {orcamento.equipamentos.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">Nenhum equipamento adicionado</p>
                )}
                <div className="text-right border-t pt-4">
                  <p className="text-lg font-semibold">
                    Total Equipamentos: R${" "}
                    {orcamento.equipamentos
                      .reduce((sum: number, item: any) => sum + item.quantidade * item.valorUnit, 0)
                      .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="servicos" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Serviços de Terceiros</CardTitle>
                  <CardDescription>Serviços contratados de terceiros</CardDescription>
                </div>
                <Button onClick={adicionarServico} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Serviço
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orcamento.servicosTerceiros.map((item: any) => (
                  <div key={item.id} className="grid gap-4 md:grid-cols-4 p-4 border rounded-lg">
                    <div>
                      <Label>Descrição do Serviço</Label>
                      <Input
                        value={item.descricao}
                        onChange={(e) => atualizarServico(item.id, "descricao", e.target.value)}
                        placeholder="Descrição"
                      />
                    </div>
                    <div>
                      <Label>Valor Total (R$)</Label>
                      <Input
                        type="number"
                        value={item.valor}
                        onChange={(e) => atualizarServico(item.id, "valor", Number(e.target.value))}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label>Observações</Label>
                      <Textarea
                        value={item.observacoes}
                        onChange={(e) => atualizarServico(item.id, "observacoes", e.target.value)}
                        placeholder="Referências de cotações..."
                        rows={2}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button variant="outline" size="sm" onClick={() => removerServico(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {orcamento.servicosTerceiros.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">Nenhum serviço adicionado</p>
                )}
                <div className="text-right border-t pt-4">
                  <p className="text-lg font-semibold">
                    Total Serviços: R${" "}
                    {orcamento.servicosTerceiros
                      .reduce((sum: number, item: any) => sum + item.valor, 0)
                      .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admin" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Despesas Administrativas</CardTitle>
                  <CardDescription>Despesas operacionais do projeto</CardDescription>
                </div>
                <Button onClick={adicionarDespesaAdmin} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Despesa
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orcamento.despesasAdmin.map((item: any) => (
                  <div key={item.id} className="grid gap-4 md:grid-cols-5 p-4 border rounded-lg">
                    <div>
                      <Label>Descrição</Label>
                      <Input
                        value={item.descricao}
                        onChange={(e) => atualizarDespesaAdmin(item.id, "descricao", e.target.value)}
                        placeholder="Ex: Energia elétrica"
                      />
                    </div>
                    <div>
                      <Label>Valor Mensal (R$)</Label>
                      <Input
                        type="number"
                        value={item.valorMensal}
                        onChange={(e) => atualizarDespesaAdmin(item.id, "valorMensal", Number(e.target.value))}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label>Nº de Meses</Label>
                      <Input
                        type="number"
                        value={item.meses}
                        onChange={(e) => atualizarDespesaAdmin(item.id, "meses", Number(e.target.value))}
                        placeholder="12"
                      />
                    </div>
                    <div>
                      <Label>Observações</Label>
                      <Textarea
                        value={item.observacoes}
                        onChange={(e) => atualizarDespesaAdmin(item.id, "observacoes", e.target.value)}
                        placeholder="Ref. últimas faturas..."
                        rows={2}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button variant="outline" size="sm" onClick={() => removerDespesaAdmin(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="md:col-span-5 text-right">
                      <p className="text-sm font-medium">
                        Subtotal: R${" "}
                        {(item.valorMensal * item.meses).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                ))}
                {orcamento.despesasAdmin.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">Nenhuma despesa administrativa adicionada</p>
                )}
                <div className="text-right border-t pt-4">
                  <p className="text-lg font-semibold">
                    Total Desp. Admin.: R${" "}
                    {orcamento.despesasAdmin
                      .reduce((sum: number, item: any) => sum + item.valorMensal * item.meses, 0)
                      .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="elaboracao" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Despesas com Elaboração e Captação</CardTitle>
                  <CardDescription>Limitado a 5% do valor total ou R$ 50.000,00 (o que for menor)</CardDescription>
                </div>
                <Button onClick={adicionarDespesaElaboracao} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Despesa
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orcamento.despesasElaboracao.map((item: any) => (
                  <div key={item.id} className="grid gap-4 md:grid-cols-3 p-4 border rounded-lg">
                    <div>
                      <Label>Descrição</Label>
                      <Input
                        value={item.descricao}
                        onChange={(e) => atualizarDespesaElaboracao(item.id, "descricao", e.target.value)}
                        placeholder="Ex: Consultoria especializada"
                      />
                    </div>
                    <div>
                      <Label>Valor Total (R$)</Label>
                      <Input
                        type="number"
                        value={item.valor}
                        onChange={(e) => atualizarDespesaElaboracao(item.id, "valor", Number(e.target.value))}
                        placeholder="0"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button variant="outline" size="sm" onClick={() => removerDespesaElaboracao(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {orcamento.despesasElaboracao.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhuma despesa de elaboração/captação adicionada
                  </p>
                )}
                <div className="text-right border-t pt-4">
                  <p className="text-lg font-semibold">
                    Total Elaboração/Captação: R${" "}
                    {orcamento.despesasElaboracao
                      .reduce((sum: number, item: any) => sum + item.valor, 0)
                      .toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Limite: R${" "}
                    {Math.min(totalGeral * 0.05, 50000).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Salvar Orçamento</Button>
      </div>
    </div>
  )
}
