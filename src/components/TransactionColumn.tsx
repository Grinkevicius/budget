"use client";

import { useEffect, useState } from "react";
import { getTransactions } from "@/app/actions/getTransactions";
import Transaction from "@/components/transaction";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    ContextMenu,
    ContextMenuTrigger,
    ContextMenuContent,
    ContextMenuItem,
} from "@/components/ui/context-menu";
import { EditTransaction } from "@/components/editTransaction";
import { deleteTransaction } from "@/app/actions/deleteTransaction";

interface Transaction {
    referencecode: string;
    description: string;
    amount: number;
    transaction_date: string;
    category_code: string;
    is_recurring: boolean;
}

interface TransactionColumnProps {
    userId: string;
    year: number;
    month: number;
    category: string;
    refreshCategoryTracker: () => void;
    newTransaction?: Transaction;
}
export default function TransactionColumn({
  userId,
  year,
  month,
  category,
  refreshCategoryTracker,
  newTransaction,
}: TransactionColumnProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTransaction, setSelectedTransaction] =
        useState<Transaction | null>(null);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const data = await getTransactions(userId, year, month);
            const filtered = data.filter(
                (t: Transaction) => t.category_code === category
            );
            setTransactions(filtered);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [userId, year, month, category]);

    useEffect(() => {
        if (
            newTransaction &&
            newTransaction.category_code === category &&
            !transactions.some((t) => t.referencecode === newTransaction.referencecode)
        ) {
            console.log("Appending new transaction:", newTransaction);
            setTransactions((prev) => [...prev, newTransaction]);
        }
    }, [newTransaction, category]);

    const handleEditClose = (updatedTransaction?: Transaction | undefined): void => {
        if (updatedTransaction) {
            setTransactions((prev) =>
                prev.map((t) =>
                    t.referencecode === updatedTransaction.referencecode ? updatedTransaction : t
                )
            );
            refreshCategoryTracker();
        }
        setSelectedTransaction(null);
    };

    const handleDelete = async (referencecode: string) => {
        try {
            await deleteTransaction({ referencecode });
            setTransactions((prev) =>
                prev.filter((t) => t.referencecode !== referencecode)
            );
            refreshCategoryTracker();
        } catch (error) {
            console.error("Error deleting transaction:", error);
        }
    };

    if (loading) {
        return (
            <div className="space-y-2 pt-2">
                <Card className="border p-4 rounded-2xl shadow-md animate-pulse">
                    <CardHeader>
                        <CardTitle>
                            <Skeleton className="h-5 w-2/3" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="space-y-1">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-3 w-1/3" />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-2 pt-2">
                {transactions.length > 0 ? (
                    transactions.map((t) => (
                        <ContextMenu key={t.referencecode}>
                            <ContextMenuTrigger asChild>
                                <div>
                                    <Transaction {...t} />
                                </div>
                            </ContextMenuTrigger>
                            <ContextMenuContent>
                                <ContextMenuItem onSelect={() => setSelectedTransaction(t)}>
                                    Edit Transaction
                                </ContextMenuItem>
                                <ContextMenuItem onSelect={() => handleDelete(t.referencecode)}>
                                    Delete Transaction
                                </ContextMenuItem>
                            </ContextMenuContent>
                        </ContextMenu>
                    ))
                ) : (
                    <p className="text-muted-foreground text-sm">No transactions</p>
                )}
            </div>
            {selectedTransaction && (
                <EditTransaction
                    transaction={selectedTransaction}
                    onClose={handleEditClose}
                />
            )}
        </>
    );
}
