"use client";

import React from "react";
import Link from "next/link";
import { Home, Search, PlusCircle, Heart, User, Vault } from "lucide-react";

type MobileBottomBarProps = {
    onCreate?: () => void;
};

const MobileBottomBar: React.FC<MobileBottomBarProps> = ({ onCreate }) => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-sm md:hidden">
            <ul className="flex justify-around">
                <li>
                    <Link href="/" className="flex flex-col items-center justify-center p-2">
                        <Home className="w-6 h-6" />
                        <span className="text-xs">Home</span>
                    </Link>
                </li>
                <li>
                    <Link href="/search" className="flex flex-col items-center justify-center p-2">
                        <Search className="w-6 h-6" />
                        <span className="text-xs">Search</span>
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
                    <Link href="/profile" className="flex flex-col items-center justify-center p-2">
                        <User className="w-6 h-6" />
                        <span className="text-xs">Profile</span>
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default MobileBottomBar;
