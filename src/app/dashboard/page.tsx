"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useAlert } from '@/contexts/AlertContext';

// Components - Lazy load heavy components
import Spinner from "@/components/ui/spinner";
import { MonthYearPicker } from "@/components/datePicker";
import { Button } from "@/components/ui/button";
import MobileBottomBar from "@/components/mobile/mobileBottomBar";

// Lazy load heavy components
import dynamic from 'next/dynamic';

const CategoryTracker = dynamic(() => import("@/components/categoryTracker"), {
    loading: () => <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
});

const AddTransactionDialog = dynamic(() => import("@/components/transaction/addTransaction").then(mod => ({ default: mod.AddTransactionDialog })), {
    ssr: false
});

const Income = dynamic(() => import("@/components/budget/budgetIncome"), {
    loading: () => <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
});

const Transactions = dynamic(() => import("@/components/transaction/transactions"), {
    loading: () => <div className="h-24 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
});

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
    isDateChanging: boolean;
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
    const { theme } = useTheme();

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
        isDateChanging: false,
        error: null,
    });

    const getColor = useCallback((category_code: string): string => {
        const colors = {
            "CAT2025022222030415": theme === "dark" ? "#243642" : "rgb(219, 234, 254)",
            "CAT20250222220304D1": theme === "dark" ? "#387478" : "rgb(254, 249, 195)",
            "CAT202502222203044D": theme === "dark" ? "#629584" : "rgb(220, 252, 231)",
        };
        return colors[category_code as keyof typeof colors] || (theme === "dark" ? "#374151" : "#FFFFFF");
    }, [theme]);

    const handleMonthYearChange = useCallback((month: number, year: number) => {
        // Immediately show loading state and clear old data
        setState(prev => ({ 
            ...prev, 
            isDateChanging: true,
            budgetCode: null,
            error: null
        }));
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
                    isDateChanging: false,
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
                isDateChanging: false,
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
            // Don't fetch if session is still loading or user not available
            if (status === "loading" || !session?.user?.id) return;

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
                    isDateChanging: false,
                    error: null,
                }));
            } catch (error) {
                console.error('Failed to fetch budget:', error);
                setState(prev => ({
                    ...prev,
                    isFetchingBudget: false,
                    isDateChanging: false,
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
    }, [currentDate.year, currentDate.month, session?.user?.id, status, showAlert]);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin");
        }
    }, [status, router]);

    useEffect(() => {
        async function fetchCategories() {
            // Don't fetch if session is still loading or user not available
            if (status === "loading" || !session?.user) return;
            
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
    }, [session?.user, status, showAlert]);

    const handleIncomeChange = useCallback(() => {
        setState(prev => ({
            ...prev,
            trackerReloads: Object.keys(prev.trackerReloads).reduce((acc, key) => ({
                ...acc,
                [key]: !prev.trackerReloads[key]
            }), {})
        }));
    }, []);

    // Handle session loading state
    if (status === "loading") {
        return (
            <div className="mx-auto max-w-7xl px-4 w-full flex flex-col">
                <Spinner size="lg" className="min-h-[300px]" text="Loading session..." />
            </div>
        );
    }

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

    // Show loading state for initial load or date changes
    if (state.isCategoriesLoading || state.isDateChanging || (state.isFetchingBudget && !state.budgetCode)) {
        return (
            <div className="mx-auto max-w-7xl px-4 w-full flex flex-col">
                <div className="w-full md:inline-flex md:justify-between mb-6">
                    <MonthYearPicker
                        month={currentDate.month}
                        year={currentDate.year}
                        onChangeAction={handleMonthYearChange}
                    />
                </div>
                <Spinner size="lg" className="min-h-[300px]" text={
                    state.isDateChanging ? "Loading budget data..." : 
                    state.isCategoriesLoading ? "Loading categories..." : 
                    "Loading..."
                } />
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