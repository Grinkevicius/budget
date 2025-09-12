"use client";

import React from "react";
import Link from "next/link";
import { Home, PlusCircle, User, Vault, LayoutDashboard } from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

type MobileBottomBarProps = {
    onCreate?: () => void;
    session?: {
        user: {
            id: string;
            name: string;
        };
    }
};

const MobileBottomBar: React.FC<MobileBottomBarProps> = ({ onCreate, session }) => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 dark:bg-[#18181b] border-t border-border shadow-sm md:hidden">
            <ul className="flex justify-around">
                <li>
                    <Link href="/public" className="flex flex-col items-center justify-center p-2">
                        <Home className="w-6 h-6" />
                        <span className="text-xs">Home</span>
                    </Link>
                </li>
                <li>
                    <Link href="/dashboard" className="flex flex-col items-center justify-center p-2">
                        <LayoutDashboard className="w-6 h-6" />
                        <span className="text-xs">Dash</span>
                    </Link>
                </li>
                <li>
                    {onCreate ? (
                        <button onClick={onCreate} className="flex flex-col items-center justify-center p-2">
                            <PlusCircle className="w-6 h-6" />
                            <span className="text-xs">Add</span>
                        </button>
                    ) : (
                        <Link href="/create" className="flex flex-col items-center justify-center p-2">
                            <PlusCircle className="w-6 h-6" />
                            <span className="text-xs">Create</span>
                        </Link>
                    )}
                </li>
                <li>
                    <Link href="/vaults" className="flex flex-col items-center justify-center p-2">
                        <Vault className="w-6 h-6" />
                        <span className="text-xs">Vaults</span>
                    </Link>
                </li>
                <li>
                    {session ? (
                        <>
                            {/* User Avatar */}

                            <Link href="/profile" className="flex flex-col items-center justify-center p-2">
                                <Avatar className="w-6 h-6">
                                    <AvatarImage
                                        src="https://www.gravatar.com/avatar/?d=mp"
                                        alt={session.user?.name || "User"}
                                    />
                                    <AvatarFallback>
                                        {session.user?.name?.[0] ?? "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-xs">Profile</span>
                            </Link>
                        </>
                    ) : (
                        <Link href="/profile" className="flex flex-col items-center justify-center p-2">
                            <User className="w-6 h-6" />
                            <span className="text-xs">Profile</span>
                        </Link>
                    )}


                </li>
            </ul>
        </nav>
    );
};

export default MobileBottomBar;
