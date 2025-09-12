// In createIncomeEntry.ts
"use server";

import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

export type CreateIncomeEntryParams = {
    userId: string;
    year: number;
    month: number;
    income_amount: number;
};

export async function createIncomeEntry({
    userId,
    year,
    month,
    income_amount,
}: CreateIncomeEntryParams) {
    try {
        const result = await pool.query(
            `
                INSERT INTO income (user_id, year, month, income_amount)
                VALUES ($1, $2, $3, $4)
                RETURNING referencecode, income_amount;
            `,
            [userId, year, month, income_amount]
        );

        return result.rows.length ? result.rows[0] : null;
    } catch (error) {
        console.error("🚨 Database Error (createIncomeEntry):", error);
        return null;
    }
}
