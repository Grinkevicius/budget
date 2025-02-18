"use client";

import { useEffect, useState } from "react";
import { getUserIncome, updateUserIncome } from "@/app/actions/income_actions";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export default function IncomeSetter({ userId, year, month }) {
    const [income, setIncome] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function fetchIncome() {
            const incomeAmount = await getUserIncome(userId, year, month);
            if (incomeAmount !== null) setIncome(incomeAmount);
            setLoading(false);
        }
        fetchIncome();
    }, [userId, year, month]);

    const showToast = (message, type) => {
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

    const handleChange = (e) => {
        const value = parseFloat(e.target.value);
        if (value < 0) {
            showToast("Income cannot be negative!", "warning");
            return;
        }
        setIncome(value || "");
    };

    const handleSave = async () => {
        if (income === "" || isNaN(income) || income < 0) {
            showToast("Please enter a valid income!", "error");
            return;
        }

        setSaving(true);
        const response = await updateUserIncome(userId, year, month, income);

        if (response.error) {
            showToast("Failed to update income!", "error");
        } else {
            showToast("Income updated successfully!", "success");
        }

        setSaving(false);
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="p-6 rounded-2xl shadow-lg bg-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Set Monthly Income</h2>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-1/2">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                        type="number"
                        value={income}
                        onChange={handleChange}
                        className="w-full pl-7 pr-4 py-2 border rounded-lg text-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter income"
                    />
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition font-semibold"
                >
                    {saving ? "Saving..." : "Save"}
                </button>
            </div>
        </div>
    );
}
