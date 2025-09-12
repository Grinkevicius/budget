"use client"

import {
    Folder,
    MoreHorizontal,
    Share,
    Trash2
} from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import {useEffect, useState} from "react";
import {getVaults} from "@/actions/get/getVaults";
import {Vault} from "@/components/app-sidebar";
import Link from "next/link";

export function NavVaults( { userid } : { userid: string | undefined }) {
    const { isMobile } = useSidebar()

    const [vaults, setVaults] = useState<{
        referencecode: string;
        user_id?: number | null;
        name: string;
        description?: string | null;
        notes?: string | null;
        created_at?: string;
    }[] | null>([]);

    useEffect(() => {
        if (userid !== undefined) {
            async function fetchVaults() {
                const data: Vault[] = await getVaults(userid);
                setVaults(data);
            }
            fetchVaults();
        }
    }, [userid]);

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Vaults</SidebarGroupLabel>
            <SidebarMenu>
                {vaults?.map((vault) => (
                    <SidebarMenuItem key={vault.referencecode}>
                        <SidebarMenuButton asChild>
                            <Link href={`/vaults`}>
                                {/*<vault.icon />*/}
                                <span>{vault.name}</span>
                            </Link>
                        </SidebarMenuButton>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuAction showOnHover>
                                    <MoreHorizontal />
                                    <span className="sr-only">More</span>
                                </SidebarMenuAction>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-48"
                                side={isMobile ? "bottom" : "right"}
                                align={isMobile ? "end" : "start"}
                            >
                                <DropdownMenuItem>
                                    <Folder className="text-muted-foreground" />
                                    <span>View Project</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Share className="text-muted-foreground" />
                                    <span>Share Project</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Trash2 className="text-muted-foreground" />
                                    <span>Delete Project</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                    <SidebarMenuButton>
                        <MoreHorizontal />
                        <span>More</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
    )
}
