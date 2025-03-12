'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import Header from "@/components/navbar";
import {SidebarProvider} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function RootLayout({children}: Readonly<{ children: React.ReactNode; }>) {
  return (
      <SessionProvider>
          <html>
              <body>
                  <SidebarProvider>
                      <AppSidebar />
                      <main className={`w-full`}>
                          <Header />
                          {children}
                      </main>
                  </SidebarProvider>
              </body>
          </html>
      </SessionProvider>
  );
}
