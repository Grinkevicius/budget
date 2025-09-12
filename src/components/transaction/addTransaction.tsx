"use client";

import { useState } from "react";
import { Transaction } from "@/store/transactionsSlice";
import { useAppDispatch } from "@/store/hooks";
import { addTransactionThunk } from "@/store/transactionsSlice";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";


interface AddTransactionDialogProps {
    userId: string;
    budgetCode: string;
    categories: { referencecode: string; type: string }[];
    onCloseAction: (transaction?: Transaction) => void;
}

export function AddTransactionDialog({
    userId,
    budgetCode,
    categories,
    onCloseAction,
}: AddTransactionDialogProps) {
    const dispatch = useAppDispatch();
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState<number>(0);
    const [category, setCategory] = useState("");
    const [transactionDate, setTransactionDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [isRecurring, setIsRecurring] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!category || !description || amount <= 0) {
            return;
        }

        setIsSubmitting(true);
        const transactionData = {
            userId,
            budgetCode,
            category,
            description,
            amount,
            transaction_date: transactionDate,
            is_recurring: isRecurring,
        };

        try {
            const resultAction = await dispatch(addTransactionThunk(transactionData)).unwrap();
            onCloseAction(resultAction.transaction);
        } catch (error) {
            console.error("Failed to add transaction:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={true} onOpenChange={() => onCloseAction()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Transaction</DialogTitle>
                    <DialogDescription>
                        Add a new transaction to your budget.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category" className="text-right">
                                Category
                            </Label>
                            <Select
                                value={category}
                                onValueChange={setCategory}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem
                                            key={cat.referencecode}
                                            value={cat.referencecode}
                                        >
                                            {cat.type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

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
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button 
                            type="submit" 
                            disabled={isSubmitting || !category || !description || amount <= 0}
                        >
                            {isSubmitting ? 'Adding...' : 'Add Transaction'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}