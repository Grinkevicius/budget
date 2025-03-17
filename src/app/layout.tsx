'use client';

import "./globals.css";
import { SessionProvider } from "next-auth/react";
import Header from "@/components/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "next-themes";

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    <SessionProvider>
                        <SidebarProvider>
                            <AppSidebar />
                            <main className="w-full">
                                <Header />
                                {children}
                            </main>
                        </SidebarProvider>
                    </SessionProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
