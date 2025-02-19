"use client";

import { useEffect, useState } from "react";
import { getTransactions } from "@/app/actions/getTransactions";

interface Transaction {
    referencecode: string;
    description: string;
    amount: number;
    transaction_date: string;
}

interface TransactionColumnProps {
    userId: string;
    year: number;
    month: number;
    category: "Needs" | "Wants" | "Savings";  // ✅ Pass category as a prop
}

export default function TransactionColumn({ userId, year, month, category }: TransactionColumnProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const data = await getTransactions(userId, year, month);
            const filteredTransactions = data.filter(t => t.type === category); // ✅ Filter by category
            setTransactions(filteredTransactions);
            setLoading(false);
        }
        fetchData();
    }, [userId, year, month, category]);

    if (loading) return <p>Loading transactions...</p>;

    return (
        <div className="p-6 rounded-2xl shadow-lg bg-white text-gray-800 font-semibold text-xl border">
            <h2 className="text-lg font-bold mb-3">{category}</h2>
            {transactions.length > 0 ? (
                transactions.map((t) => (
                    <div key={t.referencecode} className="text-sm bg-gray-100 p-3 mb-2 rounded-lg">
                        <p>{t.description}</p>
                        <p className="text-right text-gray-600">${Number(t.amount).toFixed(2)}</p>
                    </div>
                ))
            ) : (
                <p className="text-gray-500">No transactions</p>
            )}
        </div>
    );
}
