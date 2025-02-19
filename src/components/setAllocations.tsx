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
    year: number;
    month: number;
}

export default function SettingsAllocation({ userId, year, month }: SettingsAllocationProps) {
    const [allocation, setAllocation] = useState<Allocation>({ savings: 0, needs: 0, wants: 0 });
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);

    useEffect(() => {
        async function fetchAllocation() {
            setLoading(true);
            try {
                const data: Allocation | null = await getSpendingAllocation(userId, year, month);
                console.log("✅ Allocation Data Fetched:", data);

                if (data) {
                    setAllocation(data);
                } else {
                    showToast("No allocation data found. Set your allocation!", "warning");
                }
            } catch (error) {
                console.error("❌ Error fetching allocation:", error);
                showToast("Error loading allocation data", "error");
            }
            setLoading(false);
        }
        fetchAllocation();
    }, [userId, year, month]);



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

        // Calculate new total percentage
        const newAllocation = { ...allocation, [name]: newValue };
        const totalPercentage = newAllocation.savings + newAllocation.needs + newAllocation.wants;

        // Prevent exceeding 100%
        if (totalPercentage > 100) {
            showToast("Total allocation cannot exceed 100%", "error");
            return;
        }

        setAllocation(newAllocation);
    };

    const handleSave = async () => {
        const total = allocation.savings + allocation.needs + allocation.wants;
        if (total !== 100) {
            showToast("Total allocation must be exactly 100%", "error");
            return;
        }

        setSaving(true);
        const response = await updateSpendingAllocation(
            userId,
            year,
            month,
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

    if (loading) return <p>Loading...</p>;

    return (
        <div className="p-6 rounded-2xl shadow-lg bg-gray-100">
            <h2 className="text-xl font-semibold mb-4">Set Spending Allocation</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: "Savings", key: "savings", color: "bg-green-100 text-green-800" },
                    { title: "Needs", key: "needs", color: "bg-blue-100 text-blue-800" },
                    { title: "Wants", key: "wants", color: "bg-yellow-100 text-yellow-800" },
                ].map((item) => (
                    <div key={item.key} className={`p-6 rounded-2xl shadow-md ${item.color} font-semibold text-xl`}>
                        <p>{item.title}</p>
                        <input
                            type="number"
                            name={item.key}
                            value={allocation[item.key as keyof Allocation]}
                            onChange={handleChange}
                            min="0"
                            max="100"
                            className="mt-2 w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                        />
                    </div>
                ))}
            </div>

            <button
                onClick={handleSave}
                disabled={saving}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
            >
                {saving ? "Saving..." : "Update Allocation"}
            </button>
        </div>
    );
}
