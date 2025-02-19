"use server";

import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

export async function addTransaction(userId: string, budgetCode: string, categoryCode: string, description: string, amount: number, transactionDate: string) {
    try {
        await pool.query(
            `INSERT INTO transactions (user_id, budget_code, category_code, description, amount, transaction_date, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
            [userId, budgetCode, categoryCode, description, amount, transactionDate]
        );

        return { message: "Transaction added successfully!" };
    } catch (error) {
        console.error("🚨 Database Insert Error:", error);
        return { error: "Failed to add transaction." };
    }
}
