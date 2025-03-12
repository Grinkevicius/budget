import { useEffect, useState } from "react";
import { getCategoryData } from "@/app/actions/getCategoryData";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Skeleton } from "@/components/ui/skeleton";
import {Button} from "@/components/ui/button";
import { Progress } from "@/components/ui/progress"

ChartJS.register(ArcElement, Tooltip, Legend);

type CategoryData = {
    category_code: string;
    category_type: string;
    allocated_percentage: number;
    income: number;
    max_spend: number;
    spent_amount: number;
}

type Props = {
    category: string;
    userId: string;
    year: number;
    month: number;
    color: string;
    reload?: boolean;
}

export default function CategoryTrackerComponent({
    category,
    userId,
    year,
    month,
    color,
    reload,
}: Props) {
    const [data, setData] = useState<CategoryData | null>(null);
    const [loading, setLoading] = useState(true);
    const [initialLoading, setInitialLoading] = useState(true);
    const [percentSpent, setPercentSpent] = useState(0);

    useEffect(() => {
        async function fetchData() {
            if (initialLoading) {
                setLoading(true);
            }
            const result: CategoryData | null = await getCategoryData(
                category,
                userId,
                year,
                month
            );
            setData(result);
            if (result) {
                const newPercent =
                    result.max_spend > 0
                        ? (result.spent_amount / result.max_spend) * 100
                        : 0;
                setPercentSpent(newPercent);
            }
            if (initialLoading) {
                setLoading(false);
                setInitialLoading(false);
            }
        }
        fetchData();
    }, [category, userId, year, month, reload]);

    if (initialLoading && loading) {
        return (
            <div
                style={{ backgroundColor: color }}
                className="p-3 rounded-2xl shadow-md border flex items-center"
            >
                <Skeleton className="w-[3.5rem] h-[3.5rem] rounded-full mr-3" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-1/3" />
                </div>
            </div>
        );
    }

    if (!data) return <div>No data found.</div>;


    function getColor(category: string) {
        switch (category) {
            case "CAT2025022222030415": return "bg-blue-400";
            case "CAT202502222203044D": return "bg-green-400";
            case "CAT20250222220304D1": return "bg-amber-400";
        }
    }

    const chartData = {
        datasets: [
            {
                data: [
                    data.spent_amount,
                    Math.max(data.max_spend - data.spent_amount, 0),
                ],
                backgroundColor: ["#ef4444", "#22c55e"],
                hoverBackgroundColor: ["#dc2626", "#16a34a"],
                borderWidth: 0,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
        },
        cutout: "75%",
    };

    return (
        <div className={`p-2 w-full`}>
            <div
                style={{ backgroundColor: color }}
                className="p-3 w-full md:w-full rounded-xl shadow-md border flex items-center text-xl justify-between"
            >

                <div className={`items-center justify-center hidden sm:inline-flex `}>
                    <div className="w-[3.3rem] h-[3.3rem] flex items-center justify-center relative">
                        <Doughnut data={chartData} options={chartOptions} />
                        <div className="absolute inset-0 flex items-center justify-center text-black text-xs">
                            {percentSpent.toFixed(0)}%
                        </div>
                    </div>

                    <div className={`flex flex-col px-3`}>
                        <p className={``}>{data.category_type}</p>
                        <div className="text-sm mt-1 xs:block sm:hidden lg:block">
                            <p>
                                ${Number(data.spent_amount)} / ${Number(data.max_spend)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col w-full justify-center sm:hidden">
                    <div className="flex items-center justify-start">
                        <span className={`text-sm`}>{data.category_type}</span>
                    </div>

                    <div className="w-full flex flex-col text-xs items-center">
                        <Progress
                            value={Number(percentSpent.toFixed(0))}
                            indicatorColor={getColor(category)}
                        />
                        <span className={`self-end`}>{percentSpent.toFixed(0)}%</span>
                    </div>
                </div>


                <div className={`hidden md:flex`}>
                    <div className={`w-full text-center`}>
                        <Button variant="ghost">
                            Test
                        </Button>
                    </div>
                </div>


            </div>
        </div>
    );
}
