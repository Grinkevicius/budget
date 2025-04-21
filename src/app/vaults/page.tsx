"use client";

import React, { useEffect, useState } from "react";
import { getVaults } from "@/app/actions/get/getVaults";
import { useSession } from "next-auth/react";
import MobileBottomBar from "@/components/mobile/mobileBottomBar";
import Breadcrumbs from "@/components/breadcrumbs";
import type { BreadcrumbItem } from "@/components/breadcrumbs";
import {Card} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {useVault} from "@/app/contexts/VaultContext";

export interface Vault {
    referencecode: string;        // TEXT PRIMARY KEY
    user_id?: number | null;      // BIGINT
    name: string;                 // TEXT NOT NULL
    image: string;                // TEXT
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
    const { setSelectedVaultRef } = useVault();

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
        return vault.map((v) => {
            console.log(v.image);
            return (
            <Card key={v.referencecode} className="relative h-48 overflow-hidden group">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url('${v.image ? v.image : 'https://www.thedaviscompanies.com/wp-content/uploads/2018/05/Union-Trust-Bank-Vault-Cropped.jpg'}')`,
                        backgroundBlendMode: 'overlay'
                    }}
                />
                <div className="absolute inset-0 bg-black/50 transition-opacity group-hover:bg-black/40"/>

                <div className="relative h-full p-6 flex flex-col justify-between">
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-white">
                            {v.name}
                        </h3>
                        {v.description && (
                            <p className="text-sm text-gray-200">
                                {v.description}
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <Button
                            onClick={() => {
                                setSelectedVaultRef(v.referencecode);
                                router.push('/vaults/manage');
                            }}
                            variant="outline"
                            className="w-fit bg-white/10 hover:bg-white/20 border-white/20 text-white"
                        >
                            Manage
                        </Button>
                    </div>
                </div>
            </Card>

        )});
    }

    if (!session) return null;

    return (
        <>
            <div className="">
                <Breadcrumbs items={breadcrumbs} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {buildVaults()}
                </div>
            </div>

            <div className="h-[60px]" />
            <MobileBottomBar session={session} />
        </>
    );

}
