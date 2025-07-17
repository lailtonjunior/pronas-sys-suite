"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Database, RefreshCw, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CollectionInfo {
  id: string;
  name: string;
  count: number;
}

export function VisualizadorDb() {
  const [collections, setCollections] = useState<CollectionInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/knowledge/collections');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha ao buscar dados do banco de dados.");
      }
      const data: CollectionInfo[] = await response.json();
      setCollections(data);
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Erro de Conexão",
        description: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Database className="h-8 w-8 text-green-600" />
            Visualizador da Base de Dados
          </h1>
          <p className="text-muted-foreground">
            Visualize as coleções e a quantidade de documentos na sua base de conhecimento ChromaDB.
          </p>
        </div>
        <Button onClick={fetchData} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Atualizar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coleções Ativas</CardTitle>
          <CardDescription>
            Cada coleção representa uma categoria de conhecimento para a IA. A contagem representa o número de "chunks" de texto armazenados.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="text-red-500 flex items-center gap-2 p-4 bg-red-50 rounded-md">
              <AlertCircle className="h-4 w-4" />
              <p>{error}</p>
            </div>
          )}
          {!error && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome da Coleção</TableHead>
                  <TableHead className="text-right">Documentos (Chunks)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center h-24">
                      <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ) : collections.length > 0 ? (
                  collections.map((collection) => (
                    <TableRow key={collection.id}>
                      <TableCell className="font-medium">{collection.name}</TableCell>
                      <TableCell className="text-right font-mono">{collection.count}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center h-24">
                      Nenhuma coleção encontrada. Faça o upload de um documento para começar.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
