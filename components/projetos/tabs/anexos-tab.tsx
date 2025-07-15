"use client"

import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { FileText, Upload, FileDown, Sparkles, AlertCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useStore } from "@/lib/store"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Nova lista de documentos que o consultor precisa coletar
const documentosParaColeta = [
  {
    id: "alvara_sanitario",
    nome: "Comprovante do Alvará Sanitário",
    descricao: "Cópia válida (até no mínimo Dez/2024) emitida por órgão competente (Vigilância Sanitária, Bombeiros, etc.).",
  },
  {
    id: "cnes",
    nome: "Comprovante de Registro no CNES",
    descricao: "Comprovante atualizado com endereço correto e todos os profissionais de saúde em atuação.",
  },
  {
    id: "estrutura_fisica",
    nome: "Comprovante de Estrutura Física Adequada",
    descricao: "Fotos, plantas ou outros documentos que comprovem a estrutura física da instituição.",
  },
  {
    id: "doc_presidente",
    nome: "Cópia do Documento de Identidade do Presidente",
    descricao: "Documento com foto (RG ou CNH) do representante legal da instituição.",
  },
];

export function AnexosTab({ onSave }: { onSave: (data: any) => void }) {
  const { watch } = useFormContext();
  const { instituicoes } = useStore();
  const [generatedDoc, setGeneratedDoc] = useState({ title: '', content: '' });

  const projeto = watch();
  const instituicao = instituicoes.find(i => i.id === projeto.instituicaoId);

  const dadosEstaoPreenchidos = instituicao && projeto.titulo;

  const gerarAnexoIV = () => {
    const conteudo = `
DECLARAÇÃO DE RESPONSABILIDADE
(Origem: PRT MS/GM 1550/2014, Anexo 4)

Eu, ${instituicao?.representanteLegal || '[NOME DO REPRESENTANTE LEGAL]'}, CPF Nº ${'[CPF DO REPRESENTANTE]'}, ATESTO, para fins de apresentação de projetos no âmbito do PRONAS/PCD do Ministério da Saúde, que o(a) ${instituicao?.razaoSocial || '[NOME DA INSTITUIÇÃO]'}, inscrito(a) no CNPJ sob o nº ${instituicao?.cnpj || '[CNPJ DA INSTITUIÇÃO]'}, situado(a) à ${instituicao?.endereco || '[ENDEREÇO COMPLETO]'}, apresenta capacidade técnica e operacional para o desenvolvimento do Projeto "${projeto.titulo || '[TÍTULO DO PROJETO']}".
    `;
    setGeneratedDoc({ title: 'Anexo IV - Declaração de Responsabilidade', content: conteudo.trim() });
  };

  const gerarAnexoV = () => {
    const conteudo = `
DECLARAÇÃO DE CAPACIDADE TÉCNICO-OPERATIVA
(Origem: PRT MS/GM 1550/2014, Anexo 5)

Declaramos, para os devidos fins que a instituição ${instituicao?.razaoSocial || '[NOME DA INSTITUIÇÃO]'}, inscrita no CNPJ sob o Nº ${instituicao?.cnpj || '[CNPJ DA INSTITUIÇÃO]'} estabelecida no ${instituicao?.endereco || '[ENDEREÇO DA INSTITUIÇÃO]'}, possui capacidade técnica e operacional necessárias para a realização do projeto intitulado "${projeto.titulo || '[TÍTULO DO PROJETO']}" apresentado para execução no âmbito do PRONAS/PCD.

Local e Data.


_________________________________________
[Nome do Representante Legal]
Instituição ${instituicao?.razaoSocial || '[NOME DA INSTITUIÇÃO]'}
* Enviar em papel timbrado da instituição
    `;
    setGeneratedDoc({ title: 'Anexo V - Declaração de Capacidade Técnico-Operativa', content: conteudo.trim() });
  };
  
    const gerarAnexoVII = () => {
    const conteudo = `
FORMULÁRIO DE INFORMAÇÕES COMPLEMENTARES (Anexo VII)

1. DADOS INSTITUCIONAIS
Razão Social: ${instituicao?.razaoSocial || '[NOME DA INSTITUIÇÃO]'}
Projeto: (X) PRONAS/PCD
Nº DO SIPAR do Projeto: [A SER PREENCHIDO]

2. RESPONSÁVEL PELA INSTITUIÇÃO
Nome: ${instituicao?.representanteLegal || '[NOME DO REPRESENTANTE LEGAL]'}
Cargo: ${instituicao?.cargoRepresentante || '[CARGO]'}
Telefone: ${instituicao?.telefone || '[TELEFONE]'}
E-mail para contato: ${instituicao?.email || '[E-MAIL]'}

(As demais seções de Infraestrutura, Resíduos e Equipamentos devem ser preenchidas manualmente no documento final)
    `;
    setGeneratedDoc({ title: 'Anexo VII - Formulário de Informações Complementares', content: conteudo.trim() });
  };

  return (
    <div className="space-y-8">
      {/* SEÇÃO 1: CHECKLIST DE COLETA */}
      <Card>
        <CardHeader>
          <CardTitle>Checklist de Coleta de Documentos</CardTitle>
          <CardDescription>Estes são os documentos e informações que você precisa solicitar à instituição cliente.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {documentosParaColeta.map((doc) => (
            <div key={doc.id} className="flex items-start space-x-3">
              <Checkbox id={doc.id} className="mt-1" />
              <div>
                <Label htmlFor={doc.id} className="font-medium cursor-pointer">{doc.nome}</Label>
                <p className="text-sm text-muted-foreground">{doc.descricao}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
      
      {/* SEÇÃO 2: GERAÇÃO DE ANEXOS */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="text-blue-500" />
            Geração Automática de Anexos
          </CardTitle>
          <CardDescription>
            Com base nos dados já preenchidos, o sistema pode gerar o conteúdo dos anexos. Clique para gerar, depois copie e cole em um documento timbrado da instituição para assinatura.
          </CardDescription>
        </CardHeader>
        <CardContent>
            {!dadosEstaoPreenchidos && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Faltam Dados</AlertTitle>
                    <AlertDescription>
                        Para gerar os anexos, selecione uma instituição e preencha o título do projeto na aba "Info Gerais".
                    </AlertDescription>
                </Alert>
            )}
            <Dialog>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <DialogTrigger asChild>
                        <Button onClick={gerarAnexoIV} disabled={!dadosEstaoPreenchidos}><FileText className="mr-2 h-4 w-4"/> Gerar Anexo IV</Button>
                    </DialogTrigger>
                    <DialogTrigger asChild>
                        <Button onClick={gerarAnexoV} disabled={!dadosEstaoPreenchidos}><FileText className="mr-2 h-4 w-4"/> Gerar Anexo V</Button>
                    </DialogTrigger>
                     <DialogTrigger asChild>
                        <Button onClick={gerarAnexoVII} disabled={!dadosEstaoPreenchidos}><FileText className="mr-2 h-4 w-4"/> Gerar Anexo VII</Button>
                    </DialogTrigger>
                </div>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>{generatedDoc.title}</DialogTitle>
                    </DialogHeader>
                    <div className="p-4 border rounded-md bg-gray-50 max-h-[60vh] overflow-y-auto">
                        <div className="w-full h-16 bg-gray-200 mb-8 flex items-center justify-center">
                            <p className="text-sm text-gray-500">[Espaço para o Logo da Instituição]</p>
                        </div>
                        <pre className="whitespace-pre-wrap font-sans text-sm">{generatedDoc.content}</pre>
                    </div>
                     <Button onClick={() => navigator.clipboard.writeText(generatedDoc.content)}>Copiar Conteúdo</Button>
                </DialogContent>
            </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}