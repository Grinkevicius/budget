'use client';

import "./globals.css";
import { SessionProvider, useSession } from "next-auth/react";
import Header from "@/components/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "next-themes";
import React from "react";

function AuthenticatedLayout({ children } : { children: React.ReactNode }) {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return null;
    }

    if (!session) {
        return (
            <main className="w-full">
                {children}
            </main>
        );
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="w-full">
                <Header />
                {children}
            </main>
        </SidebarProvider>
    );
}

export default function RootLayout({ children } : { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SessionProvider>
                <AuthenticatedLayout>
                    {children}
                </AuthenticatedLayout>
            </SessionProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}
