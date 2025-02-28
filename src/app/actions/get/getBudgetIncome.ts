"use server";

import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

export async function getBudgetIncome(userid: string, year: number, month: number) {
    try {
        const result = await pool.query(
            `SELECT *
             FROM income
             WHERE user_id = $1 AND year = $2 AND month = $3
             `,
            [userid, year, month]
        );

        return result.rows;
    } catch (error) {
        console.error("🚨 Database Error (getBudgetForMonth):", error);
        return [];
    }
}
