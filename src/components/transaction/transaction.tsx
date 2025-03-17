import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { Badge } from "@/components/ui/badge"
import {Card} from "@/components/ui/card";
import {useTheme} from "next-themes";

export default function Transaction({
    description,
    amount,
    transaction_date,
    is_recurring,
    category_code,
    color
}: {
    description: string;
    amount: number;
    transaction_date: Date | string;
    is_recurring: boolean;
    category_code: string;
    color: string;
}) {
    const { theme } = useTheme();
    const formattedDate =
        transaction_date instanceof Date
            ? transaction_date.toLocaleDateString()
            : new Date(transaction_date).toLocaleDateString();

    function getColor(category_code: string) {
        switch (category_code) {
            case "CAT2025022222030415": //NEEDS
                return theme === "dark" ? "#243642" : "rgb(219, 234, 254)";
            case "CAT20250222220304D1": //WANTS
                return theme === "dark" ? "#387478" : "rgb(254, 249, 195)";
            case "CAT202502222203044D": //SAVINGS
                return theme === "dark" ? "#629584" : "rgb(220, 252, 231)";
            default:
                return "#FFFFFF";
        }
    }

    return (
        <Card key={category_code} className="border p-3 mb-1 mt-1 rounded-lg hover:shadow-lg transition-shadow duration-200 dark:bg-[transparent]">

            <div className="flex sm:flex-col lg:flex-row items-center justify-between sm:justify-start w-full">

                <div className="flex items-center sm:w-full sm:items-center sm:justify-start space-x-4">

                    <Badge
                        variant="outline"
                        className="px-3 py-1 font-thin text-black dark:text-white uppercase rounded-lg shadow-sm"
                        style={{ backgroundColor: color !== "" ? color : getColor(category_code) }}
                    >
                        ${Number(amount).toFixed(0)}
                    </Badge>

                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{description}</span>

                </div>

                <div className="flex items-center sm:w-full sm:justify-end space-x-2 lg:w-[100px] text-gray-500">

                    <span className="text-sm">{formattedDate}</span>
                    {is_recurring && (
                        <ArrowPathIcon className="h-4 w-4 text-gray-500" />
                    )}

                </div>

            </div>

        </Card>

    );
}
