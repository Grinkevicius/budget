import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { Badge } from "@/components/ui/badge"
import {Card} from "@/components/ui/card";
import {useTheme} from "next-themes";
import { Transaction as TransactionInterface } from "@/store/transactionsSlice";
import { useVault } from "@/contexts/VaultContext";
import { useRouter } from 'next/navigation';
import {Vault} from "lucide-react";

interface TransactionProps extends TransactionInterface {
    color: string;
}

export default function Transaction({
    description,
    amount,
    transaction_date,
    is_recurring,
    category_code,
    vault_code,
    vault_description,
    color
}: TransactionProps) {

    const { theme } = useTheme();
    const date = new Date(transaction_date);
    const formattedDate = date.toLocaleDateString();
    const { setSelectedVaultRef } = useVault();
    const router = useRouter();

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

    const manageVault = (vault_code: string) => {
            setSelectedVaultRef(vault_code);
            router.push('/vaults/manage');
    }


    return (
        <Card key={category_code} className="border p-3 mb-1 mt-1 rounded-lg hover:shadow-lg transition-shadow duration-200 dark:bg-[transparent]">

            <div className="flex sm:flex-col lg:flex-row items-center justify-between sm:justify-start w-full">

                <div className="flex items-center sm:w-full sm:items-center sm:justify-start space-x-4">

                    <Badge
                        variant="outline"
                        className="px-3 py-1 font-light text-black dark:text-white uppercase rounded-lg shadow-sm"
                        style={{ backgroundColor: color !== "" ? color : getColor(category_code) }}
                    >
                        ${Number(amount).toFixed(0)}
                    </Badge>

                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{description}</span>

                </div>

                <div className="flex items-center sm:w-full sm:justify-end space-x-2 lg:w-[100px] text-gray-500">
                    <span className="text-sm">{formattedDate}</span>
                    {is_recurring && (<ArrowPathIcon data-testid={`recurring-icon`} className="h-4 w-4 text-gray-500" />)}
                </div>

            </div>

            { vault_code && (
                <div onClick={() => manageVault(vault_code)} className="flex items-center sm:w-full justify-end">
                     <span className="flex items-center text-gray-500 text-sm hover:text-gray-200 cursor-pointer">{vault_description} <Vault className="h-4 w-4 ml-1" /></span>
                </div>
            )}


        </Card>

    );
}
