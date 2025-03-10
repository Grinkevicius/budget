"use client";

import * as React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface MonthYearCalendarProps {
    initialYear?: number;
    onSelectAction: (selectedDate: Date) => void;
    selectedDate?: Date;
}

const monthLabels = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export function MonthYearCalendar({
    initialYear,
    onSelectAction,
    selectedDate,
}: MonthYearCalendarProps) {
    const [viewYear, setViewYear] = useState(
        initialYear ?? selectedDate?.getFullYear() ?? new Date().getFullYear()
    );

    useEffect(() => {
        if (selectedDate) {
            setViewYear(selectedDate.getFullYear());
        }
    }, [selectedDate]);

    function handleYearChange(delta: number) {
        setViewYear((prev) => prev + delta);
    }

    function handleMonthClick(monthIndex: number) {
        const newDate = new Date(viewYear, monthIndex, 1);
        onSelectAction(newDate);
    }

    return (
        <div className="p-2 min-w-[220px]">
            <div className="flex items-center justify-between mb-2">
                <Button
                    variant="outline"
                    className="px-2 py-1 text-sm"
                    onClick={() => handleYearChange(-1)}
                >
                    &lt; Year
                </Button>
                <span className="font-semibold">
          {viewYear}
        </span>
                <Button
                    variant="outline"
                    className="px-2 py-1 text-sm"
                    onClick={() => handleYearChange(1)}
                >
                    Year &gt;
                </Button>
            </div>

            <div className="grid grid-cols-3 gap-2">
                {monthLabels.map((label, idx) => {
                    const isSelected =
                        selectedDate &&
                        selectedDate.getFullYear() === viewYear &&
                        selectedDate.getMonth() === idx;

                    return (
                        <Button
                            key={idx}
                            variant={isSelected ? "default" : "outline"}
                            className="text-sm px-2 py-1"
                            onClick={() => handleMonthClick(idx)}
                        >
                            {label}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
}
