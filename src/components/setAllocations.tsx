"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { getSpendingAllocation, updateSpendingAllocation } from "@/actions/settings_allocations";
import { useAlert } from '@/contexts/AlertContext';

interface Allocation {
    savings: number;
    needs: number;
    wants: number;
}

interface SettingsAllocationProps {
    userId: string;
}

export default function SettingsAllocation({ userId }: SettingsAllocationProps) {
    const { showAlert } = useAlert();
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
                    showAlert({
                        type: 'info',
                        title: 'No Data Found',
                        description: 'No allocation data found. Set your allocation!'
                    });
                }
            } catch {
                showAlert({
                    type: 'error',
                    title: 'Loading Error',
                    description: 'Error loading allocation data. Please try again.'
                });
            }
            setLoading(false);
        }
        fetchAllocation();
    }, [userId, showAlert]);



    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newValue = parseFloat(value) || 0;
        const newAllocation = { ...allocation, [name]: newValue };
        const totalPercentage = Number(newAllocation.savings) + Number(newAllocation.needs) + Number(newAllocation.wants);
        if (totalPercentage > 100) {
            showAlert({
                type: 'error',
                title: 'Invalid Allocation',
                description: 'Total allocation cannot exceed 100%'
            });
            return;
        }

        setAllocation(newAllocation);
    };

    const handleSave = async () => {
        const total = Number(allocation.savings) + Number(allocation.needs) + Number(allocation.wants);
        if (total !== 100) {
            showAlert({
                type: 'error',
                title: 'Invalid Total',
                description: 'Total allocation must be exactly 100%'
            });
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
            showAlert({
                type: 'error',
                title: 'Update Failed',
                description: 'Failed to update allocation. Please try again.'
            });
        } else {
            showAlert({
                type: 'success',
                title: 'Success',
                description: 'Allocation updated successfully!'
            });
        }

        setSaving(false);
    };

    if (loading) {
        return (
            <div className="animate-pulse space-y-6">
                <div className="flex justify-between items-center">
                    <div className="h-4 bg-muted rounded w-1/3"></div>
                    <div className="h-6 bg-muted rounded w-16"></div>
                </div>
                <div className="h-3 bg-muted rounded-full"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-3">
                            <div className="h-4 bg-muted rounded w-1/2"></div>
                            <div className="h-12 bg-muted rounded-xl"></div>
                        </div>
                    ))}
                </div>
                <div className="h-12 bg-muted rounded-xl w-40"></div>
            </div>
        );
    }

    const totalPercentage = Number(allocation.savings) + Number(allocation.needs) + Number(allocation.wants);

    return (
        <div className="space-y-6">
            {/* Progress indicator */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-foreground">Total Allocation</span>
                    <span className={`text-xl font-bold ${
                        totalPercentage === 100 ? 'text-green-500' : 
                        totalPercentage > 100 ? 'text-red-500' : 
                        'text-orange-500'
                    }`}>
                        {totalPercentage}%
                    </span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                    <div 
                        className={`h-3 rounded-full transition-all duration-500 ${
                            totalPercentage === 100 ? 'bg-green-500' : 
                            totalPercentage > 100 ? 'bg-red-500' : 
                            'bg-orange-500'
                        }`}
                        style={{ width: `${Math.min(totalPercentage, 100)}%` }}
                    ></div>
                </div>
                {totalPercentage !== 100 && (
                    <p className="text-xs text-muted-foreground">
                        {totalPercentage > 100 ? 'Total exceeds 100%' : `${100 - totalPercentage}% remaining to reach 100%`}
                    </p>
                )}
            </div>

            {/* Allocation inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { 
                        title: "Savings", 
                        key: "savings", 
                        description: "Emergency fund & investments",
                        color: "emerald"
                    },
                    { 
                        title: "Needs", 
                        key: "needs", 
                        description: "Rent, utilities, groceries",
                        color: "blue"
                    },
                    { 
                        title: "Wants", 
                        key: "wants", 
                        description: "Entertainment & hobbies",
                        color: "amber"
                    },
                ].map((item) => (
                    <div key={item.key} className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">
                                {item.title}
                            </label>
                            <p className="text-xs text-muted-foreground">
                                {item.description}
                            </p>
                        </div>
                        <div className="relative">
                            <input
                                type="number"
                                name={item.key}
                                value={allocation[item.key as keyof Allocation]}
                                onChange={handleChange}
                                min="0"
                                max="100"
                                step="1"
                                className={`w-full pr-12 pl-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-lg font-semibold text-center ${
                                    item.color === 'emerald' ? 'focus:ring-emerald-500' :
                                    item.color === 'blue' ? 'focus:ring-blue-500' :
                                    'focus:ring-amber-500'
                                }`}
                                placeholder="0"
                            />
                            <span className="absolute inset-y-0 right-4 flex items-center text-muted-foreground text-sm font-medium">
                                %
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
                <button
                    onClick={handleSave}
                    disabled={saving || totalPercentage !== 100}
                    className="w-full sm:w-auto bg-primary text-primary-foreground px-8 py-3 rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-sm hover:shadow-md"
                >
                    {saving ? "Updating..." : "Save Allocations"}
                </button>
                {totalPercentage !== 100 && (
                    <p className="text-sm text-muted-foreground self-center">
                        Allocations must total exactly 100% to save
                    </p>
                )}
            </div>
        </div>
    );
}
