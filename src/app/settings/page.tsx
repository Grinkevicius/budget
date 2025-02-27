'use client';

import Header from '@/components/navbar'
import Income from '@/components/income'
import Allocations from '@/components/setAllocations'


export default function BudgetCards() {
    return (
        <>
        <Header />
            <Income userId={"1000000000"}/>
            <Allocations userId={"1000000000"} />
        </>
    );
}
