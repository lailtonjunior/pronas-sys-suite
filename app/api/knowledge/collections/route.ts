import { NextResponse } from 'next/server';
import { ChromaClient } from 'chromadb';

export const runtime = 'nodejs';

export async function GET() {
  try {
    // Conexão utilizando o novo método recomendado (host e port)
    const client = new ChromaClient({ 
        host: process.env.CHROMA_SERVER_HOST,
        port: process.env.CHROMA_SERVER_HTTP_PORT 
    });
    
    // O resto do arquivo permanece igual...
    const collections = await client.listCollections();

    const collectionsWithCount = await Promise.all(
      collections.map(async (collection) => {
        const coll = await client.getCollection({ name: collection.name });
        const count = await coll.count();
        return {
          id: collection.id,
          name: collection.name,
          count: count,
        };
      })
    );

    return NextResponse.json(collectionsWithCount);

  } catch (error) {
    console.error("Erro ao buscar coleções do ChromaDB:", error);
    return NextResponse.json(
      { error: "Não foi possível conectar ou buscar dados do ChromaDB." },
      { status: 500 }
    );
  }
}