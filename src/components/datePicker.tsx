"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { format, addMonths } from "date-fns";
import { MonthYearCalendar } from "@/components/MonthlyYearCalendar";
import { ArrowRight, ArrowLeft } from "lucide-react";

export function MonthYearPicker({
    month,
    year,
    onChangeAction,
}: {
    month: number;
    year: number;
    onChangeAction: (month: number, year: number) => void;
}) {
    const [open, setOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date(year, month - 1, 1));

    useEffect(() => {
        setSelectedDate(new Date(year, month - 1, 1));
    }, [month, year]);

    const handleSelect = (date: Date) => {
        setSelectedDate(date);
        onChangeAction(date.getMonth() + 1, date.getFullYear());
        setOpen(false);
    };

    const handleNext = () => {
        const nextDate = addMonths(selectedDate, 1);
        setSelectedDate(nextDate);
        onChangeAction(nextDate.getMonth() + 1, nextDate.getFullYear());
    };

    const handlePrevious = () => {
        const prevDate = addMonths(selectedDate, -1);
        setSelectedDate(prevDate);
        onChangeAction(prevDate.getMonth() + 1, prevDate.getFullYear());
    };

    return (
        <div className="md:w-[50%] lg:w-[35%] grid grid-cols-[10%_80%_10%] w-full px-4 md:p-2 md:pt-2">
            <div className="flex  justify-center items-center">
                <Button
                    onClick={handlePrevious}
                    variant="outline"
                    className="dark:bg-[#18181b] w-full rounded-3xl justify-center text-center shadow-md font-normal"
                >
                    <ArrowLeft />
                </Button>
            </div>
            <div className="flex  justify-center items-center p-4 md:p-2 pt-4 md:pt-2">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="dark:bg-[#18181b] w-full rounded-3xl justify-center text-center shadow-md font-normal"
                            onClick={() => setOpen(true)}
                        >
                            {format(selectedDate, "MMMM yyyy")}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                        <MonthYearCalendar selectedDate={selectedDate} onSelectAction={handleSelect} />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="flex  justify-center items-center">
                <Button
                    onClick={handleNext}
                    variant="outline"
                    className="dark:bg-[#18181b] w-full rounded-3xl justify-center text-center shadow-md font-normal"
                >
                    <ArrowRight />
                </Button>
            </div>
        </div>
    );
}
