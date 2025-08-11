// app/login/page.tsx
// Página de login redesenhada com formulário de email/senha.

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um email válido." }),
  password: z.string().min(1, { message: "A senha é obrigatória." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginIllustration = () => (
    <div className="hidden lg:block h-full bg-gray-900">
        {/* Você pode adicionar uma imagem ou ilustração aqui */}
    </div>
);

export default function LoginPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    useEffect(() => {
        if (status === "authenticated") {
            redirect("/");
        }
    }, [status]);

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true);
        const result = await signIn("credentials", {
            redirect: false,
            email: data.email,
            password: data.password,
        });

        setIsLoading(false);

        if (result?.error) {
            toast({
                variant: "destructive",
                title: "Falha no login",
                description: result.error,
            });
        } else if (result?.ok) {
            router.push("/");
        }
    };

    if (status === "loading" || (status === "authenticated")) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin" />
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
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="seu@email.com"
                                {...form.register("email")}
                            />
                            {form.formState.errors.email && <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input id="password" type="password" {...form.register("password")} />
                            {form.formState.errors.password && <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>}
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Entrar
                        </Button>
                    </form>
                </div>
            </div>
            <LoginIllustration />
        </div>
    );
}
