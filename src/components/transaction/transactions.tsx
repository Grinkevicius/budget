"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {clearTransactions, fetchTransactions} from "@/store/transactionsSlice";
import Transaction from "@/components/transaction/transaction";
import Spinner from "@/components/ui/spinner";

interface TransactionColumnProps {
    userId: string;
    year: number;
    month: number;
    category_code: string;
    color: string;
    reload?: boolean;
}

export default function Transactions({
    userId,
    year,
    month,
    category_code,
    color,
    reload
}: TransactionColumnProps) {
    const dispatch = useAppDispatch();
    const categoryKey = category_code || 'all';
    const transactionsList = useAppSelector(state =>
        state.transactions.transactions[categoryKey]
    ) || {
        items: [],
        loading: false,
        error: null
    };

    useEffect(() => {
        dispatch(clearTransactions());
        dispatch(fetchTransactions({ userId, year, month, category_code }));
    }, [dispatch, userId, year, month, category_code, reload]);

    if (transactionsList.loading) {
        return <Spinner />;
    }

    if (transactionsList.error) {
        return <div>Error: {transactionsList.error}</div>;
    }

    return (
        <div className="w-full px-4 sm:px-2">
            {transactionsList.items.length > 0 ? (
                transactionsList.items.map((t) => (
                    <Transaction key={t.referencecode} color={color} {...t} />
                ))
            ) : (
                <div className={`flex w-full justify-center`}>
                    <p className="text-muted-foreground text-sm">No transactions</p>
                </div>
            )}
        </div>
    );
}