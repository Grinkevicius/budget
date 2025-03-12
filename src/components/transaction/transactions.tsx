"use client";

import { useEffect, useState } from "react";
import { getTransactions } from "@/app/actions/getTransactions";
import Transaction from "@/components/transaction/transaction";
import Spinner from "@/components/ui/spinner";

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
    category_code: string;
    reload?: boolean;
}

export default function Transactions({
  userId,
  year,
  month,
  category_code,
  reload
}: TransactionColumnProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                console.log(category_code);
                const data = await getTransactions(userId, year, month, category_code ? category_code : "");
                setTransactions(data);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            } finally {
                setLoading(false);
            }
        })();
    }, [userId, year, month, category_code, reload]);

    if (loading) {
        return (
            <Spinner />
        );
    }

    return (
        <div className="w-full px-4 sm:px-2">
            {transactions.length > 0 ? (
                transactions.map((t) => (
                    <>
                        <Transaction {...t} />
                    </>
                ))
            ) : (
                <div className={`flex w-full justify-center`}>
                    <p className="text-muted-foreground text-sm">No transactions</p>
                </div>
            )}
        </div>


    );
}



