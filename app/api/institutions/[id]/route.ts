// app/api/institutions/[id]/route.ts
// Esta rota lidará com ações para uma instituição específica.

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// Função DELETE para excluir uma instituição
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    await prisma.institution.delete({
      where: {
        id: params.id,
        ownerId: session.user.id, // Garante que o usuário só pode deletar suas próprias instituições
      },
    });
    return NextResponse.json({ message: "Instituição excluída com sucesso" }, { status: 200 });
  } catch (error) {
    console.error("Erro ao excluir instituição:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

// Em breve, adicionaremos a função PUT aqui para edição.