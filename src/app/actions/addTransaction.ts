"use server";

import { pool } from "@/lib/db";

export async function addTransaction(data: {
    userId: string;
    budgetCode: string;
    category: string;
    description: string;
    amount: number;
    transaction_date: string;
    is_recurring: boolean
}) {
    const query = `
    INSERT INTO transactions (user_id, budget_code, category_code, description, amount, transaction_date, is_recurring)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;
    const values = [
        data.userId,
        data.budgetCode,
        data.category,
        data.description,
        data.amount,
        data.transaction_date,
        data.is_recurring
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
}
