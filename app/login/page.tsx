// app/login/page.tsx
// Página de login atualizada para ser funcional.

"use client";

import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";

// Ícone do Google em formato SVG para o botão
const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 21.2 172.9 56.5l-63.8 63.8C324.5 97.2 289.3 80 248 80c-82.8 0-150.5 67.7-150.5 150.5S165.2 406.5 248 406.5c94.2 0 125.3-72.3 129.2-108.5H248v-85.3h236.1c2.3 12.7 3.9 26.9 3.9 41.6z"></path>
    </svg>
);


export default function LoginPage() {
    const { data: session, status } = useSession();

    useEffect(() => {
        // Se o usuário já estiver logado, redireciona para a dashboard
        if (status === "authenticated") {
            redirect("/");
        }
    }, [status]);

    // Mostra um loader enquanto a sessão está sendo verificada
    if (status === "loading") {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <p>Carregando...</p>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <Image 
                        src="/placeholder-logo.svg" 
                        alt="PRONASys Logo" 
                        width={80} 
                        height={80} 
                        className="mx-auto mb-4" 
                    />
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                        Bem-vindo ao PRONASys Suite
                    </h1>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        Faça login para continuar
                    </p>
                </div>
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                    <div className="p-6 space-y-4">
                        <Button
                            onClick={() => signIn("google", { callbackUrl: "/" })}
                            className="w-full"
                            variant="outline"
                        >
                            <GoogleIcon />
                            Entrar com Google
                        </Button>
                        <p className="text-center text-xs text-muted-foreground">
                           Ao continuar, você concorda com nossos Termos de Serviço e Política de Privacidade.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
