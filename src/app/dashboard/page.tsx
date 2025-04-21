"use client";

import React, { useState, useEffect, useCallback, memo, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
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
    trackerReloads: Record<string, boolean>;
    categoryReloads: Record<string, boolean>;
    isAddTransactionOpen: boolean;
    isFetchingBudget: boolean; // Added this state
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
    const { theme } = useTheme();

    const [currentDate, setCurrentDate] = useState({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
    });

    const [state, setState] = useState<DashboardState>({
        categories: [],
        budgetCode: null,
        isBudgetLoading: false,
        trackerReloads: {},
        categoryReloads: {},
        isAddTransactionOpen: false,
        isFetchingBudget: false,
    });

    const getColor = useCallback((category_code: string): string => {
        const colors = {
            "CAT2025022222030415": theme === "dark" ? "#243642" : "rgb(219, 234, 254)",
            "CAT20250222220304D1": theme === "dark" ? "#387478" : "rgb(254, 249, 195)",
            "CAT202502222203044D": theme === "dark" ? "#629584" : "rgb(220, 252, 231)",
        };
        return colors[category_code as keyof typeof colors] || "#FFFFFF";
    }, [theme]);

    const handleMonthYearChange = useCallback((month: number, year: number) => {
        dispatch(clearTransactions());
        setCurrentDate({ month, year });
    }, [dispatch]);


    const handleCreateBudget = useCallback(async () => {
        if (!session?.user?.id) return;

        setState(prev => ({ ...prev, isBudgetLoading: true }));
        try {
            const result = await createBudget(
                session.user.id,
                currentDate.year,
                currentDate.month
            );
            setState(prev => ({
                ...prev,
                budgetCode: result?.referencecode || null,
            }));
        } catch (error) {
            console.error("Failed to create budget:", error);
            showAlert({
                type: 'error',
                title: 'Error',
                description: 'Something went wrong'
            });

        } finally {
            showAlert({
                type: 'success',
                title: 'Success',
                description: 'Operation completed successfully'
            });


            setState(prev => ({ ...prev, isBudgetLoading: false }));
        }
    }, [session?.user?.id, currentDate.year, currentDate.month]);

    useEffect(() => {
        async function fetchBudget() {
            if (!session?.user?.id) return;

            setState(prev => ({ ...prev, isFetchingBudget: true }));
            try {
                const data = await getBudgetForMonth(
                    session.user.id,
                    currentDate.year,
                    currentDate.month
                );
                setState(prev => ({
                    ...prev,
                    budgetCode: data ? data.referencecode : null,
                }));
            } catch (error) {
                console.error('Failed to fetch budget:', error);
                // Add toast notification here
            } finally {
                setState(prev => ({ ...prev, isFetchingBudget: false }));
            }
        }

        fetchBudget();
    }, [currentDate.year, currentDate.month, session?.user?.id]);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin");
        }
    }, [status, router]);

    useEffect(() => {
        async function fetchCategories() {
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
                }));
            } catch (error) {
                console.error("Failed to fetch categories:", error);
                // Add toast notification here
            }
        }

        if (session?.user) {
            fetchCategories();
        }
    }, [session]);

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

    return (
        <>
            <div className="mx-auto max-w-7xl px-4 w-full flex flex-col">
                <div className="w-full md:inline-flex md:justify-between">
                    <MonthYearPicker
                        month={currentDate.month}
                        year={currentDate.year}
                        onChangeAction={handleMonthYearChange}
                    />

                    <Suspense fallback={<Spinner />}>
                        {!state.isFetchingBudget && !state.isBudgetLoading && state.budgetCode && (
                            <Income
                                userid={session.user.id}
                                month={currentDate.month}
                                year={currentDate.year}
                                onIncomeChange={handleIncomeChange}
                            />
                        )}
                    </Suspense>
                </div>

                {state.isFetchingBudget || state.isBudgetLoading ? (
                    <Spinner />
                ) : !state.budgetCode ? (
                    <div className="w-full text-center">
                        <p className="pb-2">No budget code found.</p>
                        <Button
                            className="dark:bg-[#18181b]"
                            variant="outline"
                            onClick={handleCreateBudget}
                        >
                            Create
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

                <div  className="flex justify-end p-2">
                    <PlusCircle onClick={() => setState(prev => ({ ...prev, isAddTransactionOpen: true })) } className="w-6 h-6 cursor-pointer" />
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