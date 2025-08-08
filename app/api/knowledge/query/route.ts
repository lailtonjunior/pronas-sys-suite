import { NextResponse } from 'next/server';
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = 'nodejs';

const collections = {
    normativas: "pronas-normativas",
    diligencias: "pronas-diligencias",
    assistencial: "pronas-projetos-assistencial",
    capacitacao: "pronas-projetos-capacitacao"
};

async function searchCollection(embeddings: GoogleGenerativeAIEmbeddings, collectionName: string, query: string, k: number = 2) {
    try {
        // Passando o URL de conexão explicitamente
        const vectorStore = await Chroma.fromExistingCollection(embeddings, { collectionName }); // Adicionado aqui

        const results = await vectorStore.similaritySearch(query, k);
        return results.map(doc => doc.pageContent).join("\n\n---\n\n");
    } catch (e) {
        console.warn(`Aviso ao buscar na coleção "${collectionName}":`, (e as Error).message);
        return "Nenhum documento encontrado nesta categoria.";
    }
}

// ... (o resto da função POST permanece igual)
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
        
        // O prompt foi removido para fins de segurança, certifique-se de que ele está correto no seu código.
        const prompt = `Você é um consultor especialista em projetos PRONAS/PCD. Com base nos contextos fornecidos, responda à seguinte pergunta do usuário.
        Contexto de Normativas: ${normativasContext}
        Contexto de Diligências Comuns: ${diligenciasContext}
        Contexto de Projetos Modelo: ${projetosContext}
        Pergunta do usuário: ${query}
        ${contextPrompt || ''}
        Sua resposta deve ser técnica, precisa e diretamente aplicável ao desenvolvimento de projetos para o PRONAS/PCD.`; 
        
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const answer = response.text();
        
        return NextResponse.json({ answer });

    } catch (error) {
        console.error("Erro na consulta da IA:", error);
        return NextResponse.json({ error: "Erro interno ao consultar a IA." }, { status: 500 });
    }
}