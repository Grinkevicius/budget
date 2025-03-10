"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

// ShadCN UI components (adjust import paths as needed)
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface NavElement {
    name: string;
    href: string;
}

export default function Nav() {
    const { data: session } = useSession();
    const [open, setOpen] = useState(false);

    const navElements: NavElement[] = [
        { name: "Home", href: "/" },
        { name: "Dashboard", href: "/dashboard" },
        { name: "Settings", href: "/settings" },
        { name: "Vaults", href: "/vaults" },
    ];

    return (
        <nav className="bg-gray-800 sticky top-0 z-50">
            <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
                {/* Left side: Desktop Nav + Mobile Menu Button */}
                <div className="flex items-center gap-4">
                    {/* Mobile menu button (SheetTrigger) for small screens */}
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                className="p-2 text-gray-400 hover:text-white sm:hidden"
                                aria-label="Toggle menu"
                            >
                                {/* Simple hamburger icon */}
                                {!open ? (
                                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6h18M3 12h18m-18 6h18" />
                                    </svg>
                                ) : (
                                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                )}
                            </Button>
                        </SheetTrigger>

                        {/* The slide-out panel that appears on mobile */}
                        <SheetContent side="left" className="bg-gray-800 text-white w-[250px]">
                            <SheetHeader>
                                <SheetTitle className="text-white">Menu</SheetTitle>
                            </SheetHeader>
                            <div className="mt-4 space-y-2">
                                {navElements.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="block rounded-md px-3 py-2 text-base font-medium hover:bg-gray-700"
                                        onClick={() => setOpen(false)} // close sheet when a link is clicked
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </SheetContent>
                    </Sheet>

                    {/* Desktop Nav - hidden on small screens */}
                    <NavigationMenu className="hidden sm:block">
                        <NavigationMenuList className="flex space-x-2">
                            {navElements.map((item) => (
                                <NavigationMenuItem key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        {item.name}
                                    </Link>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                {/* Right side: Auth & Profile */}
                <div className="flex items-center space-x-4">
                    {session ? (
                        <>
                            {/* User Avatar */}
                            <Avatar>
                                <AvatarImage
                                    src={"https://www.gravatar.com/avatar/?d=mp"}
                                    alt={session.user?.name || "User"}
                                />
                                <AvatarFallback>
                                    {session.user?.name?.[0] ?? "U"}
                                </AvatarFallback>
                            </Avatar>

                            {/* Logout Button */}
                            <Button variant="destructive" onClick={() => signOut({ callbackUrl: "/auth/signin" })}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <Button variant="default" onClick={() => signIn()}>
                            Sign In
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    );
}
