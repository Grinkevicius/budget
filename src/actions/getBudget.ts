"use server";

import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

export async function getBudgetForMonth(userId: string, year: number, month: number) {
    try {
        const result = await pool.query(
            `SELECT referencecode
             FROM budgets
             WHERE user_id = $1 AND year = $2 AND month = $3
             ORDER BY created_at DESC 
             LIMIT 1`,
            [userId, year, month]
        );

        return result.rows.length ? result.rows[0] : null;
    } catch (error) {
        console.error("🚨 Database Error (getBudgetForMonth):", error);
        return null;
    }
}
