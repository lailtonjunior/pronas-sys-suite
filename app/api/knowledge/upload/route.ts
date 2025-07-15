import { NextResponse } from 'next/server';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import path from "path";
import { ChromaClient } from "chromadb";

export const runtime = 'nodejs';

const CHROMA_DB_PATH = path.join(process.cwd(), "chroma_db");

const collectionMap = {
    'Projeto Assistencial': 'pronas-projetos-assistencial',
    'Projeto Capacitação': 'pronas-projetos-capacitacao',
    'Diligência': 'pronas-diligencias',
    'Normativa': 'pronas-normativas'
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const category = formData.get('category') as keyof typeof collectionMap | null;

    if (!file || !category || !collectionMap[category]) {
      return NextResponse.json({ error: "Arquivo ou categoria inválida." }, { status: 400 });
    }

    const loader = new PDFLoader(file);
    const pageLevelDocs = await loader.load();

    const collectionName = collectionMap[category];
    const metadata = { source: file.name, category, uploadDate: new Date().toISOString() };
    
    const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });
    const docs = await splitter.splitDocuments(pageLevelDocs);

    docs.forEach(doc => {
        doc.metadata = { ...doc.metadata, ...metadata };
    });

    const embeddings = new GoogleGenerativeAIEmbeddings({
        modelName: "embedding-001",
        apiKey: process.env.GOOGLE_API_KEY,
    });
    
    // **A CORREÇÃO ESTÁ AQUI**
    // 1. Inicializamos o cliente do ChromaDB
    const client = new ChromaClient({ path: CHROMA_DB_PATH });

    // 2. Criamos ou obtemos a coleção, passando a NOSSA função de embedding
    const collection = await client.getOrCreateCollection({
      name: collectionName,
      embeddingFunction: { generate: (texts: string[]) => embeddings.embedDocuments(texts) }
    });

    // 3. O LangChain agora usa a coleção já configurada
    const vectorStore = new Chroma(embeddings, { collection });
    await vectorStore.addDocuments(docs);
    
    console.log(`Documento '${file.name}' adicionado à coleção '${collectionName}'.`);

    return NextResponse.json({ 
        success: true, 
        message: `Documento '${file.name}' processado e adicionado à base de ${category}.` 
    });

  } catch (error) {
    console.error("Erro no processamento do arquivo:", error);
    return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
  }
}