'use client';

import Header from '@/components/navbar'
import SpendingAllocation from "@/components/allocation";


export default function BudgetCards() {
    return (
        <>
        <Header />
        <div className="p-6">
            {/* First Row */}
            <SpendingAllocation userId={1} year={2025} month={2} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {["Column 1", "Column 2", "Column 3"].map((item, index) => (
                    <div
                        key={index}
                        className="p-6 rounded-2xl shadow-lg bg-white text-gray-800 font-semibold text-xl border"
                    >
                        {item}
                    </div>
                ))}
            </div>
        </div>
        </>
    );
}
