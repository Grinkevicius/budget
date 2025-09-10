"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { getUserIncome, updateUserIncome } from "@/actions/income_actions";
import { useAlert } from '@/contexts/AlertContext';

interface IncomeSetterProps {
    userId: string;
}

export default function IncomeSetter({ userId }: IncomeSetterProps) {
    const { showAlert } = useAlert();
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



    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        if (value < 0) {
            showAlert({
                type: 'error',
                title: 'Invalid Input',
                description: 'Income cannot be negative!'
            });
            return;
        }
        setIncome(isNaN(value) ? "" : value);
    };

    const handleSave = async () => {
        if (income === "" || isNaN(Number(income)) || Number(income) < 0) {
            showAlert({
                type: 'error',
                title: 'Invalid Income',
                description: 'Please enter a valid income amount!'
            });
            return;
        }

        setSaving(true);
        const response = await updateUserIncome(userId, Number(income));

        if (response.error) {
            showAlert({
                type: 'error',
                title: 'Update Failed',
                description: 'Failed to update income. Please try again.'
            });
        } else {
            showAlert({
                type: 'success',
                title: 'Success',
                description: 'Income updated successfully!'
            });
        }
        setSaving(false);
    };

    if (loading)
        return (
            <div className="animate-pulse">
                <div className="flex flex-col sm:flex-row items-end gap-4">
                    <div className="w-full sm:flex-1">
                        <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                        <div className="h-12 bg-muted rounded-lg"></div>
                    </div>
                    <div className="h-12 bg-muted rounded-lg w-24"></div>
                </div>
            </div>
        );

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-end gap-4">
                <div className="relative w-full sm:flex-1">
                    <label className="block text-sm font-medium text-foreground mb-3">
                        Default Monthly Income
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-4 flex items-center text-muted-foreground text-lg font-semibold">$</span>
                        <input
                            type="number"
                            value={income}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-lg font-medium"
                            placeholder="5000"
                            min="0"
                            step="0.01"
                        />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        This will be automatically added to new budgets
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full sm:w-auto bg-primary text-primary-foreground px-8 py-3 rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-sm hover:shadow-md"
                >
                    {saving ? "Saving..." : "Save Income"}
                </button>
            </div>
        </div>
    );
}
