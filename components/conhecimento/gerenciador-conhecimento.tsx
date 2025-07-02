"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { UploadCloud, FileText, Trash2, BrainCircuit, Library, FileJson } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type DocumentoTipo = 'Projeto Modelo' | 'Normativa';

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
  const [tipoDocumento, setTipoDocumento] = useState<DocumentoTipo>('Projeto Modelo');
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
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
        formData.append('category', tipoDocumento); // Envia a categoria para a API

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
            Faça o upload de projetos aprovados (modelos) e documentos normativos (regras) para especializar a sua IA.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload de Novos Documentos</CardTitle>
          <CardDescription>
            Selecione o tipo de documento e envie o arquivo PDF. A IA irá processá-lo para usar como referência.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="doc-type">1. Selecione o Tipo de Documento</Label>
            <Select value={tipoDocumento} onValueChange={(value: DocumentoTipo) => setTipoDocumento(value)}>
                <SelectTrigger id="doc-type">
                    <SelectValue placeholder="Selecione o tipo..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Projeto Modelo">
                        <div className="flex items-center gap-2">
                            <FileJson className="h-4 w-4" /> 
                            <span>Projeto Modelo (Exemplos Aprovados)</span>
                        </div>
                    </SelectItem>
                    <SelectItem value="Normativa">
                        <div className="flex items-center gap-2">
                            <Library className="h-4 w-4" /> 
                            <span>Normativa (Leis, Portarias, Diretrizes)</span>
                        </div>
                    </SelectItem>
                </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="file-upload">2. Envie o Arquivo</Label>
            <div className="flex items-center justify-center w-full">
                <label htmlFor="file-upload" className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg ${isProcessing ? 'cursor-not-allowed bg-muted' : 'cursor-pointer hover:bg-muted'}`}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Clique para enviar</span> ou arraste e solte
                    </p>
                    <p className="text-xs text-muted-foreground">PDF (MAX. 10MB por arquivo)</p>
                </div>
                <Input id="file-upload" type="file" className="hidden" onChange={handleFileUpload} accept=".pdf" disabled={isProcessing} />
                </label>
            </div>
          </div>
           {isProcessing && <p className="text-center mt-4 text-sm text-blue-600 animate-pulse">Processando documento, por favor aguarde...</p>}
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Documentos Processados</h3>
        {documentos.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {documentos.map(doc => (
              <Card key={doc.id}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <CardTitle className="text-base font-medium">{doc.nome}</CardTitle>
                  {doc.tipo === 'Projeto Modelo' ? <FileJson className="h-4 w-4 text-muted-foreground" /> : <Library className="h-4 w-4 text-muted-foreground" />}
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className={`text-xs px-2 py-1 rounded-full inline-block ${doc.status === 'Concluído' ? 'bg-green-100 text-green-800' : doc.status === 'Processando' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    {doc.status}
                  </div>
                  <p className="text-sm text-muted-foreground">Tipo: {doc.tipo}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="destructive" size="sm" className="w-full">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir da Base
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">Nenhum documento na base de conhecimento ainda.</p>
        )}
      </div>
    </div>
  );
}