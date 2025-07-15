import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Toaster } from "@/components/ui/toaster"
import NextAuthProvider from "@/components/auth/session-provider"
import { getServerSession } from "next-auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PRONASys Suite - Gestão de Projetos PRONAS/PCD",
  description:
    "Ferramenta especializada para otimizar e automatizar a elaboração de projetos médico-assistenciais para o PRONAS/PCD",
    generator: 'v0.dev'
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession();

  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <NextAuthProvider>
            <SidebarProvider defaultOpen={true}>
              <div className="flex min-h-screen w-full">
                {/* A lógica para mostrar/esconder a sidebar ou redirecionar
                    idealmente ficaria em um middleware ou no componente de página,
                    mas aqui garantimos que o provedor envolva tudo. */}
                <AppSidebar />
                <main className="flex-1 overflow-auto">{children}</main>
              </div>
              <Toaster />
            </SidebarProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}