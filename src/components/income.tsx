"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { getUserIncome, updateUserIncome } from "@/app/actions/income_actions";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

interface IncomeSetterProps {
    userId: string;
}

export default function IncomeSetter({ userId }: IncomeSetterProps) {
    const [income, setIncome] = useState<string | number>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);

    useEffect(() => {
        async function fetchIncome() {
            const incomeAmount: number | null = await getUserIncome(userId);
            if (incomeAmount !== null) setIncome(incomeAmount);
            setLoading(false);
        }
        fetchIncome();
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
        const value = parseFloat(e.target.value);
        if (value < 0) {
            showToast("Income cannot be negative!", "warning");
            return;
        }
        setIncome(isNaN(value) ? "" : value);
    };

    const handleSave = async () => {
        if (income === "" || isNaN(Number(income)) || Number(income) < 0) {
            showToast("Please enter a valid income!", "error");
            return;
        }

        setSaving(true);
        const response = await updateUserIncome(userId, Number(income));

        if (response.error) {
            showToast("Failed to update income!", "error");
        } else {
            showToast("Income updated successfully!", "success");
        }
        setSaving(false);
    };

    if (loading)
        return (
            <div className="p-6 rounded-2xl shadow-lg bg-white animate-pulse">
                {/* Skeleton for heading */}
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>

                <div className="flex flex-col md:flex-row items-center gap-6">
                    {/* Skeleton for input */}
                    <div className="w-full md:w-1/2">
                        <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                    {/* Skeleton for button */}
                    <div className="h-10 bg-gray-200 rounded w-24"></div>
                </div>
            </div>
        );

    return (
        <div className="p-6 rounded-2xl shadow-lg bg-white">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Set Monthly Income</h2>
            <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative w-full md:w-1/2">
                    <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">$</span>
                    <input
                        type="number"
                        value={income}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        placeholder="Enter income"
                    />
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transition font-semibold"
                >
                    {saving ? "Saving..." : "Save"}
                </button>
            </div>
        </div>
    );
}
