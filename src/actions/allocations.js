"use server";

import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

export async function getSpendingData(userId, year, month) {
    try {
        const spendingResult = await pool.query(`
            SELECT savings_percentage, needs_percentage, wants_percentage
            FROM spending_allocation
            WHERE user_id = $1 AND year = $2 AND month = $3
        `, [userId, year, month]);

        const incomeResult = await pool.query(`
            SELECT income_amount 
            FROM income 
            WHERE user_id = $1 AND year = $2 AND month = $3
        `, [userId, year, month]);

        return {
            allocation: spendingResult.rows.length ? spendingResult.rows[0] : { savings_percentage: 0, needs_percentage: 0, wants_percentage: 0 },
            income: incomeResult.rows.length ? incomeResult.rows[0].income_amount : 0
        };
    } catch (error) {
        console.error("🚨 Database Error:", error);
        return { allocation: null, income: null };
    }
}
