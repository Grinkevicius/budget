'use client';

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/navbar";

export default function BudgetCards() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin");
        }
    }, [status, router]);

    if (!session) return null;

    return (
        <>
            <Header />
            {status !== "authenticated" ? (
                <p>Loading...</p>
            ) : (
                <div className="p-6 ">
                </div>
            )}
        </>
    );


}
