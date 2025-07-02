import { NextResponse } from 'next/server';
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const CHROMA_DB_PATH = "./chroma_db";
const COLLECTION_NORMATIVAS = "pronas-normativas";
const COLLECTION_PROJETOS_MODELO = "pronas-projetos-modelo";

async function performSimilaritySearch(vectorStore: Chroma, query: string, k: number = 2) {
    try {
        const results = await vectorStore.similaritySearch(query, k);
        return results.map(doc => doc.pageContent).join("\n\n---\n\n");
    } catch (error) {
        // Ignora o erro se a coleção não existir ainda
        if (error instanceof Error && error.message.includes("does not exist")) {
            console.warn(`Coleção não encontrada ao buscar:`, error.message);
            return "Nenhum documento encontrado nesta categoria.";
        }
        throw error; // Lança outros erros
    }
}

export async function POST(req: Request) {
    try {
        const { query, contextPrompt } = await req.json();

        if (!query) {
            return NextResponse.json({ error: "A consulta (query) é obrigatória." }, { status: 400 });
        }

        const embeddings = new GoogleGenerativeAIEmbeddings({
            modelName: "embedding-001",
            apiKey: process.env.GOOGLE_API_KEY,
        });

        // 1. Conectar-se às duas coleções
        const vectorStoreNormativas = new Chroma(embeddings, {
            collectionName: COLLECTION_NORMATIVAS,
            url: CHROMA_DB_PATH,
        });

        const vectorStoreProjetos = new Chroma(embeddings, {
            collectionName: COLLECTION_PROJETOS_MODELO,
            url: CHROMA_DB_PATH,
        });

        // 2. Buscar por documentos relevantes em ambas as coleções
        const [normativasContext, projetosContext] = await Promise.all([
            performSimilaritySearch(vectorStoreNormativas, `Regras e diretrizes para: ${query}`),
            performSimilaritySearch(vectorStoreProjetos, `Exemplos de texto sobre: ${query}`)
        ]);

        // 3. Montar o prompt final para a IA com os dois contextos
        const prompt = `
            Você é um especialista sênior na elaboração de projetos para o PRONAS/PCD.
            Sua tarefa é gerar um texto técnico e bem fundamentado para o tópico solicitado, seguindo rigorosamente as regras e se inspirando nos exemplos fornecidos.

            **REGRAS OBRIGATÓRIAS (Extraídas de Leis e Diretrizes):**
            ---
            ${normativasContext}
            ---

            **EXEMPLOS DE ALTA QUALIDADE (Extraídos de Projetos Aprovados):**
            ---
            ${projetosContext}
            ---

            **TAREFA:**
            Com base nas REGRAS e nos EXEMPLOS acima, ${contextPrompt || 'gere um texto detalhado e profissional sobre o seguinte tópico:'} "${query}".
            Seu texto deve ser original, coeso e aplicar as regras aos exemplos de forma prática.
        `;
        
        // 4. Chamar a LLM da Google para gerar a resposta
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