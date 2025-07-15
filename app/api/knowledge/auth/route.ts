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
      // Lógica de autenticação (por enquanto, aceita qualquer usuário)
      async authorize(credentials) {
        // No futuro, aqui você validaria o email e a senha com seu banco de dados
        if (credentials?.email && credentials?.password) {
            // Retorna um objeto de usuário mockado se as credenciais existirem
            return { id: "1", name: "Consultor PRONASys", email: credentials.email }
        }
        // Retorna nulo se a autenticação falhar
        return null
      }
    })
  ],
  pages: {
    signIn: '/login', // Informa ao NextAuth qual é a nossa página de login customizada
  }
})

export { handler as GET, handler as POST }