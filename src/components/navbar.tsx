"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from "@/components/ui/navigation-menu";
import {SidebarTrigger} from "@/components/ui/sidebar"

interface NavElement {
    name: string;
    href: string;
}

export default function Nav() {
    const { data: session } = useSession();

    const navElements: NavElement[] = [
        { name: "", href: "/" },
        // { name: "Dashboard", href: "/dashboard" },
        // { name: "Settings", href: "/settings" },
        // { name: "Vaults", href: "/vaults" },
    ];

    if (!session) return null;

    return (
        <nav className="bg-background border-t border-border shadow-sm sticky top-0 z-50">
            <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
                {/* Left side: Desktop Nav + Mobile Menu Button */}
                <div className="flex items-center gap-4">
                    <SidebarTrigger>
                    </SidebarTrigger>


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
                {/*<div className="flex items-center space-x-4">*/}
                {/*    {session ? (*/}
                {/*        <>*/}
                {/*            /!* User Avatar *!/*/}
                {/*            /!*<Avatar>*!/*/}
                {/*            /!*    <AvatarImage*!/*/}
                {/*            /!*        src={"https://www.gravatar.com/avatar/?d=mp"}*!/*/}
                {/*            /!*        alt={session.user?.name || "User"}*!/*/}
                {/*            /!*    />*!/*/}
                {/*            /!*    <AvatarFallback>*!/*/}
                {/*            /!*        {session.user?.name?.[0] ?? "U"}*!/*/}
                {/*            /!*    </AvatarFallback>*!/*/}
                {/*            /!*</Avatar>*!/*/}

                {/*            /!* Logout Button *!/*/}
                {/*            <Button variant="destructive" onClick={() => signOut({ callbackUrl: "/auth/signin" })}>*/}
                {/*                Logout*/}
                {/*            </Button>*/}
                {/*        </>*/}
                {/*    ) : (*/}
                {/*        <Button variant="default" onClick={() => signIn()}>*/}
                {/*            Sign In*/}
                {/*        </Button>*/}
                {/*    )}*/}
                {/*</div>*/}
            </div>
        </nav>
    );
}
