"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/navbar";
import Spinner from "@/components/ui/spinner"
import { getCategories } from "@/app/actions/getCategories";
import { getBudgetForMonth } from "@/app/actions/getBudget";
import TransactionColumn from "@/components/TransactionColumn";
import CategoryTracker from "@/components/categoryTracker";
import { MonthYearPicker } from "@/components/datePicker";
import { Button } from "@/components/ui/button";
import { AddTransactionDialog } from "@/components/addTransaction";
import {createBudget} from "@/app/actions/create/createBudget";
import Income from "@/components/budget/budgetIncome"
import { Capacitor } from "@capacitor/core";
import MobileBottomBar from "@/components/mobileBottomBar";
import Transactions from "@/components/transaction/mobileColumn";

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

    const [categories, setCategories] = useState<{
        color: string;
        referencecode: string;
        type: string
    }[]>([]);

    const [budgetCode, setBudgetCode] = useState<string | null>(null);
    const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [isBudgetLoading, setIsBudgetLoading] = useState<boolean>(false);
    const [trackerReloads, setTrackerReloads] = useState<{ [key: string]: boolean }>({});
    const [open, setOpen] = useState(false);
    const [newTransaction, setNewTransaction] = useState<Transaction | null>(null);

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

        fetchCategories();
    }, []);

    //GET BUDGET
    useEffect(() => {
        async function fetchBudget() {
            if (session?.user) {
                setIsBudgetLoading(true);
                const data = await getBudgetForMonth(session.user.id, year, month);
                setBudgetCode(data ? data.referencecode : "");
                setIsBudgetLoading(false);
            }
        }

        fetchBudget();
    }, [session, year, month]);

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
        <>
            <Header/>

            <div className={`w-full md:inline-flex`}>
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
                <>
                    <p>No budget code found.</p>
                    <Button variant="outline" onClick={handleCreate}>Create</Button>
                </>
            ) : (
                <>
                    <div className="grid grid-cols-3 md:grid-cols-3 p-2">

                        {categories.map((cat) => (

                            <div key={cat.referencecode} className="flex flex-col">

                                <CategoryTracker
                                    category={cat.referencecode}
                                    userId={session.user.id}
                                    year={year}
                                    month={month}
                                    color={cat.color}
                                    reload={trackerReloads[cat.referencecode]}
                                />

                                {/*<TransactionColumn*/}
                                {/*    userId={session.user.id}*/}
                                {/*    year={year}*/}
                                {/*    month={month}*/}
                                {/*    category={cat.referencecode}*/}
                                {/*    refreshCategoryTrackerAction={() => refreshCategoryTrackerAction(cat.referencecode)}*/}
                                {/*    newTransaction={*/}
                                {/*        newTransaction && newTransaction.category_code === cat.referencecode*/}
                                {/*            ? newTransaction*/}
                                {/*            : undefined*/}
                                {/*    }*/}
                                {/*    key={cat.referencecode}*/}
                                {/*    />*/}
                            </div>
                        ))
                        }
                    </div>

                    <div className={`flex w-full `}>
                        <Transactions
                            userId={session.user.id}
                            year={year}
                            month={month}
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
                            setNewTransaction(addedTransaction);
                            refreshCategoryTrackerAction(addedTransaction.category_code);
                            setTimeout(() => setNewTransaction(null), 10);
                        }
                    }}
                />
            )}

            <div className={`h-[60px]`}></div>
            <MobileBottomBar onCreate={() => setOpen(true)} />

        </>
    );
}
