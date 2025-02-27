"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Header from "@/components/navbar";
import { getCategories } from "@/app/actions/getCategories";
import { getBudgetForMonth } from "@/app/actions/getBudget";
import TransactionColumn from "@/components/TransactionColumn";
import CategoryTracker from "@/components/categoryTracker";
import { MonthYearPicker } from "@/components/datePicker";
import { Button } from "@/components/ui/button";
import { AddTransactionDialog } from "@/components/addTransaction";
import {createBudget} from "@/app/actions/create/createBudget";

interface Transaction {
    referencecode: string;
    description: string;
    amount: number;
    transaction_date: string;
    category_code: string;
    is_recurring: boolean;
}

export default function BudgetDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [categories, setCategories] = useState<
        { color: string; referencecode: string; type: string }[]
    >([]);

    const [budgetCode, setBudgetCode] = useState<string | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [isBudgetLoading, setIsBudgetLoading] = useState<boolean>(false);
    const [trackerReloads, setTrackerReloads] = useState<{ [key: string]: boolean }>({});
    const [open, setOpen] = useState(false);
    const [newTransaction, setNewTransaction] = useState<Transaction | null>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/signin");
        }
    }, [status, router]);

    //GET CATEGORIES
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
                const data = await getBudgetForMonth(session.user.id, selectedYear, selectedMonth);
                setBudgetCode(data ? data.referencecode : "");
                setIsBudgetLoading(false);
            }
        }
        fetchBudget();
    }, [session, selectedYear, selectedMonth]);

    //CREATE BUDGET
    const handleCreate = async () => {
        const budgetCode = await createBudget(session ? session.user.id : 0, selectedYear, selectedMonth)
        setBudgetCode(budgetCode ? budgetCode.referencecode : "");
    }

    const refreshCategoryTrackerAction = (categoryCode: string) => {
        setTrackerReloads((prev) => ({
            ...prev,
            [categoryCode]: !prev[categoryCode],
        }));
    };

    if (!session) return null;

    return (
        <>
            <Header />
            <div className="p-6">
                <div className="p-6 rounded-2xl">
                    <div className="flex justify-between items-center mb-4">
                        <MonthYearPicker
                            selectedMonth={selectedMonth}
                            selectedYear={selectedYear}
                            onChange={(month, year) => {
                                setSelectedMonth(month);
                                setSelectedYear(year);
                            }}
                        />
                        <Button variant="outline" onClick={() => setOpen(true)}>
                            Add
                        </Button>
                    </div>

                    {isBudgetLoading ? (
                        <p>Loading budget data...</p>
                    ) : !budgetCode ? (
                        <>
                            <p>No budget code found.</p>
                            <Button variant="outline" onClick={handleCreate}>Create</Button>
                        </>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 pb-3 gap-3">
                            {categories.map((cat) => (
                                <div key={cat.referencecode} className="flex flex-col">

                                    <CategoryTracker
                                        category={cat.referencecode}
                                        userId={session.user.id}
                                        year={selectedYear}
                                        month={selectedMonth}
                                        color={cat.color}
                                        reload={trackerReloads[cat.referencecode]}
                                    />



                                    <TransactionColumn
                                        userId={session.user.id}
                                        year={selectedYear}
                                        month={selectedMonth}
                                        category={cat.referencecode}
                                        refreshCategoryTrackerAction={() => refreshCategoryTrackerAction(cat.referencecode)}
                                        newTransaction={
                                            newTransaction && newTransaction.category_code === cat.referencecode
                                                ? newTransaction
                                                : undefined
                                        }
                                        key={cat.referencecode}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {open && (
                        <AddTransactionDialog
                            userId={session.user.id}
                            budgetCode={budgetCode!}
                            categories={categories}
                            onCloseAction={(addedTransaction? : Transaction) => {
                                setOpen(false);
                                if (addedTransaction) {
                                    console.log("New transaction added:", addedTransaction);
                                    setNewTransaction(addedTransaction);
                                    refreshCategoryTrackerAction(addedTransaction.category_code);
                                    setTimeout(() => setNewTransaction(null), 10);
                                }
                            }}
                        />
                    )}
                </div>
            </div>
        </>
    );
}
