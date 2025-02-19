'use client';

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/navbar";
import SpendingAllocation from "@/components/allocation";
import TransactionColumn from "@/components/TransactionColumn";
import TransactionInput from "@/components/TransactionInput";
import { getCategories } from "@/app/actions/getCategories";
import { getBudgetForMonth } from "@/app/actions/getBudget"; // ✅ Fetch budget dynamically

export default function BudgetCards() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [categories, setCategories] = useState<{ referencecode: string; type: string }[]>([]);
    const [budgetCode, setBudgetCode] = useState<string | null>(null);
    const [reload, setReload] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            setTimeout(() => router.push("/auth/signin"), 0);
        }
    }, [status, router]);

    // ✅ Fetch categories
    useEffect(() => {
        async function fetchCategories() {
            const data = await getCategories();
            setCategories(data);
        }
        fetchCategories();
    }, []);

    // ✅ Fetch the correct budget for the user
    useEffect(() => {
        async function fetchBudget() {
            if (session?.user) {
                const data = await getBudgetForMonth(session.user.id, 2025, 2);
                if (data) {
                    console.log("Fetched Budget Code:", data.referencecode);
                    setBudgetCode(data.referencecode);
                }
            }
        }
        fetchBudget();
    }, [session]);

    if (status === "loading" || !budgetCode) return <p>Loading...</p>;
    if (!session) return null;

    return (
        <>
            <Header />
            <div className="p-6">
                <SpendingAllocation userId={session.user.id} year={2025} month={2} />

                {/* ✅ Pass the dynamically fetched `budgetCode` */}
                <TransactionInput
                    userId={session.user.id}
                    budgetCode={budgetCode}
                    categories={categories}
                    refreshTransactions={() => setReload(!reload)} // Trigger UI refresh
                />

                {/* ✅ Transactions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <TransactionColumn userId={session.user.id} year={2025} month={2} category="Needs" key={`needs-${reload}`} />
                    <TransactionColumn userId={session.user.id} year={2025} month={2} category="Wants" key={`wants-${reload}`} />
                    <TransactionColumn userId={session.user.id} year={2025} month={2} category="Savings" key={`savings-${reload}`} />
                </div>
            </div>
        </>
    );
}
