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
    year: number,
    month: number
): Promise<Allocation | null> {
    try {
        const result = await pool.query(
            `
                SELECT savings_percentage, needs_percentage, wants_percentage
                FROM spending_allocation
                WHERE user_id = $1 AND year = $2 AND month = $3
            `,
            [userId, year, month]
        );

        console.log("✅ Database Response:", result.rows);

        if (result.rows.length > 0) {
            const data = result.rows[0];
            return {
                savings: data.savings_percentage ?? 0,  // Convert DB fields to expected names
                needs: data.needs_percentage ?? 0,
                wants: data.wants_percentage ?? 0,
            };
        } else {
            console.warn("⚠️ No data found for this user and date.");
            return null;
        }
    } catch (error) {
        console.error("🚨 Database Error:", error);
        return null;
    }
}

export async function updateSpendingAllocation(
    userId: string,
    year: number,
    month: number,
    savings: number,
    needs: number,
    wants: number
): Promise<UpdateAllocationResponse> {
    try {
        await pool.query(
            `
            INSERT INTO spending_allocation (user_id, year, month, savings_percentage, needs_percentage, wants_percentage)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (user_id, year, month)
            DO UPDATE SET savings_percentage = $4, needs_percentage = $5, wants_percentage = $6
            `,
            [userId, year, month, savings, needs, wants]
        );

        return { message: "Allocation updated successfully!" };
    } catch (error) {
        console.error("🚨 Database Update Error:", error);
        return { error: "Failed to update allocation." };
    }
}
