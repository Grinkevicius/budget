"use client";

import { useSession } from "next-auth/react";
import {SidebarTrigger} from "@/components/ui/sidebar"


export default function Nav() {
    const { data: session } = useSession();

    if (!session) return null;

    return (
        <nav className="dark:bg-[#18181b] border-t border-border shadow-sm sticky top-0 z-50">
            <div className=" mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
                {/* Left side: Desktop Nav + Mobile Menu Button */}
                <div className="flex items-center gap-4">
                    <SidebarTrigger>
                    </SidebarTrigger>
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
