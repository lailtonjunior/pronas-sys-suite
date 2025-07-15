"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { UploadCloud, FileText, Trash2, BrainCircuit, Library, FileJson, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils" // Importar cn para classes condicionais

type DocumentoTipo = 'Projeto Assistencial' | 'Projeto Capacitação' | 'Diligência' | 'Normativa';

interface DocumentoConhecimento {
  id: string;
  nome: string;
  tipo: DocumentoTipo;
  status: 'Processando' | 'Concluído' | 'Erro';
  dataUpload: string;
}

export function GerenciadorConhecimento() {
  const [documentos, setDocumentos] = useState<DocumentoConhecimento[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false); // Novo estado para o drag-and-drop
  const [tipoDocumento, setTipoDocumento] = useState<DocumentoTipo>('Projeto Assistencial');
  const { toast } = useToast();

  const processFile = async (file: File) => {
    if (!file) return;

    setIsProcessing(true);
    const tempId = `doc_${Date.now()}`;
    const novoDocumento: DocumentoConhecimento = {
      id: tempId,
      nome: file.name,
      tipo: tipoDocumento,
      status: 'Processando',
      dataUpload: new Date().toLocaleDateString('pt-BR'),
    };
    setDocumentos(prev => [novoDocumento, ...prev]);
    
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', tipoDocumento);

        const response = await fetch('/api/knowledge/upload', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Falha no upload do arquivo.');
        }

        const result = await response.json();

        setDocumentos(prev => prev.map(doc => 
          doc.id === tempId ? { ...doc, status: 'Concluído' } : doc
        ));

        toast({
            title: "Documento Processado!",
            description: result.message,
        });

    } catch (error: any) {
        console.error("Erro no upload:", error);
        setDocumentos(prev => prev.map(doc => 
            doc.id === tempId ? { ...doc, status: 'Erro' } : doc
          ));
        toast({
            variant: "destructive",
            title: "Erro no Processamento",
            description: error.message || "Não foi possível processar o documento.",
        });
    } finally {
        setIsProcessing(false);
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    processFile(file!);
  };

  // Funções para Drag and Drop
  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    processFile(file!);
  };


  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BrainCircuit className="h-8 w-8 text-blue-600" />
            Base de Conhecimento da IA
          </h1>
          <p className="text-muted-foreground">
            Alimente a IA com projetos modelo, diligências (pareceres) e documentos normativos.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload de Novos Documentos</CardTitle>
          <CardDescription>
            Selecione a categoria correta e envie o arquivo PDF. A IA aprenderá com cada documento.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="doc-type">1. Selecione a Categoria do Documento</Label>
            <Select value={tipoDocumento} onValueChange={(value: DocumentoTipo) => setTipoDocumento(value)}>
                <SelectTrigger id="doc-type">
                    <SelectValue placeholder="Selecione o tipo..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Projeto Assistencial">
                        <div className="flex items-center gap-2"><FileJson className="h-4 w-4" /><span>Projeto Assistencial Aprovado</span></div>
                    </SelectItem>
                    <SelectItem value="Projeto Capacitação">
                        <div className="flex items-center gap-2"><FileJson className="h-4 w-4" /><span>Projeto de Capacitação Aprovado</span></div>
                    </SelectItem>
                    <SelectItem value="Diligência">
                         <div className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-600" /><span>Diligência / Parecer Técnico</span></div>
                    </SelectItem>
                    <SelectItem value="Normativa">
                        <div className="flex items-center gap-2"><Library className="h-4 w-4" /><span>Normativa (Lei, Portaria, etc)</span></div>
                    </SelectItem>
                </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="file-upload">2. Envie o Arquivo PDF</Label>
            <div className="flex items-center justify-center w-full">
                <label 
                    htmlFor="file-upload" 
                    className={cn(
                        "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg transition-colors",
                        isProcessing ? 'cursor-not-allowed bg-muted' : 'cursor-pointer hover:bg-muted',
                        isDragging && 'bg-blue-100 border-blue-500' // Feedback visual ao arrastar
                    )}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Clique para enviar</span> ou arraste e solte</p>
                </div>
                <Input id="file-upload" type="file" className="hidden" onChange={handleFileSelect} accept=".pdf" disabled={isProcessing} />
                </label>
            </div>
          </div>
           {isProcessing && <p className="text-center mt-4 text-sm text-blue-600 animate-pulse">Processando documento...</p>}
        </CardContent>
      </Card>
        {/* ... (resto do componente sem alterações) ... */}
    </div>
  );
}