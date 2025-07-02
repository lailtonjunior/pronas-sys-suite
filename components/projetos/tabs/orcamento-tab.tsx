"use client"

import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Essas listas podem ser movidas para um arquivo de constantes no futuro
const profissionaisComuns = [
  { tipo: "Médico Especialista", salario: 15000 },
  { tipo: "Fisioterapeuta", salario: 4500 },
  { tipo: "Terapeuta Ocupacional", salario: 4200 },
  // ... resto da lista
];

const materiaisComuns = [
  { nome: "Material de Escritório", unidade: "Kit", valor: 200 },
  { nome: "Material de Limpeza", unidade: "Kit", valor: 150 },
  // ... resto da lista
];

const equipamentosComuns = [
  { nome: "Computador Desktop", valor: 3000 },
  { nome: "Impressora Multifuncional", valor: 1500 },
  // ... resto da lista
];

const OrcamentoItem = ({ control, name, commonItems, onSelect, fields, renderFields, title }: any) => {
  const { fields: items, append, remove } = useFieldArray({
    control,
    name,
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
          </div>
          <Button type="button" onClick={() => append(fields)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id} className="grid gap-4 md:grid-cols-6 p-4 border rounded-lg">
              {renderFields(index, commonItems, onSelect)}
              <div className="flex items-end">
                <Button type="button" variant="outline" size="icon" onClick={() => remove(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-center text-muted-foreground py-8">Nenhum item adicionado</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function OrcamentoTab() {
  const { control, watch, setValue } = useFormContext();
  const orcamento = watch("orcamento");

  const calcularTotal = () => {
    const totalRH = orcamento?.recursosHumanos?.reduce((sum: number, item: any) => sum + (Number(item.salario) || 0) * (Number(item.meses) || 0), 0) || 0;
    const totalMaterial = orcamento?.materialConsumo?.reduce((sum: number, item: any) => sum + (Number(item.quantidade) || 0) * (Number(item.valorUnit) || 0), 0) || 0;
    const totalEquipamentos = orcamento?.equipamentos?.reduce((sum: number, item: any) => sum + (Number(item.quantidade) || 0) * (Number(item.valorUnit) || 0), 0) || 0;
    return totalRH + totalMaterial + totalEquipamentos;
  };

  const totalGeral = calcularTotal();

  const handleSelectProfissional = (index: number, tipo: string) => {
    const profissional = profissionaisComuns.find(p => p.tipo === tipo);
    if (profissional) {
        setValue(`orcamento.recursosHumanos.${index}.cargo`, profissional.tipo);
        setValue(`orcamento.recursosHumanos.${index}.salario`, profissional.salario);
    }
  }

  // Funções similares podem ser criadas para handleSelectMaterial e handleSelectEquipamento

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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recursos-humanos">Recursos Humanos</TabsTrigger>
          <TabsTrigger value="material-consumo">Material de Consumo</TabsTrigger>
          <TabsTrigger value="equipamentos">Equipamentos</TabsTrigger>
        </TabsList>
        <TabsContent value="recursos-humanos">
            <OrcamentoItem 
                control={control}
                name="orcamento.recursosHumanos"
                commonItems={profissionaisComuns}
                onSelect={handleSelectProfissional}
                title="Recursos Humanos"
                fields={{ tipo: "", cargo: "", chSemanal: "", salario: 0, meses: 12 }}
                renderFields={(index: number, items: any[], onSelectItem: Function) => (
                    <>
                        <Controller
                            control={control}
                            name={`orcamento.recursosHumanos.${index}.tipo`}
                            render={({ field }) => (
                                <Select onValueChange={(value) => { field.onChange(value); onSelectItem(index, value); }} value={field.value}>
                                    <SelectTrigger><SelectValue placeholder="Selecionar Tipo" /></SelectTrigger>
                                    <SelectContent>
                                        {items.map(p => <SelectItem key={p.tipo} value={p.tipo}>{p.tipo}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        <Controller control={control} name={`orcamento.recursosHumanos.${index}.cargo`} render={({ field }) => <Input {...field} placeholder="Cargo" />} />
                        <Controller control={control} name={`orcamento.recursosHumanos.${index}.salario`} render={({ field }) => <Input {...field} type="number" placeholder="Salário" />} />
                        <Controller control={control} name={`orcamento.recursosHumanos.${index}.meses`} render={({ field }) => <Input {...field} type="number" placeholder="Meses" />} />
                    </>
                )}
            />
        </TabsContent>
        {/* Adicionar TabsContent para Material e Equipamentos seguindo o mesmo padrão */}
      </Tabs>
    </div>
  )
}