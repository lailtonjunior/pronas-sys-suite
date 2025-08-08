// app/api/institutions/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const data = await req.json();

    const newInstitution = await prisma.institution.create({
      data: {
        name: data.razaoSocial,
        cnpj: data.cnpj,
        // Adicione aqui todos os outros campos do formulário
        // que correspondem ao seu schema.prisma
        ownerId: session.user.id,
      },
    });

    return NextResponse.json(newInstitution, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar instituição:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}