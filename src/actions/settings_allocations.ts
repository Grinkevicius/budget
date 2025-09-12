"use server";

import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});


interface UpdateAllocationResponse {
    message?: string;
    error?: string;
}

interface Allocation {
    savings: number;
    needs: number;
    wants: number;
}


export async function getSpendingAllocation(
    userId: string,
): Promise<Allocation | null> {
    try {
        const result = await pool.query(
            `
                SELECT default_savings_percentage, default_needs_percentage, default_wants_percentage
                FROM "user".settings
                WHERE user_id = $1
            `,
            [userId]
        );

        if (result.rows.length > 0) {
            const data = result.rows[0];
            return {
                savings: data.default_savings_percentage ?? 0,
                needs: data.default_needs_percentage ?? 0,
                wants: data.default_wants_percentage ?? 0,
            };

        } else {
            return null;
        }
    } catch {
        return null;
    }
}

export async function updateSpendingAllocation(
    userId: string,
    savings: number,
    needs: number,
    wants: number
): Promise<UpdateAllocationResponse> {
    try {
        await pool.query(
            `
            INSERT INTO "user".settings (user_id, default_savings_percentage, default_needs_percentage, default_wants_percentage, updated_at)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (user_id)
            DO UPDATE SET default_savings_percentage = $2, default_needs_percentage = $3, default_wants_percentage = $4
            `,
            [userId, savings, needs, wants, new Date()]
        );

        return { message: "Allocation updated successfully!" };
    } catch {
        return { error: "Failed to update allocation." };
    }
}
