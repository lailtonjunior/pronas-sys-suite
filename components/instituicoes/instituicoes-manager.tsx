// components/instituicoes/instituicoes-manager.tsx
// Componente ATUALIZADO para passar a prop `onSuccess` para o formulário.

"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InstituicaoForm } from "./instituicao-form"
import { InstituicoesList } from "./instituicoes-list"

export function InstituicoesManager() {
  const [showForm, setShowForm] = useState(false)
  // Adiciona um estado para forçar a re-renderização da lista
  const [key, setKey] = useState(Date.now()) 

  const handleSuccess = () => {
    setShowForm(false);
    setKey(Date.now()); // Muda a chave para forçar o re-fetch da lista
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Instituições</h1>
          <p className="text-muted-foreground">Cadastre e gerencie as instituições clientes</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Instituição
        </Button>
      </div>

      {showForm ? (
        <InstituicaoForm onCancel={() => setShowForm(false)} onSuccess={handleSuccess} />
      ) : (
        <InstituicoesList key={key} /> // Adiciona a chave aqui
      )}
    </div>
  )
}
