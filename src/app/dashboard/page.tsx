"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Spinner from "@/components/ui/spinner"
import { getCategories } from "@/app/actions/getCategories";
import { getBudgetForMonth } from "@/app/actions/getBudget";
import CategoryTracker from "@/components/categoryTracker";
import { MonthYearPicker } from "@/components/datePicker";
import { Button } from "@/components/ui/button";
import { AddTransactionDialog } from "@/components/transaction/addTransaction";
import {createBudget} from "@/app/actions/create/createBudget";
import Income from "@/components/budget/budgetIncome"
import { Capacitor } from "@capacitor/core";
import MobileBottomBar from "@/components/mobile/mobileBottomBar";
import Transactions from "@/components/transaction/transactions";
import {useTheme} from "next-themes";

interface Transaction {
    referencecode: string;
    description: string;
    amount: number;
    transaction_date: string;
    category_code: string;
    is_recurring: boolean;
}

function isNativeMobileApp(): boolean {
    return Capacitor.isNativePlatform();
}

function getPlatform() {
    return Capacitor.getPlatform();
}

console.log(isNativeMobileApp());
console.log(getPlatform());


export default function BudgetDashboard() {
    const {data: session, status} = useSession();
    const router = useRouter();
    const { theme } = useTheme();

    const [categories, setCategories] = useState<{referencecode: string; type: string}[]>([]);
    const [budgetCode, setBudgetCode] = useState<string | null>(null);
    const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [isBudgetLoading, setIsBudgetLoading] = useState<boolean>(false);
    const [trackerReloads, setTrackerReloads] = useState<{ [key: string]: boolean }>({});
    const [open, setOpen] = useState(false);
    const [transactionsReload, setTransactionsReload] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin");
        }
    }, [status, router]);

    useEffect(() => {
        async function fetchCategories() {
            const data = await getCategories();
            setCategories(data);
            const initialReloads: { [key: string]: boolean } = {};
            data.forEach((cat: { referencecode: string }) => {
                initialReloads[cat.referencecode] = false;
            });
            setTrackerReloads(initialReloads);
        }

        fetchCategories().then();
    }, []);

    useEffect(() => {
        async function fetchBudget() {
            if (session?.user) {
                setIsBudgetLoading(true);
                const data = await getBudgetForMonth(session.user.id, year, month);
                setBudgetCode(data ? data.referencecode : "");
                setIsBudgetLoading(false);
            }
        }

        fetchBudget().then();
    }, [year, month, session]);

    function getColor(category_code: string) {
        switch (category_code) {
            case "CAT2025022222030415": //NEEDS
                return theme === "dark" ? "#243642" : "rgb(219, 234, 254)";
            case "CAT20250222220304D1": //WANTS
                return theme === "dark" ? "#387478" : "rgb(254, 249, 195)";
            case "CAT202502222203044D": //SAVINGS
                return theme === "dark" ? "#629584" : "rgb(220, 252, 231)";
            default:
                return "#FFFFFF";
        }
    }

    const handleCreate = async () => {
        const budgetCode = await createBudget(session ? session.user.id : 0, year, month)
        setBudgetCode(budgetCode ? budgetCode.referencecode : "");
    }

    const refreshCategoryTrackerAction = (categoryCode: string) => {
        setTrackerReloads((prev) => ({
            ...prev,
            [categoryCode]: !prev[categoryCode],
        }));
    };

    const handleMonthYearChange = (newMonth: number, newYear: number) => {
        setMonth(newMonth);
        setYear(newYear);
    };


    if (!session) return null;

    return (
        <div className="mx-auto max-w-7xl px-4 w-full flex flex-col">

            <div className={`w-full md:inline-flex md:justify-between`}>

                    <MonthYearPicker
                        month={month}
                        year={year}
                        onChangeAction={handleMonthYearChange}
                    />

                    {isBudgetLoading || !budgetCode ? ("") : (
                        <Income
                            userid={session.user.id}
                            month={month}
                            year={year}
                        />
                    )}


            </div>


            {isBudgetLoading ? (
                <Spinner />
            ) : !budgetCode ? (
                <div className={`w-full text-center`}>
                    <p className={`pb-2`}>No budget code found.</p>
                    <Button className={`dark:bg-[#18181b]`} variant="outline" onClick={handleCreate}>Create</Button>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-3 md:grid-cols-3 p-2">

                        {categories.map((cat) => {
                            return (
                                <div key={cat.referencecode} className="flex flex-col">
                                    <CategoryTracker
                                        category={cat.referencecode}
                                        userId={session.user.id}
                                        year={year}
                                        month={month}
                                        color={getColor(cat.referencecode)}
                                        reload={trackerReloads[cat.referencecode]}
                                    />

                                    <div className="hidden w-full sm:flex">
                                        <Transactions
                                            userId={session.user.id}
                                            year={year}
                                            month={month}
                                            category_code={cat.referencecode}
                                            color={getColor(cat.referencecode)}
                                            reload={transactionsReload}
                                        />
                                    </div>
                                </div>
                            );
                        })}

                    </div>

                    <div className={`flex flex-col w-full sm:hidden`}>
                        <div className={`px-6 text-gray-500`}>
                            Expenses:
                        </div>
                        <Transactions
                            userId={session.user.id}
                            year={year}
                            month={month}
                            category_code={""}
                            color={""}
                            reload={transactionsReload}
                        />
                    </div>

                </>


            )}

            {open && (
                <AddTransactionDialog
                    userId={session.user.id}
                    budgetCode={budgetCode!}
                    categories={categories}
                    onCloseAction={(addedTransaction? : Transaction) => {
                        setOpen(false);
                        if (addedTransaction) {
                            refreshCategoryTrackerAction(addedTransaction.category_code);
                            setTransactionsReload(prev => !prev);
                        }
                    }}

                />
            )}

            <div className={`h-[60px]`}></div>
            <MobileBottomBar onCreate={() => setOpen(true)} session={session} />

        </div>
    );
}
