"use client";

import React, { useEffect, useState } from "react";
import { getVault } from "@/app/actions/get/getVault";
import { useSession } from "next-auth/react";
import MobileBottomBar from "@/components/mobile/mobileBottomBar";
import Breadcrumbs from "@/components/breadcrumbs";
import type { BreadcrumbItem } from "@/components/breadcrumbs";

interface Vault {
    referencecode: string;        // TEXT PRIMARY KEY
    user_id?: number | null;      // BIGINT
    name: string;                 // TEXT NOT NULL
    description?: string | null;  // TEXT
    notes?: string | null;        // TEXT
    created_at?: string;          // TIMESTAMP WITHOUT TIME ZONE
}

export default function ManageVault({params}: {
    params: Promise<{ referenceCode: string }>;
}) {

    const { referenceCode } = React.use(params);
    const { data: session } = useSession();
    const [vault, setVault] = useState<null | Vault>();

    const breadcrumbs: BreadcrumbItem[] = [
        { label: "Dashboard", href: "/dashboard", separator: true },
        { label: "Vaults", href: "/vaults", separator: true },
        { label: "Manage", href: `/vaults/manage/${referenceCode}`, separator: false },
    ];

    useEffect(() => {
        async function fetchVault() {
            if (session?.user) {
                const data: Vault = await getVault(session.user.id, referenceCode);
                setVault(data);
            }
        }
        fetchVault();
    }, []);

    useEffect(() => {
        console.log("Updated vault:", vault);
    }, [vault]);


    if (!session) return null;

    return (
        <>
        <Breadcrumbs items={breadcrumbs} />
        { vault ? (
            <>
                <div className="flex flex-col px-2">
                    {vault.name}
                </div>
                <div className="h-[60px]" />
                <MobileBottomBar session={session} />
            </>
        ) : (
           <div>Loading...</div>
        )
        }
        </>
    );
}
