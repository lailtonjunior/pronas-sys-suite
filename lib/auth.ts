// lib/auth.ts
// Configuração do NextAuth 100% focada no login com Email/Senha (Credentials).

import { PrismaAdapter } from "@auth/prisma-adapter";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Removemos o GoogleProvider e deixamos apenas o CredentialsProvider
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciais inválidas");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // Se o usuário não for encontrado ou não tiver uma senha cadastrada
        if (!user || !user.password_hash) {
          throw new Error("Usuário não encontrado ou senha não configurada.");
        }

        // Compara a senha enviada com a senha criptografada no banco
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password_hash
        );

        if (!isPasswordValid) {
          throw new Error("Senha incorreta.");
        }

        // Retorna o objeto do usuário se a autenticação for bem-sucedida
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // Adiciona o ID do usuário ao token da sessão
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  }
};
