"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        
        // Usa a função signIn do next-auth para tentar o login
        const result = await signIn("credentials", {
            redirect: false, // Não redireciona automaticamente, nós faremos isso
            email,
            password,
        });

        if (result?.ok) {
            // Se o login for bem-sucedido, redireciona para o dashboard
            router.push('/');
            router.refresh(); // Força a atualização da página para refletir o estado de login
        } else {
            // Se falhar, mostra um alerta
            alert(result?.error || "Falha no login. Verifique suas credenciais.");
        }
    };
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-muted/40 p-4">
            <Card className="w-full max-w-sm">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">PRONASys Suite</CardTitle>
                    <CardDescription>
                        Acesse a plataforma com suas credenciais
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="consultor@pronasys.com" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input id="password" name="password" type="password" required />
                        </div>
                        <Button type="submit" className="w-full mt-2">Entrar</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}