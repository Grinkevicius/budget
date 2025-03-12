import { Card } from "@/components/ui/card";
import { ArrowPathIcon } from '@heroicons/react/24/outline';

export default function TransactionDeprecated({
    description,
    amount,
    transaction_date,
    is_recurring
}: {
    description: string;
    amount: number;
    transaction_date: Date | string;
    is_recurring: boolean;
}) {
    const formattedDate =
        transaction_date instanceof Date
            ? transaction_date.toLocaleDateString()
            : new Date(transaction_date).toLocaleDateString();

    return (
        <Card className="relative mb-2 p-3 hover:shadow-md transition-shadow duration-200">
            { is_recurring ? (
            <div className={`absolute top-[-8px] left-[-8px]`}>
                <ArrowPathIcon className="h-5 w-5 text-gray-500" />
            </div>
            ) : "" }
            <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-800">{description}</span>
                <span className="text-xs text-gray-500 mt-1">
                    ${Number(amount).toFixed(2)}
                </span>
            </div>
            <div className="absolute top-1 right-2">
                <span className="text-xs text-gray-500">{formattedDate}</span>
            </div>
        </Card>
    );
}
