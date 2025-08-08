import { NextResponse } from 'next/server';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export const runtime = 'nodejs';


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
    
    const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });
    const docs = await splitter.splitDocuments(pageLevelDocs);

    const docsWithCleanMetadata = docs.map(doc => {
      doc.metadata = {
        source: file.name,
        category: category,
        pageNumber: doc.metadata.loc?.pageNumber ?? 0,
        uploadDate: new Date().toISOString()
      };
      return doc;
    });

    const embeddings = new GoogleGenerativeAIEmbeddings({
        modelName: "embedding-001",
        apiKey: process.env.GOOGLE_API_KEY,
    });
    
    // Passando o URL de conexão explicitamente
    await Chroma.fromDocuments(docsWithCleanMetadata, embeddings, {
        collectionName: collectionName,
    });

    console.log(`Documento '${file.name}' adicionado com sucesso à coleção '${collectionName}'.`);

    return NextResponse.json({ 
        success: true, 
        message: `Documento '${file.name}' processado e adicionado à base de ${category}.` 
    });

  } catch (error) {
    console.error("Erro no processamento do arquivo:", error);
    return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
  }
}