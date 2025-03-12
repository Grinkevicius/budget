"use client";

import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox"; // Import Checkbox component
import { addTransaction } from "@/app/actions/addTransaction";

interface TransactionInputProps {
    userId: string;
    budgetCode: string;
    categories: { referencecode: string; type: string }[];
    onCloseAction: (addedTransaction?: never) => void;
}

export function AddTransactionDialog({
                                         userId,
                                         budgetCode,
                                         categories,
                                         onCloseAction,
                                     }: TransactionInputProps) {
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState(
        categories.length ? categories[0].referencecode : ""
    );
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [isRecurring, setIsRecurring] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!description || !amount || !category) return;
        setLoading(true);
        try {
            const newTransaction = await addTransaction({
                userId,
                budgetCode,
                category,
                description,
                amount: Number(amount),
                transaction_date: date,
                is_recurring: isRecurring,
            });
            onCloseAction(newTransaction);
        } catch (error) {
            console.error("Error adding transaction:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={true} onOpenChange={(open) => !open && onCloseAction()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Transaction</DialogTitle>
                    <DialogDescription>
                        Fill in the details to add a new transaction.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {/* Description */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Description
                        </Label>
                        <Input
                            id="description"
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    {/* Amount */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">
                            Amount
                        </Label>
                        <Input
                            id="amount"
                            type="number"
                            placeholder="Amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    {/* Category */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">
                            Category
                        </Label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="col-span-3 p-2 border border-gray-300 rounded"
                        >
                            {categories.map((c) => (
                                <option key={c.referencecode} value={c.referencecode}>
                                    {c.type}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Date */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="date" className="text-right">
                            Date
                        </Label>
                        <Input
                            id="date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="col-span-3"
                        />
                    </div>
                    {/* Recurring Checkbox */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="is_recurring" className="text-right">
                            Recurring?
                        </Label>
                        <div className="col-span-3 flex items-center">
                            <Checkbox
                                id="is_recurring"
                                checked={isRecurring}
                                onCheckedChange={(checked) => setIsRecurring(Boolean(checked))}
                                className="w-4 h-4"
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading ? "Saving..." : "Add Transaction"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
