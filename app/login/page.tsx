// app/login/page.tsx
// Página de login completamente redesenhada com um layout moderno de duas colunas.

"use client";

import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";

// Ícone do Google em formato SVG para o botão
const GoogleIcon = () => (
    <svg className="mr-3 h-5 w-5" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 21.2 172.9 56.5l-63.8 63.8C324.5 97.2 289.3 80 248 80c-82.8 0-150.5 67.7-150.5 150.5S165.2 406.5 248 406.5c94.2 0 125.3-72.3 129.2-108.5H248v-85.3h236.1c2.3 12.7 3.9 26.9 3.9 41.6z"></path>
    </svg>
);

// Componente SVG para a ilustração do lado direito
const LoginIllustration = () => (
    <svg width="100%" height="100%" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
        <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: 'rgba(59, 130, 246, 0.8)', stopOpacity:1}} />
                <stop offset="100%" style={{stopColor: 'rgba(139, 92, 246, 0.8)', stopOpacity:1}} />
            </linearGradient>
            <linearGradient id="grad2" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" style={{stopColor: 'rgba(34, 197, 94, 0.7)', stopOpacity:1}} />
                <stop offset="100%" style={{stopColor: 'rgba(22, 163, 74, 0.9)', stopOpacity:1}} />
            </linearGradient>
        </defs>
        <rect width="800" height="800" fill="#111827" />
        <g opacity="0.6">
            <path d="M-100 400 Q 150 100, 400 400 T 900 400" stroke="url(#grad1)" strokeWidth="3" fill="none" />
            <path d="M-100 500 Q 250 800, 500 500 T 1000 500" stroke="url(#grad2)" strokeWidth="2" fill="none" />
            <circle cx="100" cy="150" r="30" fill="url(#grad1)" />
            <circle cx="650" cy="250" r="50" fill="url(#grad2)" />
            <circle cx="700" cy="650" r="25" fill="rgba(255,255,255,0.1)" />
            <rect x="200" y="600" width="100" height="100" rx="15" fill="rgba(255,255,255,0.05)" transform="rotate(45 250 650)" />
        </g>
    </svg>
);


export default function LoginPage() {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "authenticated") {
            redirect("/");
        }
    }, [status]);

    if (status === "loading") {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <p>Carregando...</p>
            </div>
        );
    }

    return (
        <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                                <Sparkles className="h-5 w-5 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold">PRONASys Suite</h1>
                        </div>
                        <p className="text-balance text-muted-foreground">
                            Acesse a plataforma para otimizar seus projetos PRONAS/PCD.
                        </p>
                    </div>
                    <div className="grid gap-4">
                        <Button
                            onClick={() => signIn("google", { callbackUrl: "/" })}
                            variant="outline"
                            className="w-full text-md py-6"
                        >
                            <GoogleIcon />
                            Entrar com Google
                        </Button>
                    </div>
                    <div className="mt-4 text-center text-sm">
                        <p className="text-muted-foreground">
                            Ao continuar, você concorda com nossos Termos de Serviço.
                        </p>
                    </div>
                </div>
            </div>
            <div className="hidden bg-muted lg:block relative">
                <LoginIllustration />
            </div>
        </div>
    );
}
