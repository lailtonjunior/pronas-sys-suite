import { NextResponse } from 'next/server';
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import path from "path";
import { ChromaClient } from "chromadb";

export const runtime = 'nodejs';

const CHROMA_DB_PATH = path.join(process.cwd(), "chroma_db");

const collections = {
    normativas: "pronas-normativas",
    diligencias: "pronas-diligencias",
    assistencial: "pronas-projetos-assistencial",
    capacitacao: "pronas-projetos-capacitacao"
};

async function searchCollection(embeddings: GoogleGenerativeAIEmbeddings, collectionName: string, query: string, k: number = 2) {
    try {
        // **A CORREÇÃO ESTÁ AQUI**
        const client = new ChromaClient({ path: CHROMA_DB_PATH });
        const collection = await client.getCollection({ 
            name: collectionName,
            embeddingFunction: { generate: (texts: string[]) => embeddings.embedDocuments(texts) }
        });

        const vectorStore = new Chroma(embeddings, { collection });
        const results = await vectorStore.similaritySearch(query, k);
        return results.map(doc => doc.pageContent).join("\n\n---\n\n");
    } catch (e) {
        console.warn(`Aviso ao buscar na coleção "${collectionName}":`, (e as Error).message);
        return "Nenhum documento encontrado nesta categoria.";
    }
}

export async function POST(req: Request) {
    try {
        const { query, contextPrompt, projectType } = await req.json();

        if (!query) {
            return NextResponse.json({ error: "A consulta (query) é obrigatória." }, { status: 400 });
        }

        const embeddings = new GoogleGenerativeAIEmbeddings({ apiKey: process.env.GOOGLE_API_KEY });
        const projetoModeloCollection = projectType === 'capacitacao' ? collections.capacitacao : collections.assistencial;

        const [normativasContext, diligenciasContext, projetosContext] = await Promise.all([
            searchCollection(embeddings, collections.normativas, `Regras para: ${query}`),
            searchCollection(embeddings, collections.diligencias, `Atenção sobre: ${query}`),
            searchCollection(embeddings, projetoModeloCollection, `Exemplos de: ${query}`)
        ]);

        const prompt = `
            Você é um consultor especialista na elaboração de projetos para o PRONAS/PCD. Sua tarefa é gerar um texto técnico e persuasivo para o tópico solicitado, usando as informações abaixo.
            
            **REGRAS OBRIGATÓRIAS (Extraídas de Leis e Normas):**
            ---
            ${normativasContext}
            ---

            **EXEMPLOS DE SUCESSO (Extraídos de Projetos Aprovados):**
            ---
            ${projetosContext}
            ---

            **PONTOS DE ATENÇÃO (Aprendizado com Diligências):**
            ---
            ${diligenciasContext}
            ---

            **TAREFA:**
            Combine todo esse conhecimento para responder à seguinte solicitação:
            ${contextPrompt || 'Gere um texto detalhado sobre o tópico:'} "${query}".
            Seu texto final deve ser original, preciso e aplicar as regras aos exemplos, evitando os erros apontados nas diligências.
        `;
        
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const answer = response.text();
        
        return NextResponse.json({ answer });

    } catch (error) {
        console.error("Erro na consulta da IA:", error);
        return NextResponse.json({ error: "Erro interno no servidor ao consultar a IA." }, { status: 500 });
    }
}