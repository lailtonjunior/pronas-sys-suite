// app/api/auth/[...nextauth]/route.ts
// Este é o arquivo que cria todas as rotas de API do NextAuth.

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // Importamos a configuração que já criamos

const handler = NextAuth(authOptions);

// Exportamos o handler para os métodos GET e POST
export { handler as GET, handler as POST };

