'use client';

import React, { useState } from 'react';
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { clearBudgets } from "@/actions/admin/clearBudgets";
import { useAlert } from '@/contexts/AlertContext';

export default function AdminPage() {
    const { data: session } = useSession();
    const { showAlert } = useAlert();
    const [isClearing, setIsClearing] = useState(false);

    if (!session) return null;

    const handleClearBudgets = async () => {
        if (!confirm('Are you sure you want to clear ALL budgets? This action cannot be undone!')) {
            return;
        }

        setIsClearing(true);
        try {
            const result = await clearBudgets();
            
            if (result.success) {
                showAlert({
                    type: 'success',
                    title: 'Success',
                    description: 'All budgets have been cleared successfully!'
                });
            } else {
                showAlert({
                    type: 'error',
                    title: 'Error',
                    description: result.error || 'Failed to clear budgets'
                });
            }
        } catch {
            showAlert({
                type: 'error',
                title: 'Error',
                description: 'An unexpected error occurred'
            });
        } finally {
            setIsClearing(false);
        }
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-6">
            <h1 className="text-2xl font-semibold text-sidebar-foreground mb-4">Admin Panel</h1>
            <p className="text-sidebar-muted-foreground mb-8">
                Administrative actions for development and testing
            </p>

            <div className="space-y-6">
                <div className="border border-red-200 rounded-lg p-6 bg-red-50 dark:bg-red-950/20 dark:border-red-800">
                    <h2 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">
                        Danger Zone
                    </h2>
                    <p className="text-sm text-red-600 dark:text-red-300 mb-4">
                        These actions are irreversible and will permanently delete data.
                    </p>
                    
                    <Button
                        onClick={handleClearBudgets}
                        disabled={isClearing}
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {isClearing ? "Clearing..." : "Clear All Budgets"}
                    </Button>
                </div>
            </div>
        </div>
    );
}