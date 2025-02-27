"use server";

import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

export async function createBudget(userId: string | number, year: number, month: number) {
    try {
        const result = await pool.query(
            `SELECT * FROM public.createbudget($1, $2, $3)`,
            [userId, year, month]
        );

        return result.rows.length ? result.rows[0] : null;
    } catch (error) {
        console.error("🚨 Database Error (getBudgetForMonth):", error);
        return null;
    }
}
