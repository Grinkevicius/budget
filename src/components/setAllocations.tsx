"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { getSpendingAllocation, updateSpendingAllocation } from "@/app/actions/settings_allocations";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

interface Allocation {
    savings: number;
    needs: number;
    wants: number;
}

interface SettingsAllocationProps {
    userId: string;
}

export default function SettingsAllocation({ userId }: SettingsAllocationProps) {
    const [allocation, setAllocation] = useState<Allocation>({
        savings: 0,
        needs: 0,
        wants: 0
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);

    useEffect(() => {
        async function fetchAllocation() {
            setLoading(true);
            try {
                const data = await getSpendingAllocation(userId);

                if (data) {
                    setAllocation(data);
                } else {
                    showToast("No allocation data found. Set your allocation!", "warning");
                }
            } catch {
                showToast("Error loading allocation data", "error");
            }
            setLoading(false);
        }
        fetchAllocation();
    }, [userId]);

    const showToast = (message: string, type: "success" | "error" | "warning") => {
        MySwal.fire({
            toast: true,
            position: "top-end",
            icon: type,
            title: message,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
        });
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newValue = parseFloat(value) || 0;
        const newAllocation = { ...allocation, [name]: newValue };
        const totalPercentage = Number(newAllocation.savings) + Number(newAllocation.needs) + Number(newAllocation.wants);
        console.log(totalPercentage)
        if (totalPercentage > 100) {
            showToast("Total allocation cannot exceed 100%", "error");
            return;
        }

        setAllocation(newAllocation);
    };

    const handleSave = async () => {
        const total = Number(allocation.savings) + Number(allocation.needs) + Number(allocation.wants);
        if (total !== 100) {
            showToast("Total allocation must be exactly 100%", "error");
            return;
        }

        setSaving(true);
        const response = await updateSpendingAllocation(
            userId,
            allocation.savings,
            allocation.needs,
            allocation.wants
        );

        if (response?.error) {
            showToast("Failed to update allocation", "error");
        } else {
            showToast("Allocation updated successfully!", "success");
        }

        setSaving(false);
    };

    if (loading) {
        return (
            <div className="p-6 rounded-2xl shadow-lg bg-white animate-pulse">
                {/* Skeleton for heading */}
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
                {/* Skeleton grid for allocation cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="p-6 rounded-2xl shadow-md bg-gray-200">
                            <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                            <div className="h-10 bg-gray-300 rounded"></div>
                        </div>
                    ))}
                </div>
                {/* Skeleton for button */}
                <div className="mt-6 h-10 bg-gray-200 rounded w-32"></div>
            </div>
        );
    }

    return (
        <div className="p-6 rounded-2xl shadow-lg bg-white">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Set Spending Allocation</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: "Savings", key: "savings", color: "bg-green-50 text-green-700", border: "border-green-200" },
                    { title: "Needs", key: "needs", color: "bg-blue-50 text-blue-700", border: "border-blue-200" },
                    { title: "Wants", key: "wants", color: "bg-yellow-50 text-yellow-700", border: "border-yellow-200" },
                ].map((item) => (
                    <div key={item.key} className={`p-6 rounded-2xl shadow-md ${item.color} border ${item.border} font-semibold`}>
                        <p>{item.title}</p>
                        <input
                            type="number"
                            name={item.key}
                            value={allocation[item.key as keyof Allocation]}
                            onChange={handleChange}
                            min="0"
                            max="100"
                            className="mt-2 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>
                ))}
            </div>
            <button
                onClick={handleSave}
                disabled={saving}
                className="mt-6 w-full md:w-auto bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transition font-semibold"
            >
                {saving ? "Saving..." : "Update Allocation"}
            </button>
        </div>
    );
}
