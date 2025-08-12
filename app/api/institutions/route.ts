// app/api/institutions/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// Função GET para buscar todas as instituições do usuário logado
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
        createdAt: 'desc',
      }
    });
    return NextResponse.json(institutions);
  } catch (error) {
    console.error("Erro ao buscar instituições:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

// Função POST para criar uma nova instituição
export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
        return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const {
            razaoSocial,
            cnpj,
            cnes,
            nomeFantasia,
            telefone,
            email,
            endereco,
            cidade,
            estado,
            cep,
            representanteLegal,
            cargoRepresentante,
            observacoes
        } = body;

        const newInstitution = await prisma.institution.create({
            data: {
                name: razaoSocial,
                cnpj: cnpj.replace(/\D/g, ''), // Salva apenas os números
                ownerId: session.user.id,
                address: {
                    endereco,
                    cidade,
                    estado,
                    cep
                },
                contact: {
                    telefone,
                    email
                },
                metadata: {
                    cnes,
                    nomeFantasia,
                    representanteLegal,
                    cargoRepresentante,
                    observacoes
                }
            }
        });

        return NextResponse.json(newInstitution, { status: 201 });

    } catch (error) {
        console.error("Erro ao criar instituição:", error);
        return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
    }
}