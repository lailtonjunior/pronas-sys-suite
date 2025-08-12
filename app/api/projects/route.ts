// app/api/projects/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// Função GET para buscar todos os projetos do usuário logado
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const projects = await prisma.project.findMany({
      where: {
        authorId: session.user.id,
      },
      include: {
        institution: {
          select: {
            name: true,
          }
        }
      }
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Erro ao buscar projetos:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

// Futuramente, você pode adicionar a função POST aqui para criar projetos