"use client";

import { useState } from "react";
import { addTransaction } from "@/app/actions/addTransaction";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

interface TransactionInputProps {
    userId: string;
    budgetCode: string;
    categories: { referencecode: string; type: string }[]; // Pass available categories
    refreshTransactions: () => void; // Function to refresh the UI
}

export default function TransactionInput({ userId, budgetCode, categories, refreshTransactions }: TransactionInputProps) {
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState(categories.length ? categories[0].referencecode : "");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [loading, setLoading] = useState(false);

    const showToast = (message: string, type: "success" | "error") => {
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!description || !amount || !category) {
            showToast("Please fill in all fields", "error");
            return;
        }

        setLoading(true);
        console.log(budgetCode);
        const response = await addTransaction(userId, budgetCode, category, description, Number(amount), date);
        setLoading(false);

        if (response?.error) {
            showToast("Failed to add transaction", "error");
        } else {
            showToast("Transaction added successfully!", "success");
            setDescription("");
            setAmount("");
            refreshTransactions(); // Refresh transactions list
        }
    };

    return (
        <div className="p-6 rounded-2xl shadow-lg bg-white text-gray-800">
            <h2 className="text-lg font-semibold mb-4">Add Transaction</h2>
            <form onSubmit={handleSubmit} className="grid gap-4">
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                />
                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                />
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                >
                    {categories.map((c) => (
                        <option key={c.referencecode} value={c.referencecode}>
                            {c.type}
                        </option>
                    ))}
                </select>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    {loading ? "Saving..." : "Add Transaction"}
                </button>
            </form>
        </div>
    );
}
