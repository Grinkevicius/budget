"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useAlert } from '@/contexts/AlertContext';

// Components
import Spinner from "@/components/ui/spinner";
import CategoryTracker from "@/components/categoryTracker";
import { MonthYearPicker } from "@/components/datePicker";
import { Button } from "@/components/ui/button";
import { AddTransactionDialog } from "@/components/transaction/addTransaction";
import Income from "@/components/budget/budgetIncome";
import MobileBottomBar from "@/components/mobile/mobileBottomBar";
import Transactions from "@/components/transaction/transactions";

// Actions & Types
import { getCategories } from "@/actions/getCategories";
import { createBudget } from "@/actions/create/createBudget";
import {clearTransactions, Transaction} from "@/store/transactionsSlice";

// Add this import
import { getBudgetForMonth } from "@/actions/getBudget";
import {useAppDispatch} from "@/store/hooks";
import {PlusCircle} from "lucide-react";

// Types
interface Category {
    referencecode: string;
    type: string;
}

interface DashboardState {
    categories: Category[];
    budgetCode: string | null;
    isBudgetLoading: boolean;
    isCategoriesLoading: boolean;
    trackerReloads: Record<string, boolean>;
    categoryReloads: Record<string, boolean>;
    isAddTransactionOpen: boolean;
    isFetchingBudget: boolean;
    error: string | null;
}

interface CategoryListProps {
    categories: Category[];
    userId: string;
    year: number;
    month: number;
    trackerReloads: Record<string, boolean>;
    categoryReloads: Record<string, boolean>;
    getColor: (category_code: string) => string;
}

const CategoryList: React.FC<CategoryListProps> = memo(({
    categories,
    userId,
    year,
    month,
    trackerReloads,
    categoryReloads,
    getColor
}) => (
    <div className="grid grid-cols-3 md:grid-cols-3 p-2">
        {categories.map((cat) => (
            <div key={cat.referencecode} className="flex flex-col">
                <CategoryTracker
                    category={cat.referencecode}
                    userId={userId}
                    year={year}
                    month={month}
                    color={getColor(cat.referencecode)}
                    reload={trackerReloads[cat.referencecode]}
                />
                <div className="hidden w-full sm:flex">
                    <Transactions
                        userId={userId}
                        year={year}
                        month={month}
                        category_code={cat.referencecode}
                        color={getColor(cat.referencecode)}
                        reload={categoryReloads[cat.referencecode]}
                    />
                </div>
            </div>
        ))}
    </div>
));

CategoryList.displayName = 'CategoryList';

const MobileTransactions = memo(({ userId, year, month, reload }: {
    userId: string;
    year: number;
    month: number;
    reload?: boolean;
}) => (
    <div className="flex flex-col w-full sm:hidden">
        <div className="px-6 text-gray-500">Expenses:</div>
        <Transactions
            userId={userId}
            year={year}
            month={month}
            category_code=""
            color=""
            reload={reload}
        />
    </div>
));

MobileTransactions.displayName = 'MobileTransactions';

const BudgetDashboard: React.FC = () => {
    const { showAlert } = useAlert();
    const dispatch = useAppDispatch();
    const { data: session, status } = useSession();
    const router = useRouter();

    const [currentDate, setCurrentDate] = useState({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
    });

    const [state, setState] = useState<DashboardState>({
        categories: [],
        budgetCode: null,
        isBudgetLoading: false,
        isCategoriesLoading: true,
        trackerReloads: {},
        categoryReloads: {},
        isAddTransactionOpen: false,
        isFetchingBudget: false,
        error: null,
    });

    const getColor = useCallback((category_code: string): string => {
        // Use CSS custom properties instead of theme hook to avoid hydration issues
        const colors = {
            "CAT2025022222030415": "rgb(219, 234, 254)", // Light blue for NEEDS
            "CAT20250222220304D1": "rgb(254, 249, 195)", // Light yellow for WANTS  
            "CAT202502222203044D": "rgb(220, 252, 231)", // Light green for SAVINGS
        };
        return colors[category_code as keyof typeof colors] || "#FFFFFF";
    }, []);

    const handleMonthYearChange = useCallback((month: number, year: number) => {
        dispatch(clearTransactions());
        setCurrentDate({ month, year });
    }, [dispatch]);


    const handleCreateBudget = useCallback(async () => {
        if (!session?.user?.id) return;

        setState(prev => ({ ...prev, isBudgetLoading: true, error: null }));
        try {
            const result = await createBudget(
                session.user.id,
                currentDate.year,
                currentDate.month
            );
            
            if (result?.referencecode) {
                setState(prev => ({
                    ...prev,
                    budgetCode: result.referencecode,
                    isBudgetLoading: false,
                    error: null,
                }));
                showAlert({
                    type: 'success',
                    title: 'Success',
                    description: 'Budget created successfully'
                });
            } else {
                throw new Error('No budget reference code returned');
            }
        } catch (error) {
            console.error("Failed to create budget:", error);
            setState(prev => ({
                ...prev,
                isBudgetLoading: false,
                error: 'Failed to create budget'
            }));
            showAlert({
                type: 'error',
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to create budget'
            });
        }
    }, [session?.user?.id, currentDate.year, currentDate.month, showAlert]);

    useEffect(() => {
        async function fetchBudget() {
            if (!session?.user?.id) return;

            setState(prev => ({ ...prev, isFetchingBudget: true, error: null }));
            try {
                const data = await getBudgetForMonth(
                    session.user.id,
                    currentDate.year,
                    currentDate.month
                );
                
                setState(prev => ({
                    ...prev,
                    budgetCode: data ? data.referencecode : null,
                    isFetchingBudget: false,
                    error: null,
                }));
            } catch (error) {
                console.error('Failed to fetch budget:', error);
                setState(prev => ({
                    ...prev,
                    isFetchingBudget: false,
                    error: 'Failed to load budget data'
                }));
                showAlert({
                    type: 'error',
                    title: 'Error',
                    description: error instanceof Error ? error.message : 'Failed to fetch budget data'
                });
            }
        }

        fetchBudget();
    }, [currentDate.year, currentDate.month, session?.user?.id, showAlert]);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin");
        }
    }, [status, router]);

    useEffect(() => {
        async function fetchCategories() {
            if (!session?.user) return;
            
            setState(prev => ({ ...prev, isCategoriesLoading: true, error: null }));
            try {
                const data = await getCategories();
                const initialReloads = data.reduce((acc, cat) => ({
                    ...acc,
                    [cat.referencecode]: false
                }), {});

                setState(prev => ({
                    ...prev,
                    categories: data,
                    trackerReloads: initialReloads,
                    categoryReloads: initialReloads,
                    isCategoriesLoading: false,
                    error: null,
                }));
            } catch (error) {
                console.error("Failed to fetch categories:", error);
                setState(prev => ({
                    ...prev,
                    isCategoriesLoading: false,
                    error: 'Failed to load categories'
                }));
                showAlert({
                    type: 'error',
                    title: 'Error',
                    description: 'Failed to load categories'
                });
            }
        }

        fetchCategories();
    }, [session?.user, showAlert]);

    const handleIncomeChange = useCallback(() => {
        setState(prev => ({
            ...prev,
            trackerReloads: Object.keys(prev.trackerReloads).reduce((acc, key) => ({
                ...acc,
                [key]: !prev.trackerReloads[key]
            }), {})
        }));
    }, []);

    if (!session) return null;

    // Show error state
    if (state.error) {
        return (
            <div className="mx-auto max-w-7xl px-4 w-full flex flex-col items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{state.error}</p>
                    <Button onClick={() => window.location.reload()}>
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    // Show loading state for initial load
    if (state.isCategoriesLoading || (state.isFetchingBudget && !state.budgetCode)) {
        return (
            <div className="mx-auto max-w-7xl px-4 w-full flex flex-col">
                <div className="w-full md:inline-flex md:justify-between mb-6">
                    <MonthYearPicker
                        month={currentDate.month}
                        year={currentDate.year}
                        onChangeAction={handleMonthYearChange}
                    />
                </div>
                <Spinner size="lg" className="min-h-[300px]" />
            </div>
        );
    }

    return (
        <>
            <div className="mx-auto max-w-7xl px-4 w-full flex flex-col">
                <div className="w-full md:inline-flex md:justify-between">
                    <MonthYearPicker
                        month={currentDate.month}
                        year={currentDate.year}
                        onChangeAction={handleMonthYearChange}
                    />

                    {state.budgetCode && !state.isFetchingBudget && (
                        <Income
                            userid={session.user.id}
                            month={currentDate.month}
                            year={currentDate.year}
                            onIncomeChange={handleIncomeChange}
                        />
                    )}
                </div>

                {state.isBudgetLoading ? (
                    <Spinner size="md" className="min-h-[200px]" />
                ) : !state.budgetCode ? (
                    <div className="w-full text-center py-12">
                        <p className="pb-4 text-gray-600 dark:text-gray-400">No budget found for this month.</p>
                        <Button
                            className="dark:bg-[#18181b]"
                            variant="outline"
                            onClick={handleCreateBudget}
                            disabled={state.isBudgetLoading}
                        >
                            {state.isBudgetLoading ? 'Creating...' : 'Create Budget'}
                        </Button>
                    </div>
                ) : (
                    <>
                        <CategoryList
                            categories={state.categories}
                            userId={session.user.id}
                            year={currentDate.year}
                            month={currentDate.month}
                            trackerReloads={state.trackerReloads}
                            categoryReloads={state.categoryReloads}
                            getColor={getColor}
                        />

                        {/* Mobile View */}
                        <MobileTransactions
                            userId={session.user.id}
                            year={currentDate.year}
                            month={currentDate.month}
                            reload={state.categoryReloads['all']}
                        />
                    </>
                )}

                {state.isAddTransactionOpen && (
                    <AddTransactionDialog
                        userId={session.user.id}
                        budgetCode={state.budgetCode!}
                        categories={state.categories}
                        onCloseAction={(transaction?: Transaction) => {
                            setState(prev => ({ ...prev, isAddTransactionOpen: false }));
                            if (transaction) {
                                setState(prev => ({
                                    ...prev,
                                    trackerReloads: {
                                        ...prev.trackerReloads,
                                        [transaction.category_code]: !prev.trackerReloads[transaction.category_code],
                                    },
                                }));
                            }
                        }}
                    />
                )}

                <div className="flex justify-end p-2">
                    <button
                        onClick={() => setState(prev => ({ ...prev, isAddTransactionOpen: true }))}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                        aria-label="Add new transaction"
                    >
                        <PlusCircle className="w-6 h-6" />
                    </button>
                </div>


                <div className="h-[60px]" />
                <MobileBottomBar
                    onCreate={() => setState(prev => ({ ...prev, isAddTransactionOpen: true }))}
                    session={session}
                />
            </div>
        </>
    );
};

export default memo(BudgetDashboard);