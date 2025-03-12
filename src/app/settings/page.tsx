'use client';

import Income from '@/components/income'
import Allocations from '@/components/setAllocations'
import {useSession} from "next-auth/react";


export default function BudgetCards() {
    const { data: session } = useSession();

    if (!session) return null;

    return (
        <>
            <Income userId={session.user.id}/>
            <Allocations userId={session.user.id} />
        </>
    );
}
