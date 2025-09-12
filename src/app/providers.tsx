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
    const [loadingTimeout, setLoadingTimeout] = React.useState(false);

    // Add timeout for loading state to prevent infinite loading
    React.useEffect(() => {
        if (status === "loading") {
            const timer = setTimeout(() => {
                setLoadingTimeout(true);
            }, 10000); // 10 second timeout

            return () => clearTimeout(timer);
        } else {
            setLoadingTimeout(false);
        }
    }, [status]);

    // Debug logging (remove in production)
    React.useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            console.log('Session status:', status, 'Session:', session);
        }
    }, [status, session]);

    if (status === "loading" && !loadingTimeout) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Loading session...</p>
                </div>
            </div>
        );
    }

    // If loading timed out, show error and continue without session
    if (loadingTimeout) {
        console.warn('Session loading timed out, continuing without session');
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
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Show loading during hydration
    if (!mounted) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <Provider store={store}>
            <ThemeProvider 
                attribute="class" 
                defaultTheme="light" 
                disableTransitionOnChange
            >
                <SessionProvider 
                    basePath="/api/auth"
                    refetchInterval={0}
                    refetchOnWindowFocus={false}
                    refetchWhenOffline={false}
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