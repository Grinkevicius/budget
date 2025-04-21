'use client';

import "./globals.css";
import React from "react";
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { SessionProvider, useSession } from "next-auth/react";
import Header from "@/components/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "next-themes";
import { AlertProvider } from '@/contexts/AlertContext';
import { VaultProvider } from "@/contexts/VaultContext";

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
            <VaultProvider>
                <AppSidebar />
                <main className="w-full">
                    <Header />
                    {children}
                </main>
            </VaultProvider>
        </SidebarProvider>
    );
}

export default function RootLayout({ children } : { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body>
            <Provider store={store}>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    <SessionProvider>
                        <AuthenticatedLayout>
                            <AlertProvider>
                                {children}
                            </AlertProvider>
                        </AuthenticatedLayout>
                    </SessionProvider>
                </ThemeProvider>
            </Provider>
        </body>
        </html>
    );
}