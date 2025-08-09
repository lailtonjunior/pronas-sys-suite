// components/instituicoes/instituicoes-list.tsx
// Componente REFEITO para buscar dados da API em vez do Zustand.

"use client"

import { useState, useEffect } from "react";
import { Building2, Mail, Phone, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Interface para corresponder aos dados vindos do Prisma
interface Institution {
    id: string;
    name: string;
    cnpj: string;
    address: any;
    contact: any;
    metadata: any;
    createdAt: string;
}

export function InstituicoesList() {
  const [instituicoes, setInstituicoes] = useState<Institution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/institutions");
        if (!response.ok) {
          throw new Error("Falha ao buscar instituições.");
        }
        const data = await response.json();
        setInstituicoes(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstitutions();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
        <Alert variant="destructive">
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
    )
  }

  if (instituicoes.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhuma instituição cadastrada</h3>
          <p className="text-muted-foreground text-center">
            Comece cadastrando sua primeira instituição cliente para criar projetos PRONAS/PCD.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {instituicoes.map((instituicao) => (
        <Card key={instituicao.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg">{instituicao.name}</CardTitle>
                {instituicao.metadata?.nomeFantasia && (
                  <CardDescription className="mt-1">{instituicao.metadata.nomeFantasia}</CardDescription>
                )}
              </div>
              <Building2 className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">CNPJ: {formatCNPJ(instituicao.cnpj)}</Badge>
              {instituicao.metadata?.cnes && <Badge variant="outline">CNES: {instituicao.metadata.cnes}</Badge>}
            </div>

            <div className="space-y-2">
              {instituicao.contact?.telefone && <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                {instituicao.contact.telefone}
              </div>}
              {instituicao.contact?.email && <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                {instituicao.contact.email}
              </div>}
            </div>

            {instituicao.metadata?.representanteLegal && <div className="pt-2 border-t">
              <p className="text-sm">
                <span className="font-medium">Representante:</span> {instituicao.metadata.representanteLegal}
              </p>
              <p className="text-sm text-muted-foreground">{instituicao.metadata.cargoRepresentante}</p>
            </div>}

            <div className="text-xs text-muted-foreground">
              Cadastrado em {new Date(instituicao.createdAt).toLocaleDateString("pt-BR")}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Adicione a função formatCNPJ aqui ou mantenha no seu utils
function formatCNPJ(value: string): string {
    if (!value) return "";
    const numbers = value.replace(/\D/g, "");
    return numbers
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .substring(0, 18);
  }
