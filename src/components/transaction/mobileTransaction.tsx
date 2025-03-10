import { Card } from "@/components/ui/card";
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { Badge } from "@/components/ui/badge"

export default function MobileTransaction({
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

    const getDesc = () => {
        switch (category_code) {
            case "CAT2025022222030415": return "Needs";
            case "CAT20250222220304D1": return "Wants";
            case "CAT202502222203044D": return "Savings";
        }
    }

    return (
        <div className="relative pb-2 pt-1 hover:shadow-md transition-shadow duration-200">

            <div className={`inline-flex w-full items-center justify-between`}>

                <div className={`inline-flex w-full items-center justify-start`}>
                        {/*<Badge variant="outline" style={{backgroundColor: getColor()}}>{getDesc()}</Badge>*/}
                    <Badge variant="outline" style={{backgroundColor: getColor()}}>${Number(amount).toFixed(0)}</Badge>
                    <span className="flex justify-start text-sm font-medium pl-2 text-gray-800">{description}</span>


                </div>

                <div className="inline-flex w-full pl-1 pt-1 items-center justify-end">
                    {/*<span className="text-sm md:text-xs px-2 text-gray-500 md:mt-1">*/}
                    {/*        ${Number(amount).toFixed(2)}*/}
                    {/*    </span>*/}

                    <div className={`inline-flex items-center`}>

                        <span className="text-sm md:text-xs text-gray-500">{formattedDate}</span>
                        { is_recurring ? (
                            <div className={``}>
                                <ArrowPathIcon className="h-4 w-5 text-gray-500" />
                            </div>
                        ) : "" }
                    </div>
                </div>

            </div>
        </div>
    );
}
