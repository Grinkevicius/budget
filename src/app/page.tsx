"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function BudgetCards() {
    const { status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin");
        }
    }, [status, router]);

    if (status === "loading") return <p>Loading session...</p>;
    if (status === "unauthenticated") return null;

    return (
        <div className="p-6">
            <h1>Budget Cards</h1>
        </div>
    );
}
