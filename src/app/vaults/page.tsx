"use client";

import React, { useEffect, useState } from "react";
import { getVaults } from "@/app/actions/get/getVaults";
import { useSession } from "next-auth/react";
import MobileBottomBar from "@/components/mobile/mobileBottomBar";
import Breadcrumbs from "@/components/breadcrumbs";
import type { BreadcrumbItem } from "@/components/breadcrumbs";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Avatar, AvatarImage} from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

export interface Vault {
    referencecode: string;        // TEXT PRIMARY KEY
    user_id?: number | null;      // BIGINT
    name: string;                 // TEXT NOT NULL
    description?: string | null;  // TEXT
    notes?: string | null;        // TEXT
    created_at?: string;          // TIMESTAMP WITHOUT TIME ZONE
}

const breadcrumbs: BreadcrumbItem[] = [
    { label: "Dashboard", href: "/dashboard", separator: true },
    { label: "Vaults", href: "/vaults", separator: false }
];

export default function Vaults() {
    const router = useRouter();
    const { data: session } = useSession();
    const [vault, setVault] = useState<Vault[]>([]);

    useEffect(() => {
        async function fetchVaults() {
            if (session?.user) {
                const data: Vault[] = await getVaults(session.user.id);
                setVault(data);
            }
        }
        fetchVaults();
    }, [session]);

    function buildVaults() {
        return vault.map((v) => (
            <Card key={v.referencecode} className={`p-2 m-1 flex flex-col`}>
                <div className={`flex justify-between items-center`}>
                    <div className={`inline-flex justify-between`}>
                        <div className={`flex w-[70px] justify-center`}>
                            <Avatar className="w-10 h-10">
                                <AvatarImage
                                    src="https://www.gravatar.com/avatar/?d=mp"
                                    alt={"User"}
                                />
                            </Avatar>
                        </div>

                        <div key={v.referencecode} className={`flex items-center`}>
                            { v.name }
                        </div>
                    </div>
                    <Button onClick={() => router.push(`/vaults/${v.referencecode}/manage`)} variant="outline">
                        Manage
                    </Button>
                </div>

            </Card>

        ));
    }

    if (!session) return null;

    return (
        <>

            <div className="mx-auto max-w-7xl px-4 w-full flex flex-col">
                <Breadcrumbs items={breadcrumbs} />
                {buildVaults()}
            </div>


            <div className="h-[60px]" />
            <MobileBottomBar session={session} />
        </>
    );
}
