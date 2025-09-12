"use server";

import { pool } from "@/lib/db";

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

        console.log('Budget fetch result:', result.rows);
        return result.rows.length ? result.rows[0] : null;
    } catch (error) {
        console.error("🚨 Database Error (getBudgetForMonth):", error);
        throw error; // Re-throw to let the caller handle it
    }
}
