import {useEffect, useState} from "react";
import {getBudgetIncome} from "@/app/actions/get/getBudgetIncome";
import {createIncomeEntry} from "@/app/actions/create/createIncomeEntry";
import {deleteIncomeEntry} from "@/app/actions/delete/deleteIncomeEntry";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {ChevronDoubleRightIcon} from "@heroicons/react/16/solid";

type Props = {
    userid: string;
    month: number;
    year: number;
};

export type Income = {
    referencecode: string;
    income_amount: number;
};

export default function BudgetIncome({
     userid,
     month,
     year,
 }: Props) {
    const [totalIncome, setTotalIncome] = useState<number>(0);
    const [income, setIncome] = useState<Income[]>([]);

    useEffect(() => {
        async function fetchIncome() {
            let total = 0;
            const fetchedIncome = await getBudgetIncome(userid, year, month);
            fetchedIncome.forEach((inc: Income) => {
                total += Number(inc.income_amount);
            });
            setTotalIncome(total);
            setIncome(fetchedIncome);
        }

        fetchIncome().then();
    }, [month, year, userid]);

    async function handleAddIncome(newAmount: number) {
        try {
            const newEntry: Income = await createIncomeEntry({
                userId: userid,
                year: year,
                month: month,
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

            deleteIncomeEntry({userId: userid, referenceCode: removedEntry.referencecode}).then();
        }
    }

    return (
        <ManageIncomeModal
            income={income}
            onAdd={handleAddIncome}
            onRemove={handleRemoveIncome}
            totalIncome={totalIncome}
        />
    );
}

type ManageIncomeModalProps = {
    income: Income[];
    onAdd: (newAmount: number) => Promise<void>;
    onRemove: (referencecode: string) => void;
    totalIncome: number;
};

export function ManageIncomeModal({
  income,
  onAdd,
  onRemove,
  totalIncome,
}: ManageIncomeModalProps) {
    const [open, setOpen] = useState(false);
    const [newIncome, setNewIncome] = useState<number>(0);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="flex w-full md:w-[50%] lg:w-[34%] items-center px-4">
                    <div className="flex w-full p-6 md:p-2 bg-white dark:bg-[#18181b] rounded-3xl  border shadow-md cursor-pointer align-center">

                        <div className={`w-full md:inline-flex md:px-4`}>

                                <div className={`flex justify-between text-gray-500`}>
                                    <p className="text-sm uppercase">Income </p>
                                    <ChevronDoubleRightIcon className="h-6 w-6 text-current md:hidden"/>
                                </div>

                                <p className="mt-1 text-3xl md:text-sm md:mt-0 md:px-3 tracking-wide font-bold text-gray-900 dark:text-white">
                                    {
                                        new Intl.NumberFormat("en-US", {
                                            style: "currency",
                                            currency: "USD",
                                        }).format(totalIncome)
                                    }
                                </p>

                                <div className="align-center self-end text-gray-500 hidden md:flex w-[100%] justify-end">
                                    <ChevronDoubleRightIcon className="h-5 w-5 self-end"/>
                                </div>


                            </div>
                    </div>
                </div>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogTitle>Manage Income</DialogTitle>
                <DialogDescription>
                    Add new income entries or remove existing ones.
                </DialogDescription>
                <div className="mt-4 space-y-4 p-5">

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
