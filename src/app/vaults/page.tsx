"use client";

import Header from "@/components/navbar";
import {useEffect, useState} from "react";
import {getVaults} from "@/app/actions/get/getVaults";
import {useSession} from "next-auth/react";

export interface Vault {
    referencecode: string;        // TEXT PRIMARY KEY
    user_id?: number | null;      // BIGINT
    name: string;                 // TEXT NOT NULL
    description?: string | null;  // TEXT
    notes?: string | null;        // TEXT
    created_at?: string;          // TIMESTAMP WITHOUT TIME ZONE
}


export default function Vaults() {
    const { data: session } = useSession();
    const [vault, setVault] = useState<Vault[]>([]);

    useEffect(() => {
        async function fetchVaults() {
            if (session?.user) {
                const data : Vault[] = await getVaults(session.user.id);
                setVault(data);
            }
        }
        fetchVaults().then(() => {});
    }, []);

    function buildVaults() {
        return vault.map((v) => (
            <div key={v.referencecode}>
                {v.referencecode} — {v.name}
            </div>
        ));
    }

    if (!session) return null;

    return (
        <>
            <Header />
            {buildVaults()}
        </>
    )
}
