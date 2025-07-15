"use client";

import { SessionProvider } from "next-auth/react";
import type React from "react";

// Este é um componente "Client Component" que simplesmente envolve
// a aplicação com o SessionProvider do NextAuth.
export default function NextAuthProvider({ children }: { children: React.ReactNode }) {
    return <SessionProvider>{children}</SessionProvider>;
}