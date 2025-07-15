"use client"

import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { Plus, Trash2, Sparkles, Loader2, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

// Essas listas podem ser movidas para um arquivo de constantes no futuro
const profissionaisComuns = [
  { tipo: "Médico Especialista", salario: 15000 },
  { tipo: "Fisioterapeuta", salario: 4500 },
  { tipo: "Terapeuta Ocupacional", salario: 4200 },
  { tipo: "Fonoaudiólogo", salario: 4000 },
  { tipo: "Psicólogo", salario: 4000 },
];

const materiaisComuns = [
  { nome: "Material de Escritório", unidade: "Kit", valor: 200 },
  { nome: "Material de Limpeza", unidade: "Kit", valor: 150 },
  { nome: "Material Médico-Hospitalar", unidade: "Kit", valor: 500 },
];

const equipamentosComuns = [
  { nome: "Computador Desktop", valor: 3000 },
  { nome: "Impressora Multifuncional", valor: 1500 },
  { nome: "Cadeira de Rodas", valor: 2000 },
];


export function OrcamentoTab() {
  const { control, watch, setValue } = useFormContext();
  const { toast } = useToast();
  const [analiseResultado, setAnaliseResultado] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Field Arrays para cada seção do orçamento
  const { fields: rhFields, append: appendRh, remove: removeRh } = useFieldArray({ control, name: "orcamento.recursosHumanos" });
  const { fields: materialFields, append: appendMaterial, remove: removeMaterial } = useFieldArray({ control, name: "orcamento.materialConsumo" });
  const { fields: equipFields, append: appendEquip, remove: removeEquip } = useFieldArray({ control, name: "orcamento.equipamentos" });

  const orcamentoValores = watch("orcamento");

  const calcularTotal = () => {
    const totalRH = orcamentoValores?.recursosHumanos?.reduce((sum: number, item: any) => sum + (Number(item.salario) || 0) * (Number(item.meses) || 0), 0) || 0;
    const totalMaterial = orcamentoValores?.materialConsumo?.reduce((sum: number, item: any) => sum + (Number(item.quantidade) || 0) * (Number(item.valorUnit) || 0), 0) || 0;
    const totalEquipamentos = orcamentoValores?.equipamentos?.reduce((sum: number, item: any) => sum + (Number(item.quantidade) || 0) * (Number(item.valorUnit) || 0), 0) || 0;
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

  const handleSelectMaterial = (index: number, nome: string) => {
    const material = materiaisComuns.find(m => m.nome === nome);
    if (material) {
        setValue(`orcamento.materialConsumo.${index}.unidade`, material.unidade);
        setValue(`orcamento.materialConsumo.${index}.valorUnit`, material.valor);
    }
  }
  
  const handleSelectEquipamento = (index: number, nome: string) => {
    const equipamento = equipamentosComuns.find(e => e.nome === nome);
    if (equipamento) {
        setValue(`orcamento.equipamentos.${index}.valorUnit`, equipamento.valor);
    }
  }
  
  const handleAnalisarOrcamento = async () => {
    setIsAnalyzing(true);
    setAnaliseResultado(null);
    try {
        const itensRH = orcamentoValores?.recursosHumanos?.map((item: any) => `- ${item.cargo}: R$ ${item.salario}/mês`).join('\n') || 'Nenhum';
        const response = await fetch('/api/knowledge/query', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                query: `Análise de custos de Recursos Humanos`,
                contextPrompt: `Com base nos projetos modelo, analise os seguintes custos de RH e me diga se os valores estão dentro da média de mercado para projetos PRONAS/PCD. Aponte itens que parecem muito caros ou muito baratos:\n${itensRH}`
            }),
        });
        if (!response.ok) { throw new Error('Falha na análise da IA.'); }
        const result = await response.json();
        setAnaliseResultado(result.answer);
    } catch (error: any) {
        setAnaliseResultado(error.message || "Ocorreu um erro ao tentar analisar o orçamento.");
    } finally {
        setIsAnalyzing(false);
    }
  }

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

      <Card>
        <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle>Análise de Orçamento com IA</CardTitle>
                <Button onClick={handleAnalisarOrcamento} disabled={isAnalyzing}>
                    {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Analisar Custos
                </Button>
            </div>
          <CardDescription>
            Use a IA para comparar os valores do seu orçamento com projetos modelo e obter feedback.
          </CardDescription>
        </CardHeader>
        {isAnalyzing && <CardContent><p className="text-sm text-blue-600 animate-pulse">Analisando...</p></CardContent>}
        {analiseResultado && (
            <CardContent>
                <Alert>
                    <BrainCircuit className="h-4 w-4" />
                    <AlertTitle>Resultado da Análise da IA</AlertTitle>
                    <AlertDescription className="prose prose-sm max-w-none">
                        <p className="whitespace-pre-wrap">{analiseResultado}</p>
                    </AlertDescription>
                </Alert>
            </CardContent>
        )}
      </Card>

      <Tabs defaultValue="recursos-humanos" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recursos-humanos">Recursos Humanos</TabsTrigger>
          <TabsTrigger value="material-consumo">Material Consumo</TabsTrigger>
          <TabsTrigger value="equipamentos">Equipamentos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="recursos-humanos">
            <Card>
                <CardHeader>
                    <Button type="button" onClick={() => appendRh({ tipo: "", cargo: "", chSemanal: "", salario: 0, meses: 12 })} size="sm" className="ml-auto">
                        <Plus className="h-4 w-4 mr-2" />Adicionar Profissional
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {rhFields.map((item, index) => (
                        <div key={item.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
                           {/* Fields... */}
                           <Button type="button" variant="outline" size="icon" onClick={() => removeRh(index)} className="self-end"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="material-consumo">
             <Card>
                <CardHeader>
                    <Button type="button" onClick={() => appendMaterial({ material: "", descricao: "", unidade: "", quantidade: 1, valorUnit: 0 })} size="sm" className="ml-auto">
                        <Plus className="h-4 w-4 mr-2" />Adicionar Material
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {materialFields.map((item, index) => (
                        <div key={item.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
                           {/* Fields... */}
                           <Button type="button" variant="outline" size="icon" onClick={() => removeMaterial(index)} className="self-end"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </TabsContent>

         <TabsContent value="equipamentos">
             <Card>
                <CardHeader>
                    <Button type="button" onClick={() => appendEquip({ equipamento: "", descricao: "", quantidade: 1, valorUnit: 0 })} size="sm" className="ml-auto">
                        <Plus className="h-4 w-4 mr-2" />Adicionar Equipamento
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {equipFields.map((item, index) => (
                        <div key={item.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
                           {/* Fields... */}
                           <Button type="button" variant="outline" size="icon" onClick={() => removeEquip(index)} className="self-end"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </TabsContent>

      </Tabs>
    </div>
  )
}