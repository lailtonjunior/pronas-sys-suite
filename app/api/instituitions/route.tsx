// app/api/institutions/route.ts
// Arquivo ATUALIZADO para incluir a função GET e refinar a POST.

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// É uma boa prática instanciar o PrismaClient fora das funções para reutilização
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/institutions:
 * get:
 * summary: Retorna todas as instituições do usuário logado
 * description: Busca no banco de dados todas as instituições associadas ao ID do usuário da sessão.
 * responses:
 * 200:
 * description: Sucesso. Retorna um array de instituições.
 * 401:
 * description: Não autorizado.
 */
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const institutions = await prisma.institution.findMany({
      where: {
        ownerId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(institutions);
  } catch (error) {
    console.error("Erro ao buscar instituições:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}


/**
 * @swagger
 * /api/institutions:
 * post:
 * summary: Cria uma nova instituição
 * description: Salva uma nova instituição no banco de dados, associada ao usuário logado.
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * razaoSocial: { type: "string" }
 * cnpj: { type: "string" }
 * // ... outros campos
 * responses:
 * 201:
 * description: Instituição criada com sucesso.
 * 400:
 * description: Dados inválidos.
 * 401:
 * description: Não autorizado.
 * 409:
 * description: Conflito (ex: CNPJ já existe).
 */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const data = await req.json();

    // Validação básica dos dados recebidos
    if (!data.razaoSocial || !data.cnpj) {
        return NextResponse.json({ error: "Razão Social e CNPJ são obrigatórios." }, { status: 400 });
    }

    const newInstitution = await prisma.institution.create({
      data: {
        name: data.razaoSocial,
        cnpj: data.cnpj.replace(/\D/g, ''), // Salva apenas os números
        contact: {
            telefone: data.telefone,
            email: data.email,
        },
        address: {
            endereco: data.endereco,
            cidade: data.cidade,
            estado: data.estado,
            cep: data.cep,
        },
        metadata: {
            nomeFantasia: data.nomeFantasia,
            cnes: data.cnes,
            representanteLegal: data.representanteLegal,
            cargoRepresentante: data.cargoRepresentante,
            observacoes: data.observacoes,
        },
        ownerId: session.user.id,
      },
    });

    return NextResponse.json(newInstitution, { status: 201 });
  } catch (error: any) {
    console.error("Erro ao criar instituição:", error);
    // Adiciona uma resposta mais detalhada em caso de CNPJ duplicado
    if (error.code === 'P2002' && error.meta?.target?.includes('cnpj')) {
        return NextResponse.json({ error: "Este CNPJ já está cadastrado." }, { status: 409 });
    }
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
