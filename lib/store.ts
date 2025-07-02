"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface Instituicao {
  id: string
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
  createdAt: string
}

export interface Projeto {
  id: string
  titulo: string
  instituicaoId: string
  status: "rascunho" | "concluido" | "submetido"
  createdAt: string
  updatedAt: string
  // Campos do formulário
  campoAtuacao: string
  prazoExecucao: string
  areasArt10: string[]
  resumoIdeia: string
  problemacentral: string
  relevancia: string
  solucaoProposta: string
  articulacaoSUS: string
  objetivoGeral: string
  objetivosEspecificos: string
  faixaEtaria: string
  tiposDeficiencia: string
  novosUsuarios: string
  usuariosAtuais: string
  criteriosInclusao: string
  metodologiaDetalhada: string
  planoPTS: string
  registroCIHA: string
  outrosInstrumentos: string
  orcamento: {
    recursosHumanos: any[]
    materialConsumo: any[]
    equipamentos: any[]
    servicosTerceiros: any[]
    despesasAdmin: any[]
    despesasElaboracao: any[]
  }
}

interface Store {
  instituicoes: Instituicao[]
  projetos: Projeto[]
  addInstituicao: (instituicao: Instituicao) => void
  removeInstituicao: (id: string) => void
  addProjeto: (projeto: Projeto) => void
  updateProjeto: (id: string, data: Partial<Projeto>) => void
  removeProjeto: (id: string) => void
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      instituicoes: [],
      projetos: [],
      addInstituicao: (instituicao) =>
        set((state) => ({
          instituicoes: [...state.instituicoes, instituicao],
        })),
      removeInstituicao: (id) =>
        set((state) => ({
          instituicoes: state.instituicoes.filter((i) => i.id !== id),
        })),
      addProjeto: (projeto) =>
        set((state) => ({
          projetos: [...state.projetos, projeto],
        })),
      updateProjeto: (id, data) =>
        set((state) => ({
          projetos: state.projetos.map((p) => (p.id === id ? { ...p, ...data } : p)),
        })),
      removeProjeto: (id) =>
        set((state) => ({
          projetos: state.projetos.filter((p) => p.id !== id),
        })),
    }),
    {
      name: "pronasys-storage",
    },
  ),
)
