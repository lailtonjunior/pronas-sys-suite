import { NextResponse } from 'next/server';
import pdf from 'pdf-parse';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Chroma } from "@langchain/community/vectorstores/chroma";

// Local onde o banco de dados de vetores será salvo
const CHROMA_DB_PATH = "./chroma_db";

const collectionNames = {
    'Normativa': 'pronas-normativas',
    'Projeto Modelo': 'pronas-projetos-modelo'
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const category = formData.get('category') as 'Normativa' | 'Projeto Modelo' | null;

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
    }
    if (!category || !collectionNames[category]) {
        return NextResponse.json({ error: "Categoria de documento inválida." }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const pdfData = await pdf(fileBuffer);
    
    if (!pdfData.text) {
        return NextResponse.json({ error: "Não foi possível extrair texto do PDF." }, { status: 400 });
    }

    // Adiciona metadados ao documento antes de dividi-lo
    const metadata = {
        source: file.name,
        category: category,
        uploadDate: new Date().toISOString()
    };
    
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    
    // O splitter herdará os metadados para cada chunk
    const docs = await splitter.createDocuments([pdfData.text], [metadata]);

    const embeddings = new GoogleGenerativeAIEmbeddings({
        modelName: "embedding-001",
        apiKey: process.env.GOOGLE_API_KEY,
    });
    
    // Usa o nome da coleção dinamicamente com base na categoria
    const collectionName = collectionNames[category];
    
    await Chroma.fromDocuments(docs, embeddings, {
        collectionName: collectionName,
        url: CHROMA_DB_PATH,
    });

    console.log(`Documento '${file.name}' adicionado à coleção '${collectionName}'.`);

    return NextResponse.json({ 
        success: true, 
        message: `Documento '${file.name}' adicionado à base de conhecimento de ${category}.` 
    });

  } catch (error) {
    console.error("Erro no processamento do arquivo:", error);
    return NextResponse.json({ error: "Erro interno no servidor ao processar o arquivo." }, { status: 500 });
  }
}