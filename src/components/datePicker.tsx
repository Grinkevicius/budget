"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { format } from "date-fns";
import { MonthYearCalendar } from "@/components/MonthlyYearCalendar";
import { ArrowRight, ArrowLeft} from "lucide-react"

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
        <div className="grid  grid-cols-[10%_80%_10%] w-full px-4 md:p-2 md:pt-2">
            <div className={`flex w-full justify-center items-center`}>
                <Button
                    variant="outline"
                    className="w-full rounded-3xl justify-center text-center shadow-md font-normal"
                >
                    <ArrowLeft />
                </Button>
            </div>
            <div className="flex w-full justify-center items-center p-4 md:p-2 pt-4 md:pt-2">
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
            <div className={`flex w-full justify-center items-center`}>
                <Button
                    variant="outline"
                    className="w-full rounded-3xl justify-center text-center shadow-md font-normal"
                >
                    <ArrowRight />
                </Button>
            </div>
        </div>


    );
}
