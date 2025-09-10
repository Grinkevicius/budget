import React, { useEffect, useState } from "react";
import {
    Vault,
    Home,
    LayoutDashboard,
    Sun,
    Moon,
    ChevronRight,
    MoreHorizontal,
    Folder,
    Share,
    Trash2
} from "lucide-react";
import { useTheme } from "next-themes";

import {
    Sidebar,
    SidebarContent, SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { NavUser } from "@/components/sidebar/user";
import {useSession} from "next-auth/react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import {getVaults} from "@/actions/get/getVaults";
import {DropdownMenuSeparator, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import { useVault } from "@/contexts/VaultContext";
import { useRouter } from 'next/navigation';


interface MenuItem {
    title: string;
    url: string;
    icon?: React.ElementType;
    isActive?: boolean;
    items?: {
        referencecode: string;
        title: string; url: string }[];
}

export interface Vault {
    referencecode: string;
    user_id?: number | null;
    name: string;
    description?: string | null;
    notes?: string | null;
    created_at?: string;
}

export function AppSidebar() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const { setSelectedVaultRef } = useVault();
    const router = useRouter();
    const {data: session} = useSession();
    const { isMobile } = useSidebar();

    const [menuItems, setMenuItems] = useState<MenuItem[]>([
        {
            title: "Home",
            url: "#",
            icon: Home,
        },
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "Vaults",
            url: "/vaults",
            icon: Vault,
            isActive: true,
            items: [],
        },
        {
            title: "Phone",
            url: "/phone",
            icon: Vault,
            isActive: true,
            items: [],
        },
    ]);

    useEffect(() => {
        if (session?.user?.id) {
            async function fetchVaults() {
                try {
                    const vaultData: Vault[] = await getVaults(session!.user!.id);
                    const vaultItems = vaultData.map((vault) => ({
                        title: vault.name,
                        url: `/vaults/manage`,
                        referencecode: vault.referencecode,
                    }));

                    setMenuItems((prevItems) =>
                        prevItems.map((item) =>
                            item.title === "Vaults" ? { ...item, items: vaultItems } : item
                        )
                    );
                } catch (error) {
                    console.error('Failed to fetch vaults:', error);
                }
            }
            fetchVaults();
        }
    }, [session?.user?.id]);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) =>
                                item?.title === "Vaults" ? (
                                    <Collapsible key={item.title}>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton asChild>
                                                <Link href={item.url}>
                                                    {item.icon && <item.icon />}
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                            {item.items?.length ? (
                                                <>
                                                    <CollapsibleTrigger asChild>
                                                        <SidebarMenuAction className="data-[state=open]:rotate-90">
                                                            <ChevronRight />
                                                            <span className="sr-only">Toggle</span>
                                                        </SidebarMenuAction>
                                                    </CollapsibleTrigger>
                                                    <CollapsibleContent>
                                                        <SidebarMenuSub>
                                                            {item.items?.map((subItem, index) => (
                                                                <SidebarMenuSubItem key={index}>
                                                                    <div className="flex items-center justify-between w-full h-7">
                                                                        <SidebarMenuSubButton asChild>
                                                                            <button
                                                                                onClick={() => {
                                                                                    setSelectedVaultRef(subItem.referencecode);
                                                                                    router.push('/vaults/manage');
                                                                                }}
                                                                            >
                                                                                <span>{subItem.title}</span>
                                                                            </button>
                                                                        </SidebarMenuSubButton>

                                                                        <DropdownMenu>
                                                                            <DropdownMenuTrigger asChild>
                                                                                <button type="button" className="w-1 text-sm">
                                                                                    <MoreHorizontal />
                                                                                    <span className="sr-only">More</span>
                                                                                </button>
                                                                            </DropdownMenuTrigger>
                                                                            <DropdownMenuContent
                                                                                className="w-39"
                                                                                side={isMobile ? "bottom" : "bottom"}
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
                                                                    </div>
                                                                </SidebarMenuSubItem>
                                                            ))}
                                                        </SidebarMenuSub>
                                                    </CollapsibleContent>
                                                </>
                                            ) : null}

                                        </SidebarMenuItem>
                                    </Collapsible>
                                ) : (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link href={item.url}>
                                                {item.icon && <item.icon />}
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            )}


                            {/* Dark Mode Toggle */}
                            <SidebarMenuItem>
                                <SidebarMenuButton onClick={toggleTheme}>
                                    {theme === "dark" ? <Sun /> : <Moon />}
                                    <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>


                        </SidebarMenu>
                        {/*<NavVaults userid={session?.user.id} />*/}
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={session ? session.user : {name: "", email: "", id: ""}} />
            </SidebarFooter>
        </Sidebar>
    );
}
