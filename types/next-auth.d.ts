import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

// Estenda os tipos padrão do NextAuth para incluir o 'id' do usuário

declare module "next-auth" {
  /**
   * Retornado por `useSession`, `getSession` e recebido como prop para o `SessionProvider`
   */
  interface Session {
    user: {
      /** O ID do usuário no banco de dados. */
      id: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
  }
}

declare module "next-auth/jwt" {
  /** Retornado quando a estratégia de sessão é "jwt" */
  interface JWT {
    /** O ID do usuário no banco de dados. */
    id: string;
  }
}