"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { format } from "date-fns";
import { MonthYearCalendar } from "@/components/MonthlyYearCalendar";

interface MonthYearPickerProps {
    month: number;
    year: number;
    onChangeAction: (month: number, year: number) => void;
}

export function MonthYearPicker({
    month,
    year,
    onChangeAction,
}: MonthYearPickerProps) {
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

    return (
        <div className="flex w-full md:w-2/6 justify-center items-center p-4 pt-4 md:pt-2">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-full rounded-3xl justify-center text-center shadow-md font-normal"
                        onClick={() => setOpen(true)}
                    >
                        {format(selectedDate, "MMMM yyyy")}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                    <MonthYearCalendar
                        selectedDate={selectedDate}
                        onSelectAction={handleSelect}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
