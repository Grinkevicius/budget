"use server";

import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

/**
 * Fetches the latest budget for a user for a given year and month.
 * Ensures that only one budget is returned.
 */
export async function getBudgetForMonth(userId: string, year: number, month: number) {
    try {
        const result = await pool.query(
            `SELECT referencecode, adjusted_income, adjusted_savings_percentage, 
                    adjusted_needs_percentage, adjusted_wants_percentage
             FROM budgets
             WHERE user_id = $1 AND year = $2 AND month = $3
             ORDER BY created_at DESC 
             LIMIT 1`, // ✅ Ensures only the latest budget is fetched
            [userId, year, month]
        );

        return result.rows.length ? result.rows[0] : null;
    } catch (error) {
        console.error("🚨 Database Error (getBudgetForMonth):", error);
        return null;
    }
}
