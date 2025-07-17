import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "consultor@pronasys.com" },
        password: { label: "Password", type: "password" }
      },
      // Lógica de autenticação aprimorada
      async authorize(credentials) {
        // Validação básica de entrada
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email e senha são obrigatórios.");
        }

        // Verificação segura contra variáveis de ambiente
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
            console.error("Variáveis de ambiente ADMIN_EMAIL ou ADMIN_PASSWORD não configuradas.");
            throw new Error("O sistema de autenticação não está configurado corretamente.");
        }

        // Compara as credenciais fornecidas com as variáveis de ambiente
        if (credentials.email === adminEmail && credentials.password === adminPassword) {
          // Em caso de sucesso, retorna um objeto de usuário padrão.
          // Em um sistema real, aqui viriam dados do banco de dados (ID, nome, roles, etc.)
          return { id: "1", name: "Consultor Autorizado", email: credentials.email };
        }
        
        // Se as credenciais não corresponderem, a autorização falha.
        throw new Error("Credenciais inválidas. Verifique seu email e senha.");
      }
    })
  ],
  pages: {
    signIn: '/login', // Mantém a página de login customizada
  },
  secret: process.env.NEXTAUTH_SECRET, // Adicionado para segurança em produção
  callbacks: {
    // Garante que o ID do usuário seja incluído no token JWT e na sessão
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  }
})

export { handler as GET, handler as POST }