import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type MonthYearPickerProps = {
    selectedMonth: number;
    selectedYear: number;
    onChange: (month: number, year: number) => void;
};

export function MonthYearPicker({
                                    selectedMonth,
                                    selectedYear,
                                    onChange,
                                }: MonthYearPickerProps) {
    const months = [
        { value: 1, label: "January" },
        { value: 2, label: "February" },
        { value: 3, label: "March" },
        { value: 4, label: "April" },
        { value: 5, label: "May" },
        { value: 6, label: "June" },
        { value: 7, label: "July" },
        { value: 8, label: "August" },
        { value: 9, label: "September" },
        { value: 10, label: "October" },
        { value: 11, label: "November" },
        { value: 12, label: "December" },
    ];

    // Example: a range of years (current year ±10)
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

    return (
        <div className="flex space-x-4 items-center mb-4">
            <Select
                value={selectedMonth.toString()}
                onValueChange={(value) =>
                    onChange(parseInt(value, 10), selectedYear)
                }
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent>
                    {months.map((m) => (
                        <SelectItem key={m.value} value={m.value.toString()}>
                            {m.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={selectedYear.toString()}
                onValueChange={(value) =>
                    onChange(selectedMonth, parseInt(value, 10))
                }
            >
                <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                    {years.map((y) => (
                        <SelectItem key={y} value={y.toString()}>
                            {y}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
