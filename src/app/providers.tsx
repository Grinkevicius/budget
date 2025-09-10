'use client';

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
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Loading session...</p>
                </div>
            </div>
        );
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

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <ThemeProvider 
                attribute="class" 
                defaultTheme="system" 
                enableSystem
                disableTransitionOnChange
            >
                <SessionProvider 
                    basePath="/api/auth"
                    refetchInterval={0}
                    refetchOnWindowFocus={false}
                >
                    <AuthenticatedLayout>
                        <AlertProvider>
                            {children}
                        </AlertProvider>
                    </AuthenticatedLayout>
                </SessionProvider>
            </ThemeProvider>
        </Provider>
    );
}