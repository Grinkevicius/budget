import { useEffect, useState } from "react";
import { getBudgetIncome } from "@/app/actions/get/getBudgetIncome";
import { createIncomeEntry } from "@/app/actions/create/createIncomeEntry";
import { deleteIncomeEntry } from "@/app/actions/delete/deleteIncomeEntry";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type Props = {
    userid: string;
    selectedMonth: number;
    selectedYear: number;
};

export type Income = {
    referencecode: string;
    income_amount: number;
};

export default function BudgetIncome({
     userid,
     selectedMonth,
     selectedYear,
 }: Props) {
    const [totalIncome, setTotalIncome] = useState<number>(0);
    const [income, setIncome] = useState<Income[]>([]);

    useEffect(() => {
        async function fetchIncome() {
            let total = 0;
            const fetchedIncome = await getBudgetIncome(userid, selectedYear, selectedMonth);
            fetchedIncome.forEach((inc: Income) => {
                total += Number(inc.income_amount);
            });
            setTotalIncome(total);
            setIncome(fetchedIncome);
        }
        fetchIncome();
    }, [selectedMonth, selectedYear]);

    async function handleAddIncome(newAmount: number) {
        try {
            const newEntry: Income = await createIncomeEntry({
                userId: userid,
                year: selectedYear,
                month: selectedMonth,
                income_amount: newAmount,
            });
            setIncome((prev) => [...prev, newEntry]);
            setTotalIncome((prev) => prev + newAmount);
        } catch (error) {
            console.error("Error adding income:", error);
        }
    }

    function handleRemoveIncome(referencecode: string) {
        const removedEntry = income.find((inc) => inc.referencecode === referencecode);
        if (removedEntry) {
            setIncome((prev) => prev.filter((inc) => inc.referencecode !== referencecode));
            setTotalIncome((prev) => prev - removedEntry.income_amount);

            deleteIncomeEntry({ userId: userid, referenceCode: removedEntry.referencecode});
        }
    }

    return (
        <div className="flex items-center space-x-4">
            <span>Income: {totalIncome}</span>
            <ManageIncomeModal
                income={income}
                onAdd={handleAddIncome}
                onRemove={handleRemoveIncome}
            />
        </div>
    );
}

type ManageIncomeModalProps = {
    income: Income[];
    onAdd: (newAmount: number) => Promise<void>;
    onRemove: (referencecode: string) => void;
};

export function ManageIncomeModal({
    income,
    onAdd,
    onRemove,
}: ManageIncomeModalProps) {
    const [open, setOpen] = useState(false);
    const [newIncome, setNewIncome] = useState<number>(0);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Manage Income</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogTitle>Manage Income</DialogTitle>
                <DialogDescription>
                    Add new income entries or remove existing ones.
                </DialogDescription>
                <div className="mt-4 space-y-4">
                    {/* Input to add a new income entry */}
                    <div className="flex items-center space-x-2">
                        <Input
                            type="number"
                            value={newIncome || ""}
                            onChange={(e) => setNewIncome(Number(e.target.value))}
                            placeholder="Enter income amount"
                            className="flex-1"
                        />
                        <Button
                            onClick={async () => {
                                if (newIncome > 0) {
                                    await onAdd(newIncome);
                                    setNewIncome(0);
                                }
                            }}
                        >
                            Add
                        </Button>
                    </div>
                    <div className="flex flex-col space-y-2">
                        {income.map((inc) => (
                            <div
                                key={inc.referencecode}
                                className="flex items-center justify-between rounded border p-2"
                            >
                                <span>{inc.income_amount}</span>
                                <Button variant="destructive" onClick={() => onRemove(inc.referencecode)}>
                                    Remove
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
                <DialogClose asChild>
                    <Button className="mt-4" onClick={() => setOpen(false)}>
                        Close
                    </Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    );
}
