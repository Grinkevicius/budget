"use client";

import { useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/navbar";
import { SessionContext } from "@/utils/session";

export default function BudgetCards() {
    const session = useContext(SessionContext);
    const router = useRouter();

    useEffect(() => {
        if (session === null) {
            router.push("/auth/signin");
        }
    }, [session, router]);

    if (!session) return <p>Loading session...</p>;

    return (
        <>
            <Header />
            <div className="p-6">
                <h1>Budget Cards</h1>
            </div>
        </>
    );
}
