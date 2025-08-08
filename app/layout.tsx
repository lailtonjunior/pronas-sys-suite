// app/layout.tsx
// Arquivo de layout principal, atualizado para incluir o SessionProvider.

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import AuthSessionProvider from "@/components/auth/session-provider"; // Importe o provider

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PRONASys Suite",
  description: "Plataforma para elaboração de projetos PRONAS/PCD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthSessionProvider> {/* Envolva a aplicação com o provider de sessão */}
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystemMonitoring
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
