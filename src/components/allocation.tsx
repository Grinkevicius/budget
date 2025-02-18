"use client";

import { useEffect, useState } from "react";
import { getSpendingData } from "@/app/actions/allocations";

export default function SpendingAllocation({ userId, year, month }) {
    const [allocation, setAllocation] = useState({ savings: 0, needs: 0, wants: 0 });
    const [income, setIncome] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const data = await getSpendingData(userId, year, month);
            if (data.allocation) {
                setAllocation({
                    savings: data.allocation.savings_percentage,
                    needs: data.allocation.needs_percentage,
                    wants: data.allocation.wants_percentage
                });
            }
            setIncome(data.income);
            setLoading(false);
        }
        fetchData();
    }, [userId, year, month]);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="p-6 rounded-2xl shadow-lg bg-gray-100">
            <h2 className="text-xl font-semibold mb-4">Spending Allocation</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: "Savings", key: "savings", color: "bg-green-100 text-green-800" },
                    { title: "Needs", key: "needs", color: "bg-blue-100 text-blue-800" },
                    { title: "Wants", key: "wants", color: "bg-yellow-100 text-yellow-800" },
                ].map((item) => (
                    <div key={item.key} className={`p-6 rounded-2xl shadow-md ${item.color} font-semibold text-xl`}>
                        <p>{item.title}: {allocation[item.key]}%</p>
                        {income > 0 && (
                            <p className="text-lg font-medium mt-1">
                                ${((allocation[item.key] / 100) * income).toFixed(2)}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
