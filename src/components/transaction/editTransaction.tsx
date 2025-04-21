"use client";

import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { updateTransactionThunk } from "@/store/transactionsSlice";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { updateTransaction } from "@/actions/updateTransaction";

interface Transaction {
    referencecode: string;
    description: string;
    amount: number;
    transaction_date: string;
    category_code: string;
    is_recurring: boolean;
}

interface EditTransactionProps {
    transaction: Transaction;
    onCloseAction: (updatedTransaction?: Transaction) => void;
    refreshTransactions?: () => void;
}

export function EditTransaction({
    transaction,
    onCloseAction
}: EditTransactionProps) {
    const dispatch = useAppDispatch();
    const [description, setDescription] = useState(transaction.description);
    const [amount, setAmount] = useState(transaction.amount);
    const initialDate = new Date(transaction.transaction_date)
        .toISOString()
        .split("T")[0];
    const [transactionDate, setTransactionDate] = useState(initialDate);
    const [isRecurring, setIsRecurring] = useState(transaction.is_recurring);

    const handleSave = async () => {
        const updatedTransaction = {
            referencecode: transaction.referencecode,
            description,
            amount,
            transaction_date: transactionDate,
            note: "", // Add if needed
            is_recurring: isRecurring,
            category_code: transaction.category_code // Add this line
        };

        try {
            await dispatch(updateTransactionThunk({ 
                data: updatedTransaction,
                categoryCode: transaction.category_code 
            })).unwrap();
            
            onCloseAction(updatedTransaction);
        } catch (error) {
            console.error("Error updating transaction:", error);
        }
    };

    return (
        <Dialog open={true} onOpenChange={(open) => !open && onCloseAction()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Transaction</DialogTitle>
                    <DialogDescription>
                        Update the details of your transaction below.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Description
                        </Label>
                        <Input
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">
                            Amount
                        </Label>
                        <Input
                            id="amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="transaction_date" className="text-right">
                            Date
                        </Label>
                        <Input
                            id="transaction_date"
                            type="date"
                            value={transactionDate}
                            onChange={(e) => setTransactionDate(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="is_recurring" className="text-right">
                            Recurring?
                        </Label>
                        <Checkbox
                            id="is_recurring"
                            checked={isRecurring}
                            onCheckedChange={(checked) => setIsRecurring(!!checked)}
                            className="w-4 h-4" // Adjust size as needed
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSave}>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}