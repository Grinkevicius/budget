"use server";

import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

export async function getTransactions(userId: string, year: number, month: number, category_code: string) {
    try {
        let result;
        if (category_code !== "") {
            result = await pool.query(
                `SELECT t.referencecode, t.description, t.amount, t.transaction_date, c.type, t.category_code, t.is_recurring
             FROM transactions t
                      JOIN categories c ON t.category_code = c.referencecode
                      JOIN budgets b ON t.budget_code = b.referencecode
             WHERE b.user_id = $1
               AND b.year = $2
               AND b.month = $3
               AND t.category_code = $4
             ORDER BY t.transaction_date desc`,
                [userId, year, month, category_code]
            );

        } else {
            result = await pool.query(
                `SELECT t.referencecode, t.description, t.amount, t.transaction_date, c.type, t.category_code, t.is_recurring
             FROM transactions t
                      JOIN categories c ON t.category_code = c.referencecode
                      JOIN budgets b ON t.budget_code = b.referencecode
             WHERE b.user_id = $1
               AND b.year = $2
               AND b.month = $3
             ORDER BY t.transaction_date desc `,
                [userId, year, month]
            );

        }

        return result.rows;
    } catch {
        return [];
    }
}
