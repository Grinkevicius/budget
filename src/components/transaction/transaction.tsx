import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { Badge } from "@/components/ui/badge"

export default function Transaction({
    description,
    amount,
    transaction_date,
    is_recurring,
    category_code
}: {
    description: string;
    amount: number;
    transaction_date: Date | string;
    is_recurring: boolean;
    category_code: string;
}) {

    const formattedDate =
        transaction_date instanceof Date
            ? transaction_date.toLocaleDateString()
            : new Date(transaction_date).toLocaleDateString();

    const getColor = () => {
        switch (category_code) {
            case "CAT2025022222030415": return "rgb(219, 234, 254)";
            case "CAT20250222220304D1": return "rgb(254, 249, 195)";
            case "CAT202502222203044D": return "rgb(220, 252, 231)";
        }
    }

    // const getDesc = () => {
    //     switch (category_code) {
    //         case "CAT2025022222030415": return "Needs";
    //         case "CAT20250222220304D1": return "Wants";
    //         case "CAT202502222203044D": return "Savings";
    //     }
    // }

    return (
        <div className="border p-3 mb-1 mt-1 rounded-lg hover:shadow-lg transition-shadow duration-200 bg-white">

            <div className="flex sm:flex-col lg:flex-row items-center justify-between sm:justify-start w-full">
                <div className="flex items-center sm:w-full sm:items-center sm:justify-start space-x-4">

                    <Badge
                        variant="outline"
                        className="px-3 py-1 font-thin text-black uppercase rounded-lg shadow-sm"
                        style={{ backgroundColor: getColor() }}
                    >
                        ${Number(amount).toFixed(0)}
                    </Badge>

                    <span className="text-sm font-medium text-gray-800">{description}</span>

                </div>

                <div className="flex items-center sm:w-full sm:justify-end space-x-2 text-gray-500">

                    <span className="text-sm">{formattedDate}</span>
                    {is_recurring && (
                        <ArrowPathIcon className="h-4 w-4 text-gray-500" />
                    )}

                </div>

            </div>

        </div>

    );
}
