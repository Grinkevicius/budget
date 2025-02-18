'use client';

import Header from '@/components/navbar'
import Income from '@/components/income'
import Allocations from '@/components/setAllocations'


export default function BudgetCards() {
    return (
        <>
        <Header />
            <Income userId={"1"} year={2025} month={2}/>
            <Allocations userId={"1"} year={2025} month={2} />

        </>
    );
}
